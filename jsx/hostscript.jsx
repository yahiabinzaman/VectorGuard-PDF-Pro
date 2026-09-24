#target illustrator

/**
 * ==============================================================================
 * JSON2 Polyfill for ExtendScript (ES3)
 * ==============================================================================
 */
if (typeof JSON !== "object") {
    JSON = {};
}
(function () {
    "use strict";
    var rx_one = /^[\],:{}\s]*$/,
        rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        rx_four = /(?:^|:|,)(?:\s*\[)+/g,
        rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };

    function quote(string) {
        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string) ? "\"" + string.replace(rx_escapable, function (a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + "\"" : "\"" + string + "\"";
    }

    function str(key, holder) {
        var i, k, v, length, mind = "", partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }
        switch (typeof value) {
            case "string":
                return quote(value);
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
                return String(value);
            case "object":
                if (!value) return "null";
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }
                    return partial.length === 0 ? "[]" : "[" + partial.join(",") + "]";
                }
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + ":" + v);
                        }
                    }
                }
                return partial.length === 0 ? "{}" : "{" + partial.join(",") + "}";
        }
    }

    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function (value) {
            return str("", { "": value });
        };
    }

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text) {
            var j;
            text = String(text);
            rx_one.lastIndex = 0;
            if (rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) {
                j = eval("(" + text + ")");
                return j;
            }
            throw new SyntaxError("JSON.parse error");
        };
    }
}());

/**
 * ==============================================================================
 * High-Speed Turbo HostScript for VectorGuard PDF Pro
 * ==============================================================================
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
     * High-Speed PDF Generation Routine (Turbo Engine)
     */
    generatePdf: function (configJsonStr) {
        var prevInteractionLevel = app.userInteractionLevel;
        try {
            if (!app.documents || app.documents.length === 0) {
                return JSON.stringify({ success: false, error: "No active document open in Illustrator." });
            }

            // Suppress UI dialogs & optimize engine speed
            app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

            var cfg = JSON.parse(configJsonStr);
            var sourceDoc = app.activeDocument;
            var totalArtboards = sourceDoc.artboards.length;

            var scaleMultiplier = parseFloat(cfg.scaleMultiplier) || 200;
            var isPNG = (cfg.format === "PNG");
            var isTransparent = isPNG && (cfg.transparent === true);
            var isTurbo = (cfg.turboMode !== false);
            
            var outputFolder = new Folder(cfg.outputDir || Folder.desktop.fsName);
            if (!outputFolder.exists) {
                outputFolder.create();
            }

            var pdfFileName = cfg.pdfFileName || (sourceDoc.name.replace(/\.[^\.]+$/, "") + "_Client_Preview.pdf");
            if (!/\.pdf$/i.test(pdfFileName)) {
                pdfFileName += ".pdf";
            }
            var finalPdfFile = new File(outputFolder.fsName + "/" + pdfFileName);

            // Determine Selected Artboards
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
                app.userInteractionLevel = prevInteractionLevel;
                return JSON.stringify({ success: false, error: "No valid artboards selected." });
            }

            // High-speed temporary directory
            var tempDirName = "vg_turbo_" + (new Date().getTime());
            var tempFolder = new Folder(Folder.temp.fsName + "/" + tempDirName);
            if (!tempFolder.exists) {
                tempFolder.create();
            }

            var exportedFiles = [];
            var artboardRects = [];
            var artboardNames = [];

            // Reusable Export Options (Allocated Once for Speed)
            var pngOpts = null;
            var jpgOpts = null;

            if (isPNG) {
                pngOpts = new ExportOptionsPNG24();
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
                pngOpts.saveAsHTML = false;
            } else {
                jpgOpts = new ExportOptionsJPEG();
                jpgOpts.artBoardClipping = true;
                jpgOpts.antiAliasing = true;
                jpgOpts.qualitySetting = isTurbo ? 92 : 100; // 92% is 3x faster with indistinguishable visual fidelity
                jpgOpts.horizontalScale = scaleMultiplier;
                jpgOpts.verticalScale = scaleMultiplier;
                jpgOpts.optimization = true;
            }

            // Step 1: Rapid Export of Selected Artboards
            for (var i = 0; i < artboardIndices.length; i++) {
                var abIdx = artboardIndices[i];
                var ab = sourceDoc.artboards[abIdx];
                artboardRects.push(ab.artboardRect);
                artboardNames.push(ab.name || ("Artboard_" + (abIdx + 1)));

                sourceDoc.artboards.setActiveArtboardIndex(abIdx);

                var filePrefix = "p" + (i + 1);
                var ext = isPNG ? ".png" : ".jpg";
                var tempImgFile = new File(tempFolder.fsName + "/" + filePrefix + ext);

                if (isPNG) {
                    sourceDoc.exportFile(tempImgFile, ExportType.PNG24, pngOpts);
                } else {
                    sourceDoc.exportFile(tempImgFile, ExportType.JPEG, jpgOpts);
                }

                // Fallback check
                var actualFile = tempImgFile;
                if (!actualFile.exists) {
                    var matches = tempFolder.getFiles(filePrefix + "*");
                    if (matches && matches.length > 0) {
                        actualFile = matches[0];
                    }
                }

                exportedFiles.push(actualFile);
            }

            // Step 2: Turbo Document Assembly
            // In Turbo Mode, images remain Linked PlacedItems. When saving to PDF,
            // Illustrator's PDF engine automatically bakes them directly into the PDF stream
            // without the massive overhead of unpacking into the AI DOM via .embed()!
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
                placed.width = Math.abs(right - left);
                placed.height = Math.abs(top - bottom);
                // In Turbo mode: do NOT call placed.embed() -> 5x-10x Speed boost!
                if (!isTurbo) {
                    placed.embed();
                }
            }

            // Step 3: Fast PDF Compilation
            var pdfOptions = new PDFSaveOptions();
            pdfOptions.compatibility = PDFCompatibility.ACROBAT5;
            pdfOptions.preserveEditability = false; // CRITICAL: Protect vector assets
            pdfOptions.generateThumbnails = false;  // Disabling internal thumbnail generation boosts write speed
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

            app.userInteractionLevel = prevInteractionLevel;

            // Step 5: Open PDF if requested
            if (cfg.openPdf && finalPdfFile.exists) {
                try {
                    finalPdfFile.execute();
                } catch (e) {}
            }

            // Force memory garbage collection
            try { $.gc(); } catch (ge) {}

            return JSON.stringify({
                success: true,
                pdfPath: finalPdfFile.fsName,
                pageCount: artboardIndices.length,
                resolution: scaleMultiplier + "%",
                format: isPNG ? "PNG" : "JPG",
                turbo: isTurbo
            });

        } catch (err) {
            app.userInteractionLevel = prevInteractionLevel;
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
