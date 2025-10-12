#!/bin/bash
# Fully Zsh/Bash compatible script to generate macOS AppIcon.xcassets from one 1024x1024 icon.png

SRC="icon.png"  # master PNG (must be >=1024x1024)
DEST="AppIcon.xcassets/AppIcon.appiconset"

if [ ! -f "$SRC" ]; then
  echo "❌ Cannot find $SRC — make sure it exists in this folder."
  exit 1
fi

rm -rf "$DEST"
mkdir -p "$DEST"

# Each entry: width height name
sizes=(
  "16 16 icon_16x16.png"
  "32 32 icon_16x16@2x.png"
  "32 32 icon_32x32.png"
  "64 64 icon_32x32@2x.png"
  "128 128 icon_128x128.png"
  "256 256 icon_128x128@2x.png"
  "256 256 icon_256x256.png"
  "512 512 icon_256x256@2x.png"
  "512 512 icon_512x512.png"
  "1024 1024 icon_512x512@2x.png"
)

for entry in "${sizes[@]}"; do
  set -- $entry
  sips -z $1 $2 "$SRC" --out "$DEST/$3" >/dev/null
done

# Build Contents.json
cat > "$DEST/Contents.json" <<EOF
{
  "images": [
    { "idiom": "mac", "size": "16x16", "scale": "1x", "filename": "icon_16x16.png" },
    { "idiom": "mac", "size": "16x16", "scale": "2x", "filename": "icon_16x16@2x.png" },
    { "idiom": "mac", "size": "32x32", "scale": "1x", "filename": "icon_32x32.png" },
    { "idiom": "mac", "size": "32x32", "scale": "2x", "filename": "icon_32x32@2x.png" },
    { "idiom": "mac", "size": "128x128", "scale": "1x", "filename": "icon_128x128.png" },
    { "idiom": "mac", "size": "128x128", "scale": "2x", "filename": "icon_128x128@2x.png" },
    { "idiom": "mac", "size": "256x256", "scale": "1x", "filename": "icon_256x256.png" },
    { "idiom": "mac", "size": "256x256", "scale": "2x", "filename": "icon_256x256@2x.png" },
    { "idiom": "mac", "size": "512x512", "scale": "1x", "filename": "icon_512x512.png" },
    { "idiom": "mac", "size": "512x512", "scale": "2x", "filename": "icon_512x512@2x.png" }
  ],
  "info": { "version": 1, "author": "xcode" }
}
EOF

echo "✅ All PNGs generated successfully at $DEST"
echo "👉 Drag 'AppIcon.xcassets' into Xcode → General → App Icons → select 'AppIcon'"
