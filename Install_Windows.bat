@echo off
setlocal enabledelayedexpansion
title VectorGuard PDF Pro - Windows Installer

echo ==============================================================================
echo                 VectorGuard PDF Pro - Windows Installer
echo ==============================================================================
echo.

:: 1. Enable PlayerDebugMode for all CSXS versions in Registry
echo [1/3] Enabling Adobe CEP Debug Mode (CSXS 7 - 18)...
for /L %%i in (7,1,18) do (
    reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.%%i" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
)
echo      [OK] Debug mode enabled.
echo.

:: 2. Create Target Directory in %APPDATA%\Adobe\CEP\extensions
set "TARGET_DIR=%APPDATA%\Adobe\CEP\extensions\VectorGuard-PDF-Pro"
set "SRC_DIR=%~dp0"

echo [2/3] Installing CEP Extension Panel to:
echo      "%TARGET_DIR%"
echo.

if not exist "%APPDATA%\Adobe\CEP\extensions" (
    mkdir "%APPDATA%\Adobe\CEP\extensions" >nul 2>&1
)

if exist "%TARGET_DIR%" (
    echo      Removing older installation...
    rmdir /s /q "%TARGET_DIR%" >nul 2>&1
)

mkdir "%TARGET_DIR%" >nul 2>&1

:: Copy Extension Files (Excluding .git and temporary files)
xcopy /E /I /Y /Q "%SRC_DIR%CSXS" "%TARGET_DIR%\CSXS" >nul 2>&1
xcopy /E /I /Y /Q "%SRC_DIR%css" "%TARGET_DIR%\css" >nul 2>&1
xcopy /E /I /Y /Q "%SRC_DIR%icons" "%TARGET_DIR%\icons" >nul 2>&1
xcopy /E /I /Y /Q "%SRC_DIR%js" "%TARGET_DIR%\js" >nul 2>&1
xcopy /E /I /Y /Q "%SRC_DIR%jsx" "%TARGET_DIR%\jsx" >nul 2>&1
copy /Y "%SRC_DIR%index.html" "%TARGET_DIR%\index.html" >nul 2>&1
copy /Y "%SRC_DIR%VectorGuard_PDF_Pro.jsx" "%TARGET_DIR%\VectorGuard_PDF_Pro.jsx" >nul 2>&1
copy /Y "%SRC_DIR%README.md" "%TARGET_DIR%\README.md" >nul 2>&1

echo      [OK] Extension panel installed successfully.
echo.

:: 3. Optional: Copy Standalone Script to Illustrator Scripts directory if present
echo [3/3] Checking Illustrator Presets Scripts directories...
set "SCRIPT_SRC=%SRC_DIR%VectorGuard_PDF_Pro.jsx"

for /D %%d in ("C:\Program Files\Adobe\Adobe Illustrator *") do (
    if exist "%%d\Presets" (
        for /D %%p in ("%%d\Presets\*") do (
            if exist "%%p\Scripts" (
                copy /Y "%SCRIPT_SRC%" "%%p\Scripts\VectorGuard_PDF_Pro.jsx" >nul 2>&1
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
echo    1. Restart Adobe Illustrator.
echo    2. Go to: Window > Extensions > VectorGuard PDF Pro
echo.
echo ==============================================================================
pause
