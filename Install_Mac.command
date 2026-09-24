#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TARGET_DIR="$HOME/Library/Application Support/Adobe/CEP/extensions/VectorGuard-PDF-Pro"

echo "=============================================================================="
echo "                 VectorGuard PDF Pro - macOS Installer"
echo "=============================================================================="
echo ""

# 1. Enable PlayerDebugMode for all CSXS versions
echo "[1/3] Enabling Adobe CEP Debug Mode (CSXS 7 - 18)..."
for v in {7..18}; do
    defaults write com.adobe.CSXS.$v PlayerDebugMode 1 2>/dev/null
done
echo "      [OK] Debug mode enabled."
echo ""

# 2. Install CEP Extension Panel
echo "[2/3] Installing CEP Extension Panel to:"
echo "      $TARGET_DIR"
mkdir -p "$HOME/Library/Application Support/Adobe/CEP/extensions"
rm -rf "$TARGET_DIR" 2>/dev/null
cp -R "$DIR" "$TARGET_DIR" 2>/dev/null
echo "      [OK] Extension panel installed successfully."
echo ""

# 3. Optional: Standalone script copy
echo "[3/3] Checking Illustrator Presets Scripts directories..."
for app_dir in /Applications/Adobe\ Illustrator\ *; do
    if [ -d "$app_dir/Presets.localized/en_US/Scripts" ]; then
        sudo cp "$DIR/VectorGuard_PDF_Pro.jsx" "$app_dir/Presets.localized/en_US/Scripts/VectorGuard_PDF_Pro.jsx" 2>/dev/null
        echo "      [OK] Installed script to $app_dir"
    fi
done

echo ""
echo "=============================================================================="
echo "                      Installation Complete!"
echo "=============================================================================="
echo ""
echo " How to open in Adobe Illustrator:"
echo "   1. Restart Adobe Illustrator."
echo "   2. Go to: Window > Extensions > VectorGuard PDF Pro"
echo ""
echo "=============================================================================="
read -p "Press Enter to exit..."
