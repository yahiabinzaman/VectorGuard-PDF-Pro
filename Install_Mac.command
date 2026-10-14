#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TARGET_DIR="$HOME/Library/Application Support/Adobe/CEP/extensions/VectorGuard-PDF-Pro"

echo "=============================================================================="
echo "                 VectorGuard PDF Pro - macOS Installer"
echo "=============================================================================="
echo ""

# 1. Enable PlayerDebugMode for all CSXS versions
echo "[1/3] Enabling Adobe CEP Debug Mode (CSXS 4 - 24)..."
for v in {4..24}; do
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
if [ -f "$DIR/.debug" ]; then
    cp "$DIR/.debug" "$TARGET_DIR/.debug" 2>/dev/null
fi
# Also create ID-based folder
ALT_TARGET="$HOME/Library/Application Support/Adobe/CEP/extensions/com.colorlab.vectorguardpdf"
rm -rf "$ALT_TARGET" 2>/dev/null
cp -R "$DIR" "$ALT_TARGET" 2>/dev/null

echo "      [OK] Extension panel installed successfully."
echo ""

# 3. Standalone script copy to all Illustrator Presets directories
echo "[3/3] Checking Illustrator Presets Scripts directories..."
for app_dir in /Applications/Adobe\ Illustrator\ *; do
    if [ -d "$app_dir" ]; then
        for scripts_dir in "$app_dir"/Presets.localized/*/Scripts "$app_dir"/Presets/*/Scripts; do
            if [ -d "$scripts_dir" ]; then
                sudo cp "$DIR/VectorGuard_PDF_Pro.jsx" "$scripts_dir/VectorGuard_PDF_Pro.jsx" 2>/dev/null
                echo "      [OK] Installed script to $scripts_dir"
            fi
        done
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
echo "   3. (Or Script): File > Scripts > VectorGuard_PDF_Pro"
echo ""
echo "=============================================================================="
read -p "Press Enter to exit..."
