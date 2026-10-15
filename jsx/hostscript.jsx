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
 * Ultra-Optimized Turbo Engine HostScript
 * ==============================================================================
 */
var ClientPdfHost = {
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

    selectFolder: function (currentPath) {
        try {
            var cleanPath = currentPath ? currentPath.replace(/\\/g, "/") : "";
            var startFolder = (cleanPath && cleanPath.length > 0) ? new Folder(cleanPath) : Folder.desktop;
            var selected = Folder.selectDialog("Select Output Folder for PDF", startFolder);
            if (selected) {
                return selected.fsName;
            }
        } catch (e) {}
        return "";
    },

    revealFolder: function (filePath) {
        try {
            var cleanPath = filePath ? filePath.replace(/\\/g, "/") : "";
            var f = new File(cleanPath);
            if (f.exists) {
                f.parent.execute(); // Reveals folder in Finder (Mac) or File Explorer (Windows)
                return "true";
            } else {
                var fol = new Folder(cleanPath);
                if (fol.exists) {
                    fol.execute();
                    return "true";
                }
            }
        } catch (e) {}
        return "false";
    },

    /**
     * Ultra-Optimized PDF Pipeline
     */
    generatePdf: function (configJsonStr) {
        var prevInteractionLevel = app.userInteractionLevel;
        var progressWin = null;

        try {
            if (!app.documents || app.documents.length === 0) {
                return JSON.stringify({ success: false, error: "No active document open in Illustrator." });
            }

            app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

            var cfg = JSON.parse(configJsonStr);
            var sourceDoc = app.activeDocument;
            var totalArtboards = sourceDoc.artboards.length;

            var scaleMultiplier = parseFloat(cfg.scaleMultiplier) || 200;
            var isPNG = (cfg.format === "PNG");
            var isTransparent = isPNG && (cfg.transparent === true);
            var isTurbo = (cfg.turboMode !== false);
            
            var cleanOutputDir = (cfg.outputDir || "").replace(/\\/g, "/").replace(/\/+$/, "");
            var outputFolder = (cleanOutputDir && cleanOutputDir.length > 0) ? new Folder(cleanOutputDir) : Folder.desktop;
            if (!outputFolder.exists) {
                try { outputFolder.create(); } catch (e) { outputFolder = Folder.desktop; }
            }
            if (!outputFolder.exists) {
                outputFolder = Folder.desktop;
            }

            var pdfFileName = cfg.pdfFileName || (sourceDoc.name.replace(/\.[^\.]+$/, "") + "_Client_Preview.pdf");
            if (!/\.pdf$/i.test(pdfFileName)) {
                pdfFileName += ".pdf";
            }

            // Windows File-Lock Prevention (If PDF is currently open in Acrobat/Reader, don't crash)
            var finalPdfFile = new File(outputFolder.fullName + "/" + pdfFileName);
            if (finalPdfFile.exists) {
                try {
                    var testLock = finalPdfFile.open("e");
                    if (!testLock) {
                        var safeStamp = (new Date()).getTime();
                        pdfFileName = pdfFileName.replace(/\.pdf$/i, "") + "_" + safeStamp + ".pdf";
                        finalPdfFile = new File(outputFolder.fullName + "/" + pdfFileName);
                    } else {
                        finalPdfFile.close();
                    }
                } catch (eLock) {}
            }

            // Filter Artboards
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
            var tempDirName = "vg_fast_" + (new Date().getTime());
            var tempFolder = new Folder(Folder.temp.fsName + "/" + tempDirName);
            if (!tempFolder.exists) {
                tempFolder.create();
            }

            var exportedFiles = [];
            var artboardRects = [];
            var artboardNames = [];

            // Pre-Configured Export Options
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
                try { pngOpts.saveAsHTML = false; } catch (e) {}
            } else {
                jpgOpts = new ExportOptionsJPEG();
                jpgOpts.artBoardClipping = true;
                jpgOpts.antiAliasing = true;
                jpgOpts.qualitySetting = isTurbo ? 88 : 100;
                jpgOpts.horizontalScale = scaleMultiplier;
                jpgOpts.verticalScale = scaleMultiplier;
                try { jpgOpts.optimization = true; } catch (e) {}
            }

            // Step 1: Rapid Export
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

                var actualFile = tempImgFile;
                if (!actualFile.exists) {
                    var matches = tempFolder.getFiles(filePrefix + "*");
                    if (matches && matches.length > 0) {
                        actualFile = matches[0];
                    }
                }

                exportedFiles.push(actualFile);
            }

            // Step 2 & 3: Canvas Assembly & Robust Multi-Tier PDF Save
            var newDoc = null;
            var savedOk = false;
            var pipelineError = null;

            try {
                var colorSpace = sourceDoc.documentColorSpace;
                newDoc = app.documents.add(colorSpace);

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
                    var abWidth = Math.abs(right - left);
                    var abHeight = Math.abs(top - bottom);

                    placed.position = [left, top];
                    placed.width = abWidth;
                    placed.height = abHeight;

                    // Always embed placed raster images to avoid Windows file lock & missing link warnings
                    try {
                        placed.embed();
                    } catch (eEmbed) {}

                    // --- 1. Anti-Vector Trace Guard ---
                    if (cfg.antiTraceGuard) {
                        try {
                            var traceGroup = newDoc.groupItems.add();
                            traceGroup.opacity = 6;
                            var lineCount = 8;
                            var strokeCol = new RGBColor();
                            strokeCol.red = 130; strokeCol.green = 130; strokeCol.blue = 130;
                            for (var li = 1; li <= lineCount; li++) {
                                var pathLine = traceGroup.pathItems.add();
                                var startX = left + (abWidth / lineCount) * li;
                                var startY = top;
                                var endX = left;
                                var endY = top - (abHeight / lineCount) * li;
                                pathLine.setEntirePath([[startX, startY], [endX, endY]]);
                                pathLine.filled = false;
                                pathLine.stroked = true;
                                pathLine.strokeWidth = 0.5;
                                pathLine.strokeColor = strokeCol;
                            }
                        } catch (eTrace) {}
                    }

                    // --- 2. Watermark Protection ---
                    if (cfg.enableWatermark) {
                        try {
                            var wmText = cfg.watermarkText || "PREVIEW ONLY • DO NOT COPY";
                            var wmOpacity = parseFloat(cfg.watermarkOpacity) || 20;
                            var wmStyle = cfg.watermarkStyle || "grid";
                            var wmGroup = newDoc.groupItems.add();
                            wmGroup.opacity = wmOpacity;

                            var wmColor = new RGBColor();
                            wmColor.red = 110; wmColor.green = 110; wmColor.blue = 110;

                            if (wmStyle === "center") {
                                var centerTf = wmGroup.textFrames.add();
                                centerTf.contents = wmText;
                                var cFontSize = Math.max(16, Math.min(abWidth, abHeight) / 10);
                                centerTf.textRange.characterAttributes.size = cFontSize;
                                centerTf.textRange.characterAttributes.fillColor = wmColor;
                                centerTf.position = [left + (abWidth / 2) - 80, top - (abHeight / 2) + 20];
                                try { centerTf.rotate(-35); } catch (eRot) {}
                            } else {
                                // "grid" Repeating Tiled Grid
                                var rows = 3;
                                var cols = 2;
                                var stepX = abWidth / (cols + 1);
                                var stepY = abHeight / (rows + 1);
                                var gFontSize = Math.max(11, Math.min(abWidth, abHeight) / 20);

                                for (var gr = 1; gr <= rows; gr++) {
                                    for (var gc = 1; gc <= cols; gc++) {
                                        var gTf = wmGroup.textFrames.add();
                                        gTf.contents = wmText;
                                        gTf.textRange.characterAttributes.size = gFontSize;
                                        gTf.textRange.characterAttributes.fillColor = wmColor;
                                        var gX = left + stepX * gc - 60;
                                        var gY = top - stepY * gr + 15;
                                        gTf.position = [gX, gY];
                                        try { gTf.rotate(-32); } catch (eRot) {}
                                    }
                                }
                            }
                        } catch (wmErr) {}
                    }

                    // --- 3. Proof & Disclaimer Footer Strip ---
                    if (cfg.copyrightFooter) {
                        try {
                            var footerHeight = Math.max(16, Math.min(22, abHeight * 0.04));
                            var footerRect = newDoc.pathItems.rectangle(bottom + footerHeight, left, abWidth, footerHeight);
                            var bgFooterCol = new RGBColor();
                            bgFooterCol.red = 26; bgFooterCol.green = 26; bgFooterCol.blue = 26;
                            footerRect.fillColor = bgFooterCol;
                            footerRect.stroked = false;
                            footerRect.opacity = 88;

                            var footerTf = newDoc.textFrames.add();
                            var now = new Date();
                            var dateStr = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
                            footerTf.contents = "CONFIDENTIAL CLIENT PROOF • NOT FOR PRODUCTION • " + (sourceDoc.name.replace(/\.[^\.]+$/, "")) + " • " + dateStr;
                            footerTf.textRange.characterAttributes.size = Math.max(6, footerHeight * 0.42);
                            var textWhite = new RGBColor();
                            textWhite.red = 230; textWhite.green = 230; textWhite.blue = 230;
                            footerTf.textRange.characterAttributes.fillColor = textWhite;
                            footerTf.position = [left + 8, bottom + (footerHeight * 0.72)];
                        } catch (ftErr) {}
                    }
                }

                // Step 3: Multi-Tier PDF Save
                // Tier 1: Try with Acrobat 6/7 security options
                try {
                    var pdfOptions = new PDFSaveOptions();
                    try { pdfOptions.compatibility = PDFCompatibility.ACROBAT7; } catch (eCompat7) {
                        try { pdfOptions.compatibility = PDFCompatibility.ACROBAT6; } catch (eCompat6) {
                            pdfOptions.compatibility = PDFCompatibility.ACROBAT5;
                        }
                    }
                    pdfOptions.preserveEditability = false;
                    pdfOptions.generateThumbnails = false;
                    pdfOptions.viewAfterSaving = false;
                    try { pdfOptions.optimization = true; } catch (eOpt) {}
                    try { pdfOptions.compressArt = true; } catch (eComp) {}

                    if (cfg.lockPdfPermissions !== false) {
                        try {
                            pdfOptions.requirePermissionPassword = true;
                            pdfOptions.permissionPassword = "VG_" + (new Date().getTime());
                            pdfOptions.enableCopying = false;
                            if (typeof PDFChangesAllowedEnum !== "undefined" && PDFChangesAllowedEnum.CHANGE128NONE) {
                                pdfOptions.enableChanges = PDFChangesAllowedEnum.CHANGE128NONE;
                            }
                            pdfOptions.enableAddComment = false;
                            if (typeof PDFPrintAllowedEnum !== "undefined" && PDFPrintAllowedEnum.PRINT128HIGHRES) {
                                pdfOptions.enablePrinting = PDFPrintAllowedEnum.PRINT128HIGHRES;
                            }
                        } catch (secErr) {}
                    }

                    newDoc.saveAs(finalPdfFile, pdfOptions);
                    savedOk = true;
                } catch (tier1Err) {
                    // Tier 2 Fallback: If Tier 1 failed (e.g. Acrobat encryption incompatibility on Windows),
                    // immediately save with clean standard PDF options so PDF is ALWAYS generated!
                    try {
                        var fallbackOpts = new PDFSaveOptions();
                        fallbackOpts.preserveEditability = false;
                        fallbackOpts.viewAfterSaving = false;
                        newDoc.saveAs(finalPdfFile, fallbackOpts);
                        savedOk = true;
                    } catch (tier2Err) {
                        pipelineError = tier2Err.toString();
                    }
                }

            } catch (pErr) {
                pipelineError = pErr.toString();
            } finally {
                // ABSOLUTE GUARANTEE: Never leave an "Untitled" document open in Illustrator!
                if (newDoc !== null) {
                    try {
                        newDoc.close(SaveOptions.DONOTSAVECHANGES);
                    } catch (eClose) {}
                }
            }

            if (!savedOk || !finalPdfFile.exists) {
                app.userInteractionLevel = prevInteractionLevel;
                return JSON.stringify({
                    success: false,
                    error: pipelineError || "Could not save PDF file to destination."
                });
            }

            // Step 4: Cleanup temporary image cache
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

            // Step 5: Reveal Folder or Open PDF
            if (cfg.revealFolder && finalPdfFile.exists) {
                try {
                    finalPdfFile.parent.execute();
                } catch (e) {}
            }

            try { $.gc(); } catch (ge) {}

            return JSON.stringify({
                success: true,
                pdfPath: finalPdfFile.fsName,
                folderPath: finalPdfFile.parent.fsName,
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
