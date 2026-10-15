<div align="center">

  <img src="icons/logo.png" width="128" height="128" alt="VectorGuard PDF Pro Logo" style="border-radius: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.25);" />

  # VectorGuard PDF Pro
  ### 1-Click Client-Safe Flattened Multi-Page PDF Generator for Adobe Illustrator

  <p align="center">
    <a href="https://github.com/yahiabinzaman/VectorGuard-PDF-Pro/releases"><img src="https://img.shields.io/badge/version-1.0.0-red.svg?style=for-the-badge&logo=adobe" alt="Version 1.0.0" /></a>
    <a href="https://www.adobe.com/products/illustrator.html"><img src="https://img.shields.io/badge/Adobe%20Illustrator-CC%202019%20--%202026+-FF9A00.svg?style=for-the-badge&logo=adobeillustrator" alt="Illustrator Compatibility" /></a>
    <a href="https://github.com/yahiabinzaman/VectorGuard-PDF-Pro/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="MIT License" /></a>
    <a href="https://github.com/yahiabinzaman"><img src="https://img.shields.io/badge/Developer-Yahia%20Bin%20Zaman-0A84FF.svg?style=for-the-badge&logo=github" alt="Developer" /></a>
  </p>

  <p align="center">
    <strong>Never send editable vector files to clients again. Automatically export 50–60+ artboards into crystal-clear raster images, perfectly align them onto matching pages, and compile an un-editable multi-page Client PDF in seconds.</strong>
  </p>

</div>

---

