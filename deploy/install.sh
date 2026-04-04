#!/bin/bash
# ============================================
# Angple Wiki Plugin Installer
# ============================================
# Usage:
#   ./install.sh /path/to/angple
#   ./install.sh              # defaults to ../angple
# ============================================

set -euo pipefail

ANGPLE_DIR="${1:-../angple}"

if [ ! -f "$ANGPLE_DIR/package.json" ]; then
    echo "Error: $ANGPLE_DIR does not appear to be an Angple installation."
    echo "Usage: $0 /path/to/angple"
    exit 1
fi

echo "Installing Wiki Plugin to: $ANGPLE_DIR"
echo ""

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Plugins -> plugins/
if [ -d "$SCRIPT_DIR/plugins" ] && [ "$(ls -A "$SCRIPT_DIR/plugins")" ]; then
    mkdir -p "$ANGPLE_DIR/plugins"
    cp -r "$SCRIPT_DIR/plugins/"* "$ANGPLE_DIR/plugins/"
    echo "[OK] Wiki plugin installed to plugins/"
fi

echo ""
echo "Wiki plugin installation complete!"
echo "Restart your dev server and create a board with type 'wiki' in Admin."
