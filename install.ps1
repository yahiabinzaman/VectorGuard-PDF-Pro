# ==============================================================================
# VectorGuard PDF Pro - 1-Line Universal Windows Installer
# Run in PowerShell:
# irm https://raw.githubusercontent.com/yahiabinzaman/VectorGuard-PDF-Pro/main/install.ps1 | iex
# ==============================================================================

$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "            ⚡ VectorGuard PDF Pro v2.0 - Automated Installer ⚡" -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Enable Adobe CEP PlayerDebugMode in Registry (CSXS 4 - 24)
Write-Host "[1/4] Enabling Adobe CEP Debug Mode (CSXS 4 - 24)..." -ForegroundColor Yellow
for ($v = 4; $v -le 24; $v++) {
    New-Item -Path "HKCU:\Software\Adobe\CSXS.$v" -Force | Out-Null
    Set-ItemProperty -Path "HKCU:\Software\Adobe\CSXS.$v" -Name "PlayerDebugMode" -Value "1" -Force | Out-Null
    
    New-Item -Path "HKCU:\Software\Wow6432Node\Adobe\CSXS.$v" -Force | Out-Null
    Set-ItemProperty -Path "HKCU:\Software\Wow6432Node\Adobe\CSXS.$v" -Name "PlayerDebugMode" -Value "1" -Force | Out-Null

    New-Item -Path "HKLM:\Software\Adobe\CSXS.$v" -Force | Out-Null
    Set-ItemProperty -Path "HKLM:\Software\Adobe\CSXS.$v" -Name "PlayerDebugMode" -Value "1" -Force | Out-Null

    New-Item -Path "HKLM:\Software\Wow6432Node\Adobe\CSXS.$v" -Force | Out-Null
    Set-ItemProperty -Path "HKLM:\Software\Wow6432Node\Adobe\CSXS.$v" -Name "PlayerDebugMode" -Value "1" -Force | Out-Null
}
Write-Host "      [OK] Adobe CEP Debug Mode active." -ForegroundColor Green
Write-Host ""

# 2. Download and Extract Latest Package
Write-Host "[2/4] Downloading latest VectorGuard package from GitHub..." -ForegroundColor Yellow
$tempZip = Join-Path $env:TEMP "VectorGuard-PDF-Pro-main.zip"
$tempExtract = Join-Path $env:TEMP "VectorGuard-Extract"
$downloadUrl = "https://github.com/yahiabinzaman/VectorGuard-PDF-Pro/archive/refs/heads/main.zip"

if (Test-Path $tempExtract) {
    Remove-Item -Path $tempExtract -Recurse -Force | Out-Null
}
if (Test-Path $tempZip) {
    Remove-Item -Path $tempZip -Force | Out-Null
}

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri $downloadUrl -OutFile $tempZip -UseBasicParsing
Expand-Archive -Path $tempZip -DestinationPath $tempExtract -Force

$srcFolder = Join-Path $tempExtract "VectorGuard-PDF-Pro-main"
if (-not (Test-Path $srcFolder)) {
    $srcFolder = (Get-ChildItem -Path $tempExtract -Directory | Select-Object -First 1).FullName
}
Write-Host "      [OK] Package downloaded and extracted." -ForegroundColor Green
Write-Host ""

# 3. Deploy to CEP Extension Directories
Write-Host "[3/4] Installing Extension Panel to Adobe CEP directories..." -ForegroundColor Yellow
$userCepID = Join-Path $env:APPDATA "Adobe\CEP\extensions\com.colorlab.vectorguardpdf"
$userCepName = Join-Path $env:APPDATA "Adobe\CEP\extensions\VectorGuard-PDF-Pro"
$commonCep = "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.colorlab.vectorguardpdf"

$targetPaths = @($userCepID, $userCepName)
if (Test-Path "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions") {
    $targetPaths += $commonCep
}

foreach ($target in $targetPaths) {
    if (Test-Path $target) {
        Remove-Item -Path $target -Recurse -Force | Out-Null
    }
    New-Item -ItemType Directory -Path $target -Force | Out-Null

    Copy-Item -Path (Join-Path $srcFolder "CSXS") -Destination $target -Recurse -Force
    Copy-Item -Path (Join-Path $srcFolder "css") -Destination $target -Recurse -Force
    Copy-Item -Path (Join-Path $srcFolder "icons") -Destination $target -Recurse -Force
    Copy-Item -Path (Join-Path $srcFolder "js") -Destination $target -Recurse -Force
    Copy-Item -Path (Join-Path $srcFolder "jsx") -Destination $target -Recurse -Force
    Copy-Item -Path (Join-Path $srcFolder "index.html") -Destination $target -Force
    Copy-Item -Path (Join-Path $srcFolder "VectorGuard_PDF_Pro.jsx") -Destination $target -Force
    Copy-Item -Path (Join-Path $srcFolder "README.md") -Destination $target -Force
    if (Test-Path (Join-Path $srcFolder ".debug")) {
        Copy-Item -Path (Join-Path $srcFolder ".debug") -Destination $target -Force
    }
}
Write-Host "      [OK] Panel installed to User & System CEP extensions." -ForegroundColor Green
Write-Host ""

# 4. Deploy Standalone Script to Illustrator Presets
Write-Host "[4/4] Installing Standalone Script to Illustrator Presets..." -ForegroundColor Yellow
$scriptFile = Join-Path $srcFolder "VectorGuard_PDF_Pro.jsx"
$aiSearchPaths = @(
    "C:\Program Files\Adobe\Adobe Illustrator *",
    "C:\Program Files (x86)\Adobe\Adobe Illustrator *"
)

foreach ($pattern in $aiSearchPaths) {
    Get-Item -Path $pattern | ForEach-Object {
        $aiDir = $_.FullName
        $presetsDirs = @(
            (Join-Path $aiDir "Presets\*\Scripts"),
            (Join-Path $aiDir "Presets.localized\*\Scripts")
        )
        foreach ($pDir in $presetsDirs) {
            Get-Item -Path $pDir | ForEach-Object {
                Copy-Item -Path $scriptFile -Destination $_.FullName -Force
                Write-Host "      [OK] Script installed to $($_.FullName)" -ForegroundColor Green
            }
        }
    }
}
Write-Host ""

# Cleanup
Remove-Item -Path $tempZip -Force | Out-Null
Remove-Item -Path $tempExtract -Recurse -Force | Out-Null

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "                 🎉 INSTALLATION COMPLETED SUCCESSFULLY! 🎉" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " How to open in Adobe Illustrator:" -ForegroundColor White
Write-Host "   1. Restart Adobe Illustrator." -ForegroundColor Gray
Write-Host "   2. Go to: Window > Extensions > VectorGuard PDF Pro" -ForegroundColor Cyan
Write-Host "      (Or Script: File > Scripts > VectorGuard_PDF_Pro)" -ForegroundColor Yellow
Write-Host ""
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ""
