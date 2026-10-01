@echo off
setlocal enabledelayedexpansion
title VectorGuard PDF Pro - Universal Windows Installer

echo ==============================================================================
echo                 VectorGuard PDF Pro - Universal Windows Installer
echo ==============================================================================
echo.

:: 1. Enable PlayerDebugMode for all CSXS versions in Registry (CSXS 4 - 24)
echo [1/3] Enabling Adobe CEP Debug Mode (CSXS 4 - 24) in Registry...
for /L %%i in (4,1,24) do (
    reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.%%i" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
    reg add "HKEY_LOCAL_MACHINE\Software\Adobe\CSXS.%%i" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
    reg add "HKEY_LOCAL_MACHINE\Software\Wow6432Node\Adobe\CSXS.%%i" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
)
echo      [OK] Debug mode enabled for all Adobe versions.
echo.

:: 2. Target Directories
set "SRC_DIR=%~dp0"
set "USER_CEP=%APPDATA%\Adobe\CEP\extensions\com.colorlab.vectorguardpdf"
set "SYSTEM_CEP=%CommonProgramFiles%\Adobe\CEP\extensions\com.colorlab.vectorguardpdf"

echo [2/3] Installing CEP Extension Panel...

:: Install to User Directory
if not exist "%APPDATA%\Adobe\CEP\extensions" (
    mkdir "%APPDATA%\Adobe\CEP\extensions" >nul 2>&1
)
if exist "%USER_CEP%" (
    rmdir /s /q "%USER_CEP%" >nul 2>&1
)
mkdir "%USER_CEP%" >nul 2>&1

xcopy /E /I /Y /Q "%SRC_DIR%CSXS" "%USER_CEP%\CSXS" >nul 2>&1
xcopy /E /I /Y /Q "%SRC_DIR%css" "%USER_CEP%\css" >nul 2>&1
xcopy /E /I /Y /Q "%SRC_DIR%icons" "%USER_CEP%\icons" >nul 2>&1
xcopy /E /I /Y /Q "%SRC_DIR%js" "%USER_CEP%\js" >nul 2>&1
xcopy /E /I /Y /Q "%SRC_DIR%jsx" "%USER_CEP%\jsx" >nul 2>&1
copy /Y "%SRC_DIR%index.html" "%USER_CEP%\index.html" >nul 2>&1
copy /Y "%SRC_DIR%VectorGuard_PDF_Pro.jsx" "%USER_CEP%\VectorGuard_PDF_Pro.jsx" >nul 2>&1
copy /Y "%SRC_DIR%README.md" "%USER_CEP%\README.md" >nul 2>&1

echo      [OK] Installed to User AppData: "%USER_CEP%"

:: Install to System Directory if writable
if exist "%CommonProgramFiles%\Adobe\CEP\extensions" (
    if exist "%SYSTEM_CEP%" rmdir /s /q "%SYSTEM_CEP%" >nul 2>&1
    mkdir "%SYSTEM_CEP%" >nul 2>&1
    xcopy /E /I /Y /Q "%SRC_DIR%CSXS" "%SYSTEM_CEP%\CSXS" >nul 2>&1
    xcopy /E /I /Y /Q "%SRC_DIR%css" "%SYSTEM_CEP%\css" >nul 2>&1
    xcopy /E /I /Y /Q "%SRC_DIR%icons" "%SYSTEM_CEP%\icons" >nul 2>&1
    xcopy /E /I /Y /Q "%SRC_DIR%js" "%SYSTEM_CEP%\js" >nul 2>&1
    xcopy /E /I /Y /Q "%SRC_DIR%jsx" "%SYSTEM_CEP%\jsx" >nul 2>&1
    copy /Y "%SRC_DIR%index.html" "%SYSTEM_CEP%\index.html" >nul 2>&1
    copy /Y "%SRC_DIR%VectorGuard_PDF_Pro.jsx" "%SYSTEM_CEP%\VectorGuard_PDF_Pro.jsx" >nul 2>&1
    copy /Y "%SRC_DIR%README.md" "%SYSTEM_CEP%\README.md" >nul 2>&1
    echo      [OK] Installed to Common Files: "%SYSTEM_CEP%"
)
echo.

:: 3. Copy Standalone Scripts to Illustrator Presets Scripts directories (64-bit & 32-bit)
echo [3/3] Checking Illustrator Presets Scripts directories...
set "SCRIPT_SRC=%SRC_DIR%VectorGuard_PDF_Pro.jsx"
set "SCRIPT_SRC2=%SRC_DIR%Client_PDF_Creator.jsx"

for /D %%d in ("C:\Program Files\Adobe\Adobe Illustrator *") do (
    if exist "%%d\Presets" (
        for /D %%p in ("%%d\Presets\*") do (
            if exist "%%p\Scripts" (
                copy /Y "%SCRIPT_SRC%" "%%p\Scripts\VectorGuard_PDF_Pro.jsx" >nul 2>&1
                if exist "%SCRIPT_SRC2%" copy /Y "%SCRIPT_SRC2%" "%%p\Scripts\Client_PDF_Creator.jsx" >nul 2>&1
                echo      [OK] Installed script to %%d
            )
        )
    )
)

for /D %%d in ("C:\Program Files (x86)\Adobe\Adobe Illustrator *") do (
    if exist "%%d\Presets" (
        for /D %%p in ("%%d\Presets\*") do (
            if exist "%%p\Scripts" (
                copy /Y "%SCRIPT_SRC%" "%%p\Scripts\VectorGuard_PDF_Pro.jsx" >nul 2>&1
                if exist "%SCRIPT_SRC2%" copy /Y "%SCRIPT_SRC2%" "%%p\Scripts\Client_PDF_Creator.jsx" >nul 2>&1
                echo      [OK] Installed script to %%d
            )
        )
    )
)

echo.
echo ==============================================================================
echo                      Installation Complete!
echo ==============================================================================
echo.
echo  How to open in Adobe Illustrator:
echo    Option 1 (Extension Panel):
echo      - Restart Adobe Illustrator.
echo      - Go to: Window ^> Extensions ^> VectorGuard PDF Pro
echo.
echo    Option 2 (Direct Script - Works on ALL Versions):
echo      - Go to: File ^> Scripts ^> VectorGuard_PDF_Pro
echo.
echo ==============================================================================
pause

