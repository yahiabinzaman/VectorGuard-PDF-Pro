# VectorGuard PDF Pro — Adobe Illustrator Extension & Automation

<p align="center">
  <img src="icons/logo.png" width="120" height="120" alt="VectorGuard PDF Pro Logo" />
</p>

<h3 align="center">⚡ 1-Click Client-Safe Flattened Multi-Page PDF Generator for Adobe Illustrator</h3>

<p align="center">
  <strong>Protect your original vector artwork and source assets while delivering ultra-crisp, high-resolution multi-page preview PDFs to clients with a single click.</strong>
</p>

---

## 🛡️ Why VectorGuard PDF Pro?

When working on large multi-artboard projects (50–60+ pages, brand guides, UI screens, merchandise, or print templates), clients often require a multi-page PDF preview for feedback. 

Sharing a standard vector PDF or AI file exposes your proprietary design assets, editable typography, and vector layers to unauthorized copying. Manually exporting artboards as raster images and placing them page-by-page takes hours.

**VectorGuard PDF Pro automates the entire process in seconds:**
1. Exports all/selected artboards to crystal-clear raster images (PNG 24-bit or JPG at 1x, 2x, 3x, or custom resolution).
2. Generates a new multi-page document with identical artboard dimensions & positions.
3. Places and embeds each rendered page with exact 1:1 alignment.
4. Compiles and saves a flattened, un-editable Client PDF (`preserveEditability = false`).
5. Automatically cleans up temporary files and opens the finished PDF.

---

## ✨ Features

- **🚀 1-Click Complete Pipeline**: From vector artboards to multi-page client preview PDF in seconds.
- **🔒 Asset Protection**: Disables Illustrator private data to prevent extraction of vectors, paths, fonts, or layer hierarchies.
- **🎛️ Resolution Controls**: Preset chips for `1x (100%)`, `2x (200% - Recommended)`, `3x (300% - Ultra Sharp)`, or `Custom %`.
- **🖼️ Raster Format Options**: `PNG (24-bit Crisp)` or `JPG (Maximum Quality 100%)` with white or transparent background.
- **📄 Artboard Filtering**: Process all artboards or custom page ranges (e.g. `1-10, 15, 20-35`).
- **🎨 Native Adobe Panel Theme**: Seamlessly blends into Adobe Illustrator's dark workspace with dockable panel support.
- **📊 Real-time Progress Bar**: Visual feedback during large multi-page exports.
- **🧹 Auto-Cleanup**: Automatically purges temporary raster caches after PDF generation.

---

## 📦 Installation & Setup

### Method 1: Illustrator Panel Extension (Recommended)
1. Clone or download this repository:
   ```bash
   git clone https://github.com/yahiabinzaman/VectorGuard-PDF-Pro.git
   ```
2. Copy the folder to your Adobe CEP extensions directory:
   - **macOS**: `~/Library/Application Support/Adobe/CEP/extensions/VectorGuard-PDF-Pro`
   - **Windows**: `C:\Users\<Username>\AppData\Roaming\Adobe\CEP\extensions\VectorGuard-PDF-Pro`
3. Restart **Adobe Illustrator**.
4. Open the panel via: **`Window` > `Extensions` > `VectorGuard PDF Pro`**.

---

### Method 2: Standalone ExtendScript (`.jsx`)
If you prefer running it as a script without the extension panel:
1. In Adobe Illustrator, open your document.
2. Go to: **`File` > `Scripts` > `Other Script...`** (`Cmd + F12` on Mac / `Ctrl + F12` on Windows).
3. Select `VectorGuard_PDF_Pro.jsx`.

---

## 👨‍💻 Developer
Developed with ❤️ by **[Yahia Bin Zaman](https://github.com/yahiabinzaman)**

---

## 📄 License
MIT License. Free to use for personal and commercial Illustrator automation workflows.
