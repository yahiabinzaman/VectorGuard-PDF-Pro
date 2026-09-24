#target illustrator

/**
 * HostScript for Client PDF Creator CEP Extension
 */

var ClientPdfHost = {
    /**
     * Get document info for the CEP panel UI
     */
    getDocInfo: function () {
        try {
            if (!app.documents || app.documents.length === 0) {
                return JSON.stringify({
                    hasDoc: false,
                    error: "No active document open in Illustrator."
                });
            }

            var doc = app.activeDocument;
            var docName = "Untitled";
            var docPath = "";
            
            try {
                if (doc.saved && doc.path) {
                    docPath = doc.path.fsName;
                    docName = doc.name.replace(/\.[^\.]+$/, "");
                } else if (doc.name) {
                    docName = doc.name.replace(/\.[^\.]+$/, "");
                    docPath = Folder.desktop.fsName;
                }
            } catch (e) {
                docPath = Folder.desktop.fsName;
            }

            var abCount = doc.artboards ? doc.artboards.length : 0;
            var csName = "RGB";
            try {
                csName = (doc.documentColorSpace === DocumentColorSpace.RGB) ? "RGB" : "CMYK";
            } catch (ce) {}

            return JSON.stringify({
                hasDoc: true,
                docName: docName,
                docPath: docPath,
                artboardCount: abCount,
                colorSpace: csName
            });
        } catch (err) {
            return JSON.stringify({
                hasDoc: false,
                error: err.toString()
            });
        }
    },

    /**
     * Select destination folder dialog
     */
    selectFolder: function (currentPath) {
        try {
            var startFolder = (currentPath && currentPath.length > 0) ? new Folder(currentPath) : Folder.desktop;
            var selected = Folder.selectDialog("Select Output Folder for PDF", startFolder);
            if (selected) {
                return selected.fsName;
            }
        } catch (e) {}
        return "";
    },

    /**
     * Main PDF Generation Routine
     */
    generatePdf: function (configJsonStr) {
        try {
            if (!app.documents || app.documents.length === 0) {
                return JSON.stringify({ success: false, error: "No document is open in Illustrator." });
            }

            var cfg = JSON.parse(configJsonStr);
            var sourceDoc = app.activeDocument;
            var totalArtboards = sourceDoc.artboards.length;

            var scaleMultiplier = parseFloat(cfg.scaleMultiplier) || 200;
            var isPNG = cfg.format === "PNG";
            var isTransparent = isPNG && cfg.transparent === true;
            var outputFolder = new Folder(cfg.outputDir || Folder.desktop.fsName);
            if (!outputFolder.exists) {
                outputFolder.create();
            }

            var pdfFileName = cfg.pdfFileName || (sourceDoc.name.replace(/\.[^\.]+$/, "") + "_Client_Preview.pdf");
            if (!/\.pdf$/i.test(pdfFileName)) {
                pdfFileName += ".pdf";
            }
            var finalPdfFile = new File(outputFolder.fsName + "/" + pdfFileName);

            // Determine Artboards
            var artboardIndices = [];
            if (cfg.artboardMode === "all") {
                for (var a = 0; a < totalArtboards; a++) {
                    artboardIndices.push(a);
                }
            } else {
                var rawRange = (cfg.artboardRange || "").replace(/\s+/g, "");
                var parts = rawRange.split(",");
                for (var p = 0; p < parts.length; p++) {
                    var part = parts[p];
                    if (part.indexOf("-") !== -1) {
                        var rangeBounds = part.split("-");
                        var rStart = parseInt(rangeBounds[0], 10) - 1;
                        var rEnd = parseInt(rangeBounds[1], 10) - 1;
                        if (!isNaN(rStart) && !isNaN(rEnd)) {
                            for (var r = Math.min(rStart, rEnd); r <= Math.max(rStart, rEnd); r++) {
                                if (r >= 0 && r < totalArtboards && !ClientPdfHost.contains(artboardIndices, r)) {
                                    artboardIndices.push(r);
                                }
                            }
                        }
                    } else {
                        var single = parseInt(part, 10) - 1;
                        if (!isNaN(single) && single >= 0 && single < totalArtboards && !ClientPdfHost.contains(artboardIndices, single)) {
                            artboardIndices.push(single);
                        }
                    }
                }
            }

            if (artboardIndices.length === 0) {
                return JSON.stringify({ success: false, error: "No valid artboards selected for export." });
            }

            // Temp folder
            var tempDirName = "ai_pdf_temp_" + (new Date().getTime());
            var tempFolder = new Folder(Folder.temp.fsName + "/" + tempDirName);
            if (!tempFolder.exists) {
                tempFolder.create();
            }

            var exportedFiles = [];
            var artboardRects = [];
            var artboardNames = [];

            // Step 1: Export individual artboards
            for (var i = 0; i < artboardIndices.length; i++) {
                var abIdx = artboardIndices[i];
                var ab = sourceDoc.artboards[abIdx];
                artboardRects.push(ab.artboardRect);
                artboardNames.push(ab.name || ("Artboard_" + (abIdx + 1)));

                sourceDoc.artboards.setActiveArtboardIndex(abIdx);

                var ext = isPNG ? ".png" : ".jpg";
                var tempImgFile = new File(tempFolder.fsName + "/page_" + ClientPdfHost.padZero(i + 1, 4) + ext);

                if (isPNG) {
                    var pngOpts = new ExportOptionsPNG24();
                    pngOpts.artBoardClipping = true;
                    pngOpts.antiAliasing = true;
                    pngOpts.transparency = isTransparent;
                    pngOpts.matte = !isTransparent;
                    if (!isTransparent) {
                        var bgCol = new RGBColor();
                        bgCol.red = 255; bgCol.green = 255; bgCol.blue = 255;
                        pngOpts.matteColor = bgCol;
                    }
                    pngOpts.horizontalScale = scaleMultiplier;
                    pngOpts.verticalScale = scaleMultiplier;
                    sourceDoc.exportFile(tempImgFile, ExportType.PNG24, pngOpts);
                } else {
                    var jpgOpts = new ExportOptionsJPEG();
                    jpgOpts.artBoardClipping = true;
                    jpgOpts.antiAliasing = true;
                    jpgOpts.qualitySetting = 100;
                    jpgOpts.horizontalScale = scaleMultiplier;
                    jpgOpts.verticalScale = scaleMultiplier;
                    sourceDoc.exportFile(tempImgFile, ExportType.JPEG, jpgOpts);
                }

                exportedFiles.push(tempImgFile);
            }

            // Step 2: Create a fresh document and place images
            var colorSpace = sourceDoc.documentColorSpace;
            var newDoc = app.documents.add(colorSpace);

            for (var k = 0; k < artboardRects.length; k++) {
                var rect = artboardRects[k];
                var abTarget;
                if (k === 0) {
                    abTarget = newDoc.artboards[0];
                    abTarget.artboardRect = rect;
                    abTarget.name = artboardNames[0];
                } else {
                    abTarget = newDoc.artboards.add(rect);
                    abTarget.name = artboardNames[k];
                }

                newDoc.artboards.setActiveArtboardIndex(k);

                var placed = newDoc.placedItems.add();
                placed.file = exportedFiles[k];

                var left = rect[0];
                var top = rect[1];
                var right = rect[2];
                var bottom = rect[3];

                placed.position = [left, top];
                placed.width = right - left;
                placed.height = top - bottom;
                placed.embed();
            }

            // Step 3: Save as PDF
            var pdfOptions = new PDFSaveOptions();
            pdfOptions.compatibility = PDFCompatibility.ACROBAT5;
            pdfOptions.preserveEditability = false; // CRITICAL: Protect vector assets
            pdfOptions.generateThumbnails = true;
            pdfOptions.viewAfterSaving = false;
            pdfOptions.optimization = true;
            pdfOptions.compressArt = true;

            newDoc.saveAs(finalPdfFile, pdfOptions);
            newDoc.close(SaveOptions.DONOTSAVECHANGES);

            // Step 4: Cleanup
            if (cfg.autoClean !== false) {
                for (var f = 0; f < exportedFiles.length; f++) {
                    try {
                        if (exportedFiles[f].exists) exportedFiles[f].remove();
                    } catch (e) {}
                }
                try {
                    tempFolder.remove();
                } catch (e) {}
            }

            // Step 5: Open PDF if requested
            if (cfg.openPdf && finalPdfFile.exists) {
                try {
                    finalPdfFile.execute();
                } catch (e) {}
            }

            return JSON.stringify({
                success: true,
                pdfPath: finalPdfFile.fsName,
                pageCount: artboardIndices.length,
                resolution: scaleMultiplier + "%",
                format: isPNG ? "PNG" : "JPG"
            });

        } catch (err) {
            return JSON.stringify({
                success: false,
                error: err.toString()
            });
        }
    },

    padZero: function (num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    },

    contains: function (arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === val) return true;
        }
        return false;
    }
};
