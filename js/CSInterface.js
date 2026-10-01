/**
 * CSInterface - Universal Compatibility Edition
 * Adobe CEP Extension API Interface for Windows and macOS
 */
var SystemPath = {
    USER_DATA: "userData",
    COMMON_FILES: "commonFiles",
    MY_DOCUMENTS: "myDocuments",
    APPLICATION: "application",
    EXTENSION: "extension",
    HOST_APPLICATION: "hostApplication"
};

function CSInterface() {}

CSInterface.prototype.hostEnvironment = (window.__adobe_cep__ && window.__adobe_cep__.getHostEnvironment) 
    ? JSON.parse(window.__adobe_cep__.getHostEnvironment()) 
    : null;

CSInterface.prototype.getOSInformation = function () {
    var userAgent = navigator.userAgent;
    if (navigator.platform === "Win32" || navigator.platform === "Windows") {
        var winVer = "Windows";
        if (userAgent.indexOf("Windows NT 10.0") > -1) winVer = "Windows 10/11";
        return winVer;
    } else if (navigator.platform === "MacIntel" || navigator.platform === "Macintosh") {
        return "Mac";
    }
    return navigator.platform || "Unknown";
};

CSInterface.prototype.getSystemPath = function (pathType) {
    var path = "";
    if (window.__adobe_cep__ && window.__adobe_cep__.getSystemPath) {
        path = decodeURI(window.__adobe_cep__.getSystemPath(pathType));
        if (path.indexOf("file:///") === 0) {
            path = path.substring(8);
        } else if (path.indexOf("file://") === 0) {
            path = path.substring(7);
        }
    }
    return path;
};

CSInterface.prototype.evalScript = function (script, callback) {
    if (window.__adobe_cep__ && window.__adobe_cep__.evalScript) {
        if (callback === null || callback === undefined) {
            callback = function (result) {};
        }
        window.__adobe_cep__.evalScript(script, callback);
    } else {
        console.warn("evalScript called outside Adobe CEP environment: ", script);
        if (callback) callback("mock_result");
    }
};

CSInterface.prototype.openURLInDefaultBrowser = function (url) {
    if (window.__adobe_cep__ && window.__adobe_cep__.openURLInDefaultBrowser) {
        window.__adobe_cep__.openURLInDefaultBrowser(url);
    } else if (window.cep && window.cep.util && window.cep.util.openURLInDefaultBrowser) {
        window.cep.util.openURLInDefaultBrowser(url);
    } else {
        window.open(url, "_blank");
    }
};

CSInterface.prototype.closeExtension = function () {
    if (window.__adobe_cep__ && window.__adobe_cep__.closeExtension) {
        window.__adobe_cep__.closeExtension();
    }
};

CSInterface.prototype.resizeContent = function (width, height) {
    if (window.__adobe_cep__ && window.__adobe_cep__.resizeContent) {
        window.__adobe_cep__.resizeContent(width, height);
    }
};

CSInterface.prototype.addEventListener = function (type, listener, obj) {
    if (window.__adobe_cep__ && window.__adobe_cep__.addEventListener) {
        window.__adobe_cep__.addEventListener(type, listener, obj);
    }
};

CSInterface.prototype.removeEventListener = function (type, listener, obj) {
    if (window.__adobe_cep__ && window.__adobe_cep__.removeEventListener) {
        window.__adobe_cep__.removeEventListener(type, listener, obj);
    }
};

