document.addEventListener("DOMContentLoaded", function () {
  var csInterface = new CSInterface();

  // Elements
  var docTitle = document.getElementById("docTitle");
  var docMeta = document.getElementById("docMeta");
  var badgeArtboards = document.getElementById("badgeArtboards");
  var btnRefresh = document.getElementById("btnRefresh");
  var statusDot = document.getElementById("statusDot");

  var chips = document.querySelectorAll(".chip");
  var customScaleInput = document.getElementById("customScaleInput");

  var btnFormatPNG = document.getElementById("btnFormatPNG");
  var btnFormatJPG = document.getElementById("btnFormatJPG");
  var pngOptionsRow = document.getElementById("pngOptionsRow");

  var abModeAll = document.getElementById("abModeAll");
  var abModeRange = document.getElementById("abModeRange");
  var rangeInputGroup = document.getElementById("rangeInputGroup");
  var txtArtboardRange = document.getElementById("txtArtboardRange");

  var txtOutputDir = document.getElementById("txtOutputDir");
  var btnBrowseDir = document.getElementById("btnBrowseDir");
  var txtPdfName = document.getElementById("txtPdfName");

  var chkRevealFolder = document.getElementById("chkRevealFolder");
  var chkAutoClean = document.getElementById("chkAutoClean");
  var chkTurbo = document.getElementById("chkTurbo");

  var btnGenerate = document.getElementById("btnGenerate");

  // Futuristic Cyber Progress Elements
  var progressContainer = document.getElementById("progressContainer");
  var progressStatusText = document.getElementById("progressStatusText");
  var progressPct = document.getElementById("progressPct");
  var progressFill = document.getElementById("progressFill");
  var progressSubText = document.getElementById("progressSubText");

  var resultBox = document.getElementById("resultBox");
  var resultMessage = document.getElementById("resultMessage");
  var btnRevealFolder = document.getElementById("btnRevealFolder");
  var linkOpenResult = document.getElementById("linkOpenResult");
  var linkGithub = document.getElementById("linkGithub");

  // State
  var currentScale = 200;
  var currentFormat = "PNG";
  var lastPdfPath = "";
  var lastFolderPath = "";
  var docInfo = null;

  // 1. Scale Chip Selection
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      currentScale = parseInt(chip.getAttribute("data-scale"), 10);
      customScaleInput.value = "";
    });
  });

  customScaleInput.addEventListener("input", function () {
    var val = parseFloat(customScaleInput.value);
    if (!isNaN(val) && val > 0) {
      chips.forEach(function (c) { c.classList.remove("active"); });
      currentScale = val;
    }
  });

  // 2. Format Selection
  btnFormatPNG.addEventListener("click", function () {
    btnFormatPNG.classList.add("active");
    btnFormatJPG.classList.remove("active");
    currentFormat = "PNG";
    pngOptionsRow.style.display = "flex";
  });

  btnFormatJPG.addEventListener("click", function () {
    btnFormatJPG.classList.add("active");
    btnFormatPNG.classList.remove("active");
    currentFormat = "JPG";
    pngOptionsRow.style.display = "none";
  });

  // 3. Artboard Mode Toggle
  abModeAll.addEventListener("change", function () {
    rangeInputGroup.style.display = "none";
  });

  abModeRange.addEventListener("change", function () {
    rangeInputGroup.style.display = "block";
    if (docInfo && docInfo.artboardCount) {
      txtArtboardRange.value = "1-" + docInfo.artboardCount;
    }
    txtArtboardRange.focus();
  });

  // 4. Open External URLs
  function openExternal(url) {
    try {
      if (window.cep && window.cep.util && window.cep.util.openURLInDefaultBrowser) {
        window.cep.util.openURLInDefaultBrowser(url);
      } else if (csInterface && csInterface.openURLInDefaultBrowser) {
        csInterface.openURLInDefaultBrowser(url);
      } else {
        window.open(url, "_blank");
      }
    } catch (e) {
      window.open(url, "_blank");
    }
  }

  if (linkGithub) {
    linkGithub.addEventListener("click", function (e) {
      e.preventDefault();
      openExternal("https://github.com/yahiabinzaman");
    });
  }

  // 5. Refresh Active Document Info
  function refreshDocInfo() {
    csInterface.evalScript("ClientPdfHost.getDocInfo()", function (res) {
      try {
        if (!res || res === "EvalScript error." || res === "undefined") {
          csInterface.evalScript('$.evalFile("' + csInterface.getSystemPath(SystemPath.EXTENSION) + '/jsx/hostscript.jsx")', function () {
            csInterface.evalScript("ClientPdfHost.getDocInfo()", handleDocInfoResponse);
          });
          return;
        }
        handleDocInfoResponse(res);
      } catch (err) {
        handleDocInfoResponse(null);
      }
    });
  }

  function handleDocInfoResponse(res) {
    try {
      var data = typeof res === "string" ? JSON.parse(res) : res;
      if (data && data.hasDoc) {
        docInfo = data;
        docTitle.innerText = data.docName || "Active Document";
        docMeta.innerText = (data.colorSpace || "RGB") + " Document • Ready";
        badgeArtboards.innerText = (data.artboardCount || 1) + " Page" + (data.artboardCount > 1 ? "s" : "");
        badgeArtboards.style.display = "inline-block";
        if (statusDot) statusDot.className = "doc-status-indicator";

        if (!txtOutputDir.value || txtOutputDir.value.trim() === "" || txtOutputDir.value.indexOf("Desktop") !== -1) {
          txtOutputDir.value = data.docPath;
        }
        if (!txtPdfName.value || txtPdfName.value.trim() === "" || txtPdfName.value === "Client_Preview.pdf") {
          txtPdfName.value = (data.docName || "Document") + "_Client_Preview.pdf";
        }
        btnGenerate.disabled = false;
      } else {
        docInfo = null;
        docTitle.innerText = "No Document Open";
        docMeta.innerText = "Please open a file in Illustrator";
        badgeArtboards.style.display = "none";
        if (statusDot) statusDot.className = "doc-status-indicator inactive";
        btnGenerate.disabled = true;
      }
    } catch (e) {
      docTitle.innerText = "Ready";
      docMeta.innerText = "Click Refresh to detect active document";
      badgeArtboards.style.display = "none";
      btnGenerate.disabled = false;
    }
  }

  btnRefresh.addEventListener("click", refreshDocInfo);

  try {
    csInterface.addEventListener("documentAfterActivate", refreshDocInfo);
    csInterface.addEventListener("documentAfterDeactivate", refreshDocInfo);
    csInterface.addEventListener("documentAfterSave", refreshDocInfo);
  } catch (e) {}

  // 6. Browse Destination Folder
  btnBrowseDir.addEventListener("click", function () {
    var cur = (txtOutputDir.value || "").replace(/\\/g, "\\\\");
    csInterface.evalScript('ClientPdfHost.selectFolder("' + cur + '")', function (res) {
      if (res && res !== "null" && res !== "") {
        txtOutputDir.value = res;
      }
    });
  });

  // 7. Non-blocking Asynchronous Execution Trigger
  btnGenerate.addEventListener("click", function () {
    hideResult();
    var isTurbo = chkTurbo ? chkTurbo.checked : true;

    // Show futuristic progress bar right above CTA Button
    progressContainer.style.display = "block";
    progressFill.style.width = "45%";
    progressPct.innerText = "RUNNING";
    progressStatusText.innerText = isTurbo ? "TURBO PIPELINE" : "PROCESSING";
    progressSubText.innerText = "> COMPILING PDF STREAM...";
    btnGenerate.disabled = true;

    var isTransparent = false;
    var pngRadios = document.getElementsByName("pngBg");
    for (var i = 0; i < pngRadios.length; i++) {
      if (pngRadios[i].checked && pngRadios[i].value === "transparent") {
        isTransparent = true;
      }
    }

    var config = {
      scaleMultiplier: currentScale,
      format: currentFormat,
      transparent: isTransparent,
      artboardMode: abModeAll.checked ? "all" : "range",
      artboardRange: txtArtboardRange.value,
      outputDir: txtOutputDir.value,
      pdfFileName: txtPdfName.value,
      revealFolder: chkRevealFolder ? chkRevealFolder.checked : true,
      autoClean: chkAutoClean.checked,
      turboMode: isTurbo
    };

    var configStr = JSON.stringify(config).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

    setTimeout(function () {
      csInterface.evalScript('ClientPdfHost.generatePdf("' + configStr + '")', function (res) {
        btnGenerate.disabled = false;
        progressContainer.style.display = "none";
        try {
          var data = JSON.parse(res);
          if (data && data.success) {
            lastPdfPath = data.pdfPath;
            lastFolderPath = data.folderPath || txtOutputDir.value;
            showResult(true, "PDF Created Successfully (" + data.pageCount + " pages @ " + data.resolution + ")");
          } else {
            showResult(false, "Error: " + (data.error || "Failed to generate PDF."));
          }
        } catch (err) {
          showResult(false, "Error: " + (res || "Could not complete operation."));
        }
      });
    }, 60);
  });

  // 8. Reveal Folder Action (Opens Finder on Mac or File Explorer on Windows)
  if (btnRevealFolder) {
    btnRevealFolder.addEventListener("click", function () {
      var target = lastPdfPath || lastFolderPath || txtOutputDir.value;
      if (target) {
        var escPath = target.replace(/\\/g, "\\\\");
        csInterface.evalScript('ClientPdfHost.revealFolder("' + escPath + '")');
      }
    });
  }

  // 9. Open PDF File Action
  if (linkOpenResult) {
    linkOpenResult.addEventListener("click", function () {
      if (lastPdfPath) {
        var escPath = lastPdfPath.replace(/\\/g, "\\\\");
        csInterface.evalScript('new File("' + escPath + '").execute()');
      }
    });
  }

  function showResult(isSuccess, message) {
    resultBox.style.display = "block";
    resultBox.className = "result-box" + (isSuccess ? "" : " error");
    resultMessage.innerText = message;
    if (btnRevealFolder) btnRevealFolder.style.display = isSuccess ? "inline-block" : "none";
    if (linkOpenResult) linkOpenResult.style.display = isSuccess ? "inline-block" : "none";
  }

  function hideResult() {
    resultBox.style.display = "none";
  }

  // Initial Check
  refreshDocInfo();
});