## Table of Contents
- [The Problem vs The Solution](#the-problem-vs-the-solution)
- [Key Features](#key-features)
- [How It Works (Pipeline Architecture)](#how-it-works-pipeline-architecture)
- [UI & Controls Guide](#ui--controls-guide)
- [Installation Guide (Windows & Mac)](#installation-guide-windows--mac)
  - [Windows (1-Click Automated Batch Setup)](#windows-1-click-automated-batch-setup)
  - [macOS (1-Click Automated Command Setup)](#macos-1-click-automated-command-setup)
  - [Standalone Script (.jsx)](#standalone-script-jsx)
- [Best Practices & Pro Tips](#best-practices--pro-tips)
- [System & Version Compatibility](#system--version-compatibility)
- [Author & Credits](#author--credits)
- [License](#license)

---

## The Problem vs The Solution

When delivering multi-page design mockups (brochures, presentations, social media sets, packaging, UI/UX flows, or merchandise templates with 50–60 artboards), clients frequently request a multi-page PDF for review.

| The Old Painful Manual Way (15–30 Mins) | The VectorGuard PDF Pro Way (5 Seconds) |
| :--- | :--- |
| 1. Press `Ctrl + Alt + E` to export all artboards as PNG/JPG. | 1. Click **`Create Client PDF`**. |
| 2. Locate the exported images inside file explorer. | 2. **Done!** The multi-page flattened PDF is generated, opened, and temporary image caches are auto-deleted. |
| 3. Create a new document in Illustrator with matching artboards. | |
| 4. Drag & drop each image onto its respective artboard manually. | |
| 5. Save as PDF and manually delete the leftover image folders. | |
| **High Risk**: Forgetting to flatten leaves your original vector artwork and source fonts vulnerable to client theft. | **100% Secure**: All vector paths, typography, and layers are completely stripped (`preserveEditability = false`). |

---

## Key Features

### Complete Vector Asset & Layer Protection
- Embedded rasterization prevents clients or competitors from opening the PDF in Illustrator or Acrobat to extract paths, logos, icons, brand assets, or custom typography.
- Built-in `preserveEditability = false` flag guarantees zero Illustrator Private Data is written into the PDF.

### 🛡️ Security & Anti-Theft Protection Suite (New)
- **Tiled Repeating Grid Watermark**: Generates an angled matrix of text (e.g. `PREVIEW ONLY • DO NOT COPY`) across each artboard with configurable opacity (12%, 20%, 32%). Impossible to crop or screenshot clean assets.
- **Center Prominent Watermark**: Alternative center-stamped watermark for bold presentation.
- **Anti-Vector Trace Guard (AI & Bot Poisoning)**: Injects subtle micro-mesh lines that break the edge-detection algorithms of Illustrator's **Image Trace** and AI vectorizers, preventing automatic vector reconstruction while remaining crystal clear for client viewing.
- **Proof & Disclaimer Footer Strip**: Professional bottom security banner stamping `CONFIDENTIAL CLIENT PROOF • NOT FOR PRODUCTION • [DATE]` on each page.
- **PDF Permissions & Content Lock (Print-Safe)**: Natively locks Acrobat PDF permissions against text/image extraction (`enableCopying = false`) and unauthorized page editing (`enableChanges = false`), while **explicitly preserving high-quality client printing** (`enablePrinting = PRINT128HIGHRES`) so clients can review physical hard copies!

### High-Speed Turbo Engine (5x–10x Faster)
- Direct linked stream baking eliminates redundant DOM embedding overhead.
- Generates 50–60 page PDFs in seconds.

### Granular Resolution Controls
- **`1x (100%)`**: Standard preview resolution (~72–150 DPI) for compact file sizes.
- **`2x (200%)`**: **Recommended** — High-definition clarity (~300 DPI) for razor-sharp client presentation on Retina & 4K displays.
- **`3x (300%)`**: Ultra high-definition (~450 DPI) for fine detail inspection and print-proof simulation.
- **`Custom Scale`**: Enter any custom percentage (e.g. `150%`, `400%`).

### Raster Format & Transparency Support
- **PNG (24-bit Crisp)**: Lossless rasterization with your choice of **White Background** (standard for multi-page documents) or **Transparent Background**.
- **JPEG (High Quality)**: Optimized compression with 92%–100% quality index for fast email / WhatsApp dispatch.

### Smart Artboard Targeting
- **All Artboards**: Seamlessly batches all pages (1 to 60+).
- **Custom Page Range**: Enter selective ranges like `1-10, 15, 20-35`.

### Native Adobe Workspace UI
- Pure native Adobe CC dark palette (`#323232`, `#232323`, `#1473e6`).
- Dockable sidebar panel with live document state detection and progress bar.

---

## How It Works (Pipeline Architecture)

```mermaid
graph TD
    A[Active Illustrator Document] -->|Read Artboards & Dimensions| B(VectorGuard Turbo Engine)
    B -->|Export 1x/2x/3x High-Speed Raster Cache| C[Temporary Image Cache]
    C -->|Build Matching Canvas & Link 1:1| D[Flattened Multi-Page Canvas]
    D -->|Compile with preserveEditability=false| E[Client-Safe Multi-Page PDF]
    E -->|Purge Temporary Cache| F[Auto-Clean & Launch PDF]
```

---

## UI & Controls Guide

| Control | Description |
| :--- | :--- |
| **Document Status Card** | Displays the active document name, color space (RGB/CMYK), and total artboards. Includes a live status indicator dot and **`Refresh`** button. |
| **Resolution / Scale Chips** | Quick selector for `1x`, `2x`, `3x`, or custom scale percentage. |
| **Raster Format Toggle** | Choose between `PNG (24-bit)` and `JPEG (High Quality)`. When PNG is active, background color options (White / Transparent) become selectable. |
| **Artboards To Include** | Switch between `All Artboards` and `Range` (supports comma & hyphen syntax: `1-5, 8, 12`). |
| **Output Destination** | Select destination folder (defaults to current project folder) and set custom PDF file name. |
| **Turbo Mode** | High-speed direct stream compilation (5x–10x faster). |
| **Post-Processing Checkboxes** | Toggle automatic PDF launch upon completion and auto-deletion of temporary image cache. |
| **Developer Footer** | Quick link to developer GitHub profile (**[Yahia Bin Zaman](https://github.com/yahiabinzaman)**). |

---

## Installation Guide (Windows & Mac)

### 🪟 Windows Setup Guide

You can install VectorGuard PDF Pro on Windows using either the **1-Click ZIP Download** (Easiest) or via **Git / PowerShell**.

#### Option A: Direct ZIP Download (Easiest — Recommended)
1. At the top of this GitHub repository, click the green **`<> Code`** button and select **`Download ZIP`** (or [Click Here to Download](https://github.com/yahiabinzaman/VectorGuard-PDF-Pro/archive/refs/heads/main.zip)).
2. Locate the downloaded `VectorGuard-PDF-Pro-main.zip` in your **Downloads** folder, right-click it, and select **Extract All...**.
3. Open the extracted folder and double-click **`Install_Windows.bat`** (or right-click and choose **`Run as administrator`**).
   > **Note**: If Windows SmartScreen displays *"Windows protected your PC"*, simply click **More info** ➔ **Run anyway**.
4. The installer will automatically:
   - Configure the required Adobe CEP Debug Mode keys in the Windows Registry (`CSXS.4` through `CSXS.24`).
   - Install the extension panel to `%APPDATA%\Adobe\CEP\extensions\com.colorlab.vectorguardpdf`.
   - Install to system-wide 32/64-bit Common Files CEP directories.
   - Detect and copy the standalone script into all installed versions of Adobe Illustrator's `Presets\Scripts` folders.
5. **Restart Adobe Illustrator**.
6. Open VectorGuard via:
   - **Panel**: **`Window` > `Extensions` > `VectorGuard PDF Pro`**
   - **Script**: **`File` > `Scripts` > `VectorGuard_PDF_Pro`**

---

#### Option B: PowerShell / Git Clone
> ⚠️ **Common Issue**: If you open PowerShell and immediately paste the link or run `git clone`, Windows may show **`Access is denied`** because PowerShell by default opens in the protected `C:\Windows\System32` directory.

**Correct PowerShell Steps:**
1. Open PowerShell or Command Prompt.
2. First, switch to your **Downloads** or **Desktop** folder:
   ```powershell
   cd $HOME\Downloads
   ```
3. Clone the repository:
   ```powershell
   git clone https://github.com/yahiabinzaman/VectorGuard-PDF-Pro.git
   ```
4. Navigate into the folder and run the installer:
   ```powershell
   cd VectorGuard-PDF-Pro
   .\Install_Windows.bat
   ```
5. Restart Adobe Illustrator and navigate to **`Window` > `Extensions` > `VectorGuard PDF Pro`**.

---

### 🍎 macOS Setup Guide

1. Download or clone this repository:
   ```bash
   cd ~/Downloads
   git clone https://github.com/yahiabinzaman/VectorGuard-PDF-Pro.git
   ```
   *(Or download the ZIP file from GitHub and extract it).*
2. Open the project folder and double-click **`Install_Mac.command`** (or run `bash Install_Mac.command` in Terminal).
3. Restart **Adobe Illustrator**.
4. Open the panel via: **`Window` > `Extensions` > `VectorGuard PDF Pro`** (or **`File` > `Scripts` > `VectorGuard_PDF_Pro`**).

---

### 📂 Manual Installation (File Locations Reference)

If you prefer to manually place files without running the automatic batch script:

| Platform | Component | Target Installation Directory |
| :--- | :--- | :--- |
| **Windows** | **CEP Extension Panel** | `%APPDATA%\Adobe\CEP\extensions\com.colorlab.vectorguardpdf\`<br>*(e.g. `C:\Users\<Username>\AppData\Roaming\Adobe\CEP\extensions\`)* |
| **Windows** | **System Common CEP** | `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\` |
| **Windows** | **Standalone Script** | `C:\Program Files\Adobe\Adobe Illustrator <Year>\Presets\<Locale>\Scripts\VectorGuard_PDF_Pro.jsx` |
| **macOS** | **CEP Extension Panel** | `~/Library/Application Support/Adobe/CEP/extensions/com.colorlab.vectorguardpdf/` |
| **macOS** | **Standalone Script** | `/Applications/Adobe Illustrator <Year>/Presets.localized/<Locale>/Scripts/VectorGuard_PDF_Pro.jsx` |

#### Manual Registry Activation (Windows Only):
If installing manually on Windows, you must enable `PlayerDebugMode` in the Registry so Illustrator loads unsigned extensions:
Open PowerShell as Administrator and run:
```powershell
for ($i=4; $i -le 24; $i++) {
    reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.$i" /v PlayerDebugMode /t REG_SZ /d 1 /f
    reg add "HKEY_LOCAL_MACHINE\Software\Adobe\CSXS.$i" /v PlayerDebugMode /t REG_SZ /d 1 /f
}
```

---

### ❓ Troubleshooting & FAQs

- **Q: Why does PowerShell say "Access is denied" when I paste the link on Windows?**
  - **A**: This happens if PowerShell is running inside `C:\Windows\System32` (which is write-protected) or if you paste a raw URL without typing `git clone` first. Always run `cd $HOME\Downloads` before cloning, or simply download the ZIP file directly from the GitHub page.
- **Q: VectorGuard PDF Pro does not appear under Window > Extensions?**
  - **A**: 
    1. Make sure Illustrator was completely closed and restarted after installation.
    2. Run `Install_Windows.bat` (or `Install_Mac.command`) again as Administrator to ensure debug mode registry keys are applied.
    3. You can always use the direct script version anytime via **`File` > `Scripts` > `VectorGuard_PDF_Pro`** without needing the extensions menu.
- **Q: Will clients still be able to print the proof?**
  - **A**: **Yes!** Unlike other PDF protectors that disable printing, VectorGuard explicitly preserves high-resolution printing (`enablePrinting = PRINT128HIGHRES`) so clients can print physical test copies for review. Content copying and vector file extraction remain 100% blocked.

---

## Best Practices & Pro Tips

- **Client Presentations**: Use **`2x PNG`** with **White Background** for the optimal balance between razor-sharp text clarity and manageable PDF file size.
- **Mobile / Messaging Dispatch**: Use **`1x JPEG`** if you need a lightweight PDF under 5 MB for WhatsApp or email attachments.
- **Spot Color / CMYK Artwork**: The script automatically detects your active document's color space (`RGB` or `CMYK`) to maintain color fidelity during compilation.

---

## System & Version Compatibility

| Requirement | Supported Specifications |
| :--- | :--- |
| **Operating System** | Windows 10 & 11 (64-bit) / macOS 10.15+ (Intel & Apple Silicon M1/M2/M3/M4) |
| **Host Application** | Adobe Illustrator CS6, CC 2018, CC 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026+ |
| **Runtime Engine** | Adobe CEP 7.0 – 18.0+ |

---

## Author & Credits

Crafted with care by **[Yahia Bin Zaman](https://github.com/yahiabinzaman)**

If this tool saves you time and protects your design assets, please consider giving this repository a ⭐ **Star**!

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
