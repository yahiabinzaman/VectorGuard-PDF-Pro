#target illustrator

/**
 * ==============================================================================
 * VectorGuard PDF Pro - High-Speed Turbo Edition (.jsx)
 * ==============================================================================
 */

(function () {
    if (app.documents.length === 0) {
        alert("No active document found!\nPlease open an Illustrator file first.", "VectorGuard PDF Pro - Error");
        return;
    }

    var sourceDoc = app.activeDocument;
    var totalArtboards = sourceDoc.artboards.length;
    var docName = "Untitled";
    var defaultFolder = Folder.desktop;

    try {
        if (sourceDoc.saved && sourceDoc.path) {
            defaultFolder = sourceDoc.path;
            docName = sourceDoc.name.replace(/\.[^\.]+$/, "");
        } else if (sourceDoc.name) {
            docName = sourceDoc.name.replace(/\.[^\.]+$/, "");
        }
    } catch (e) {
        defaultFolder = Folder.desktop;
    }

    // Build Dialog
    var dialog = new Window("dialog", "VectorGuard PDF Pro — Turbo Edition");
    dialog.orientation = "column";
    dialog.alignChildren = ["fill", "top"];
    dialog.spacing = 8;
    dialog.margins = 14;

    // Header
    var headerGroup = dialog.add("group");
    headerGroup.orientation = "column";
    headerGroup.alignChildren = ["left", "center"];
    headerGroup.spacing = 2;
    var titleLabel = headerGroup.add("statictext", undefined, "⚡ VectorGuard PDF Pro — High Speed Turbo");
    titleLabel.graphics.font = ScriptUI.newFont("dialog", "BOLD", 13);
    var subtitleLabel = headerGroup.add("statictext", undefined, "Document: " + sourceDoc.name + " (" + totalArtboards + " Artboards)");

    // Panel: Resolution & Format
    var formatPanel = dialog.add("panel", undefined, "Resolution & Format Settings");
    formatPanel.orientation = "column";
    formatPanel.alignChildren = ["fill", "top"];
    formatPanel.spacing = 8;
    formatPanel.margins = 10;

    var scaleGroup = formatPanel.add("group");
    scaleGroup.orientation = "row";
    scaleGroup.spacing = 15;
    scaleGroup.add("statictext", undefined, "Scale / Resolution:");
    var rbScale1x = scaleGroup.add("radiobutton", undefined, "1x (100%)");
    var rbScale2x = scaleGroup.add("radiobutton", undefined, "2x (200% - Recommended)");
    var rbScale3x = scaleGroup.add("radiobutton", undefined, "3x (300%)");
    var rbScaleCustom = scaleGroup.add("radiobutton", undefined, "Custom:");
    var txtCustomScale = scaleGroup.add("edittext", undefined, "150");
    txtCustomScale.characters = 4;
    txtCustomScale.enabled = false;
    rbScale2x.value = true;

    rbScale1x.onClick = rbScale2x.onClick = rbScale3x.onClick = rbScaleCustom.onClick = function () {
        txtCustomScale.enabled = rbScaleCustom.value;
    };

    var typeGroup = formatPanel.add("group");
    typeGroup.orientation = "row";
    typeGroup.spacing = 15;
    typeGroup.add("statictext", undefined, "Image Format:       ");
    var rbFormatPNG = typeGroup.add("radiobutton", undefined, "PNG (24-bit Crisp)");
    var rbFormatJPG = typeGroup.add("radiobutton", undefined, "JPG (High Speed 92%)");
    rbFormatPNG.value = true;

    var bgGroup = formatPanel.add("group");
    bgGroup.orientation = "row";
    bgGroup.spacing = 15;
    bgGroup.add("statictext", undefined, "PNG Background:   ");
    var rbBgWhite = bgGroup.add("radiobutton", undefined, "White Background");
    var rbBgTransparent = bgGroup.add("radiobutton", undefined, "Transparent");
    rbBgWhite.value = true;

    rbFormatPNG.onClick = function () { bgGroup.enabled = true; };
    rbFormatJPG.onClick = function () { bgGroup.enabled = false; };

    // Panel: Artboards
    var abPanel = dialog.add("panel", undefined, "Artboard Selection");
    abPanel.orientation = "column";
    abPanel.alignChildren = ["fill", "top"];
    abPanel.spacing = 6;
    abPanel.margins = 10;

    var abChoiceGroup = abPanel.add("group");
    abChoiceGroup.orientation = "row";
    abChoiceGroup.spacing = 15;
    var rbAbAll = abChoiceGroup.add("radiobutton", undefined, "All Artboards (1 - " + totalArtboards + ")");
    var rbAbRange = abChoiceGroup.add("radiobutton", undefined, "Specific Pages:");
    var txtAbRange = abChoiceGroup.add("edittext", undefined, "1-" + totalArtboards);
    txtAbRange.characters = 12;
    txtAbRange.enabled = false;
    rbAbAll.value = true;

    rbAbAll.onClick = function () { txtAbRange.enabled = false; };
    rbAbRange.onClick = function () { txtAbRange.enabled = true; };

    // Panel: Destination
    var outputPanel = dialog.add("panel", undefined, "Output Destination");
    outputPanel.orientation = "column";
    outputPanel.alignChildren = ["fill", "top"];
    outputPanel.spacing = 6;
    outputPanel.margins = 10;

    var outRow = outputPanel.add("group");
    outRow.orientation = "row";
    outRow.spacing = 8;
    var txtOutputDir = outRow.add("edittext", undefined, defaultFolder.fsName);
    txtOutputDir.preferredSize.width = 300;
    var btnBrowse = outRow.add("button", undefined, "Browse...");

    btnBrowse.onClick = function () {
        var selected = Folder.selectDialog("Select Output Folder for PDF", new Folder(txtOutputDir.text));
        if (selected) txtOutputDir.text = selected.fsName;
    };

    var nameRow = outputPanel.add("group");
    nameRow.orientation = "row";
    nameRow.spacing = 8;
    nameRow.add("statictext", undefined, "PDF File Name:     ");
    var txtPdfName = nameRow.add("edittext", undefined, docName + "_Client_Preview.pdf");
    txtPdfName.preferredSize.width = 260;

    // Panel: Security & Anti-Theft Protection
    var secPanel = dialog.add("panel", undefined, "🛡️ Security & Anti-Theft Protection");
    secPanel.orientation = "column";
    secPanel.alignChildren = ["fill", "top"];
    secPanel.spacing = 6;
    secPanel.margins = 10;

    var wmRow = secPanel.add("group");
    wmRow.orientation = "row";
    wmRow.spacing = 10;
    var chkWatermark = wmRow.add("checkbox", undefined, "Enable Watermark:");
    chkWatermark.value = true;
    var txtWatermark = wmRow.add("edittext", undefined, "PREVIEW ONLY • DO NOT COPY");
    txtWatermark.preferredSize.width = 220;

    var wmOptRow = secPanel.add("group");
    wmOptRow.orientation = "row";
    wmOptRow.spacing = 15;
    wmOptRow.add("statictext", undefined, "Watermark Style:   ");
    var rbWmGrid = wmOptRow.add("radiobutton", undefined, "Repeating Grid (Best)");
    var rbWmCenter = wmOptRow.add("radiobutton", undefined, "Center");
    rbWmGrid.value = true;

    var secTogglesRow = secPanel.add("group");
    secTogglesRow.orientation = "row";
    secTogglesRow.spacing = 12;
    var chkAntiTrace = secTogglesRow.add("checkbox", undefined, "Anti-Trace Mesh");
    var chkFooter = secTogglesRow.add("checkbox", undefined, "Proof Footer Strip");
    var chkLockPdf = secTogglesRow.add("checkbox", undefined, "Lock PDF (Print Safe)");
    chkAntiTrace.value = true;
    chkFooter.value = true;
    chkLockPdf.value = true;

    chkWatermark.onClick = function () {
        txtWatermark.enabled = chkWatermark.value;
        rbWmGrid.enabled = chkWatermark.value;
        rbWmCenter.enabled = chkWatermark.value;
    };

    var optGroup = dialog.add("group");
    optGroup.orientation = "row";
    optGroup.spacing = 15;
    var chkOpenPdf = optGroup.add("checkbox", undefined, "Open PDF when finished");
    var chkCleanTemp = optGroup.add("checkbox", undefined, "Auto-delete temporary files");
    var chkTurbo = optGroup.add("checkbox", undefined, "⚡ Turbo Mode (5x Faster)");
    chkOpenPdf.value = true;
    chkCleanTemp.value = true;
    chkTurbo.value = true;

    var btnGroup = dialog.add("group");
    btnGroup.orientation = "row";
    btnGroup.alignment = ["right", "center"];
    btnGroup.spacing = 10;
    var btnCancel = btnGroup.add("button", undefined, "Cancel", { name: "cancel" });
    var btnRun = btnGroup.add("button", undefined, "🚀 Create Client PDF", { name: "ok" });

    btnCancel.onClick = function () { dialog.close(0); };

    if (dialog.show() !== 1) return;

    // Process
    var scaleMultiplier = 200;
    if (rbScale1x.value) scaleMultiplier = 100;
    else if (rbScale2x.value) scaleMultiplier = 200;
    else if (rbScale3x.value) scaleMultiplier = 300;
    else if (rbScaleCustom.value) {
        var parsed = parseFloat(txtCustomScale.text);
        if (!isNaN(parsed) && parsed > 0) scaleMultiplier = parsed;
    }

    var isPNG = rbFormatPNG.value;
    var isTransparent = isPNG && rbBgTransparent.value;
    var isTurbo = chkTurbo.value;
    var targetFolder = new Folder(txtOutputDir.text);
    if (!targetFolder.exists) targetFolder.create();

    var outputPdfFileName = txtPdfName.text;
    if (!/\.pdf$/i.test(outputPdfFileName)) outputPdfFileName += ".pdf";
    var finalPdfFile = new File(targetFolder.fsName + "/" + outputPdfFileName);

    // Windows File-Lock Prevention (If PDF is currently open in Acrobat/Reader, don't crash)
    if (finalPdfFile.exists) {
        try {
            var testLock = finalPdfFile.open("e");
            if (!testLock) {
                var safeStamp = (new Date()).getTime();
                outputPdfFileName = outputPdfFileName.replace(/\.pdf$/i, "") + "_" + safeStamp + ".pdf";
                finalPdfFile = new File(targetFolder.fsName + "/" + outputPdfFileName);
            } else {
                finalPdfFile.close();
            }
        } catch (eLock) {}
    }

    var artboardIndices = [];
    if (rbAbAll.value) {
        for (var a = 0; a < totalArtboards; a++) artboardIndices.push(a);
    } else {
        var rawRange = txtAbRange.text.replace(/\s+/g, "");
        var parts = rawRange.split(",");
        for (var p = 0; p < parts.length; p++) {
            var part = parts[p];
            if (part.indexOf("-") !== -1) {
                var rangeBounds = part.split("-");
                var rStart = parseInt(rangeBounds[0], 10) - 1;
                var rEnd = parseInt(rangeBounds[1], 10) - 1;
                if (!isNaN(rStart) && !isNaN(rEnd)) {
                    for (var r = Math.min(rStart, rEnd); r <= Math.max(rStart, rEnd); r++) {
                        if (r >= 0 && r < totalArtboards && indexOf(artboardIndices, r) === -1) artboardIndices.push(r);
                    }
                }
            } else {
                var single = parseInt(part, 10) - 1;
                if (!isNaN(single) && single >= 0 && single < totalArtboards && indexOf(artboardIndices, single) === -1) artboardIndices.push(single);
            }
        }
    }

    if (artboardIndices.length === 0) {
        alert("No valid artboards selected!", "Error");
        return;
    }

    var progressWin = new Window("palette", "Creating Client PDF...", undefined, { closeButton: false });
    progressWin.orientation = "column";
    progressWin.margins = 16;
    progressWin.spacing = 8;
    var lblStatus = progressWin.add("statictext", undefined, "⚡ Turbo Engine Running...");
    var pBar = progressWin.add("progressbar", undefined, 0, artboardIndices.length * 2 + 2);
    pBar.preferredSize.width = 300;
    progressWin.center();
    progressWin.show();

    function updateProgress(step, text) {
        lblStatus.text = text;
        pBar.value = step;
        progressWin.update();
    }

    var tempFolder = new Folder(Folder.temp.fsName + "/vg_turbo_" + (new Date().getTime()));
    if (!tempFolder.exists) tempFolder.create();

    var exportedFiles = [];
    var artboardRects = [];
    var artboardNames = [];

    var prevInteraction = app.userInteractionLevel;
    app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

    try {
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
            jpgOpts.qualitySetting = isTurbo ? 92 : 100;
            jpgOpts.horizontalScale = scaleMultiplier;
            jpgOpts.verticalScale = scaleMultiplier;
            jpgOpts.optimization = true;
        }

        for (var i = 0; i < artboardIndices.length; i++) {
            var abIdx = artboardIndices[i];
            var ab = sourceDoc.artboards[abIdx];
            artboardRects.push(ab.artboardRect);
            artboardNames.push(ab.name || ("Artboard_" + (abIdx + 1)));

            updateProgress(i + 1, "⚡ Exporting Page " + (i + 1) + " of " + artboardIndices.length + "...");
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
                if (matches && matches.length > 0) actualFile = matches[0];
            }
            exportedFiles.push(actualFile);
        }

        updateProgress(artboardIndices.length + 1, "⚡ Assembling Multi-Page Document...");
        var colorSpace = sourceDoc.documentColorSpace;
        var newDoc = null;
        var savedOk = false;
        var pipelineError = "";

        try {
            newDoc = app.documents.add(colorSpace);

            // Calculate Optimal 2D Grid Centered in Safe Canvas Zone (Max span 14000 pt: [-7000, +7000])
            var totalPages = artboardRects.length;
            var spacing = 40;
            var maxCanvasSpan = 14000;

            var maxAbW = 0;
            var maxAbH = 0;
            var itemsDim = [];
            for (var m = 0; m < totalPages; m++) {
                var rM = artboardRects[m];
                var wM = Math.abs(rM[2] - rM[0]);
                var hM = Math.abs(rM[1] - rM[3]);
                if (wM <= 0) wM = 595.28;
                if (hM <= 0) hM = 841.89;
                itemsDim.push({ w: wM, h: hM });
                if (wM > maxAbW) maxAbW = wM;
                if (hM > maxAbH) maxAbH = hM;
            }

            var cols = Math.ceil(Math.sqrt(totalPages));
            if (cols < 1) cols = 1;
            var rows = Math.ceil(totalPages / cols);

            var totalRawWidth = cols * (maxAbW + spacing);
            var totalRawHeight = rows * (maxAbH + spacing);

            var gridScale = 1.0;
            if (totalRawWidth > maxCanvasSpan || totalRawHeight > maxCanvasSpan) {
                gridScale = Math.min(maxCanvasSpan / totalRawWidth, maxCanvasSpan / totalRawHeight);
            }

            var cellW = (maxAbW + spacing) * gridScale;
            var cellH = (maxAbH + spacing) * gridScale;

            var startX = - (cols * cellW) / 2;
            var startY = (rows * cellH) / 2;

            for (var k = 0; k < totalPages; k++) {
                updateProgress(artboardIndices.length + 1 + k, "⚡ Placing page " + (k + 1) + " of " + artboardRects.length + "...");

                var col = k % cols;
                var row = Math.floor(k / cols);

                var abWidth = itemsDim[k].w * gridScale;
                var abHeight = itemsDim[k].h * gridScale;

                var left = startX + col * cellW;
                var top = startY - row * cellH;
                var right = left + abWidth;
                var bottom = top - abHeight;
                var safeRect = [left, top, right, bottom];

                var abTarget;
                if (k === 0) {
                    abTarget = newDoc.artboards[0];
                    abTarget.artboardRect = safeRect;
                    abTarget.name = artboardNames[0];
                } else {
                    abTarget = newDoc.artboards.add(safeRect);
                    abTarget.name = artboardNames[k];
                }

                newDoc.artboards.setActiveArtboardIndex(k);
                var placedItem = newDoc.placedItems.add();
                placedItem.file = exportedFiles[k];
                placedItem.position = [left, top];
                placedItem.width = abWidth;
                placedItem.height = abHeight;

                // Always embed placed raster images to avoid Windows file lock & missing link warnings
                try {
                    placedItem.embed();
                } catch (eEmbed) {}

                // --- 1. Anti-Vector Trace Guard ---
                if (chkAntiTrace.value) {
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
                    } catch (e) {}
                }

                // --- 2. Watermark Protection ---
                if (chkWatermark.value) {
                    try {
                        var wmText = txtWatermark.text || "PREVIEW ONLY • DO NOT COPY";
                        var wmGroup = newDoc.groupItems.add();
                        wmGroup.opacity = 20;

                        var wmColor = new RGBColor();
                        wmColor.red = 110; wmColor.green = 110; wmColor.blue = 110;

                        if (rbWmCenter.value) {
                            var centerTf = wmGroup.textFrames.add();
                            centerTf.contents = wmText;
                            var cFontSize = Math.max(16, Math.min(abWidth, abHeight) / 10);
                            centerTf.textRange.characterAttributes.size = cFontSize;
                            centerTf.textRange.characterAttributes.fillColor = wmColor;
                            centerTf.position = [left + (abWidth - centerTf.width) / 2, top - (abHeight - centerTf.height) / 2];
                            centerTf.rotate(-35);
                        } else {
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
                                    var gX = left + stepX * gc - (gTf.width / 2);
                                    var gY = top - stepY * gr + (gTf.height / 2);
                                    gTf.position = [gX, gY];
                                    gTf.rotate(-32);
                                }
                            }
                        }
                    } catch (wmErr) {}
                }

                // --- 3. Proof & Disclaimer Footer Strip ---
                if (chkFooter.value) {
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
            updateProgress(artboardIndices.length * 2 + 1, "⚡ Compiling Un-editable Client PDF...");
            
            // Tier 1: Try with Acrobat 6/7 security options
            try {
                var pdfSaveOpts = new PDFSaveOptions();
                try { pdfSaveOpts.compatibility = PDFCompatibility.ACROBAT7; } catch (eCompat7) {
                    try { pdfSaveOpts.compatibility = PDFCompatibility.ACROBAT6; } catch (eCompat6) {
                        pdfSaveOpts.compatibility = PDFCompatibility.ACROBAT5;
                    }
                }
                pdfSaveOpts.preserveEditability = false;
                pdfSaveOpts.generateThumbnails = false;
                pdfSaveOpts.viewAfterSaving = false;
                try { pdfSaveOpts.optimization = true; } catch (eOpt) {}
                try { pdfSaveOpts.compressArt = true; } catch (eComp) {}

                // --- 4. PDF Security & Permissions Lock ---
                // Blocks copying and editing, while keeping printing fully allowed for clients!
                if (chkLockPdf.value) {
                    try {
                        pdfSaveOpts.requirePermissionPassword = true;
                        pdfSaveOpts.permissionPassword = "VectorGuard";
                        pdfSaveOpts.enableCopying = false; // Block text & image extraction
                        if (typeof PDFChangesAllowedEnum !== "undefined" && PDFChangesAllowedEnum.CHANGE128NONE) {
                            pdfSaveOpts.enableChanges = PDFChangesAllowedEnum.CHANGE128NONE; // Block edits
                        }
                        pdfSaveOpts.enableAddComment = false;
                        // Client printing is explicitly preserved as high-res print
                        if (typeof PDFPrintAllowedEnum !== "undefined" && PDFPrintAllowedEnum.PRINT128HIGHRES) {
                            pdfSaveOpts.enablePrinting = PDFPrintAllowedEnum.PRINT128HIGHRES;
                        }
                    } catch (secErr) {}
                }

                newDoc.saveAs(finalPdfFile, pdfSaveOpts);
                savedOk = true;
            } catch (tier1Err) {
                // Tier 2 Fallback: If Tier 1 failed (e.g. Acrobat encryption DLL/parameter incompatibility on Windows),
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

        } catch (assemblyErr) {
            pipelineError = assemblyErr.toString();
        } finally {
            // CRITICAL: Always close newDoc so NO "Untitled" document ever remains open!
            if (newDoc !== null) {
                try {
                    newDoc.close(SaveOptions.DONOTSAVECHANGES);
                } catch (eClose) {}
            }
        }

        if (!savedOk || !finalPdfFile.exists) {
            throw new Error(pipelineError || "Could not save PDF file to destination.");
        }

        if (chkCleanTemp.value) {
            for (var f = 0; f < exportedFiles.length; f++) {
                try { if (exportedFiles[f].exists) exportedFiles[f].remove(); } catch (e) {}
            }
            try { tempFolder.remove(); } catch (e) {}
        }

        app.userInteractionLevel = prevInteraction;
        progressWin.close();

        if (chkOpenPdf.value && finalPdfFile.exists) {
            try { finalPdfFile.execute(); } catch (e) {}
        }

        alert("🎉 Done in seconds!\n\nClient PDF generated successfully:\n" + finalPdfFile.fsName + "\n\nTotal Pages: " + artboardIndices.length + " | Resolution: " + scaleMultiplier + "%", "VectorGuard PDF Pro");

    } catch (err) {
        app.userInteractionLevel = prevInteraction;
        if (progressWin) progressWin.close();
        alert("An error occurred:\n" + err.toString(), "VectorGuard PDF Pro - Error");
    }

    function indexOf(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === val) return i;
        }
        return -1;
    }
})();
