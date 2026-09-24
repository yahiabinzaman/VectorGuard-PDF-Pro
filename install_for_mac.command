#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SCRIPT_SRC="$DIR/Client_PDF_Creator.jsx"

echo "============================================================"
echo "Installing Client PDF Creator for Adobe Illustrator..."
echo "============================================================"

FOUND=0

# Illustrator 2024
if [ -d "/Applications/Adobe Illustrator 2024/Presets.localized/en_US/Scripts" ]; then
    echo "Found Adobe Illustrator 2024..."
    sudo cp "$SCRIPT_SRC" "/Applications/Adobe Illustrator 2024/Presets.localized/en_US/Scripts/Client_PDF_Creator.jsx"
    FOUND=1
fi

# Illustrator 2023
if [ -d "/Applications/Adobe Illustrator 2023/Presets.localized/en_US/Scripts" ]; then
    echo "Found Adobe Illustrator 2023..."
    sudo cp "$SCRIPT_SRC" "/Applications/Adobe Illustrator 2023/Presets.localized/en_US/Scripts/Client_PDF_Creator.jsx"
    FOUND=1
fi

# Illustrator 2022
if [ -d "/Applications/Adobe Illustrator 2022/Presets.localized/en_US/Scripts" ]; then
    echo "Found Adobe Illustrator 2022..."
    sudo cp "$SCRIPT_SRC" "/Applications/Adobe Illustrator 2022/Presets.localized/en_US/Scripts/Client_PDF_Creator.jsx"
    FOUND=1
fi

if [ $FOUND -eq 1 ]; then
    echo "------------------------------------------------------------"
    echo "✅ Installation Complete!"
    echo "Restart Adobe Illustrator. You can now access it from:"
    echo "File > Scripts > Client_PDF_Creator"
    echo "------------------------------------------------------------"
else
    echo "⚠️ Could not auto-detect standard Scripts directory."
    echo "You can still run it anytime inside Illustrator via:"
    echo "File > Scripts > Other Script... (Cmd + F12)"
fi

read -p "Press Enter to exit..."
