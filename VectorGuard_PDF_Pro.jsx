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
        var newDoc = app.documents.add(colorSpace);

        for (var k = 0; k < artboardRects.length; k++) {
            updateProgress(artboardIndices.length + 1 + k, "⚡ Placing page " + (k + 1) + " of " + artboardRects.length + "...");
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
            var placedItem = newDoc.placedItems.add();
            placedItem.file = exportedFiles[k];
            placedItem.position = [rect[0], rect[1]];
            placedItem.width = Math.abs(rect[2] - rect[0]);
            placedItem.height = Math.abs(rect[1] - rect[3]);
            if (!isTurbo) {
                placedItem.embed();
            }
        }

        updateProgress(artboardIndices.length * 2 + 1, "⚡ Compiling Un-editable Client PDF...");
        var pdfSaveOpts = new PDFSaveOptions();
        pdfSaveOpts.compatibility = PDFCompatibility.ACROBAT5;
        pdfSaveOpts.preserveEditability = false;
        pdfSaveOpts.generateThumbnails = false;
        pdfSaveOpts.viewAfterSaving = false;
        pdfSaveOpts.optimization = true;
        pdfSaveOpts.compressArt = true;

        newDoc.saveAs(finalPdfFile, pdfSaveOpts);
        newDoc.close(SaveOptions.DONOTSAVECHANGES);

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
