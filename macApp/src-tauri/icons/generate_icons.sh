#!/bin/bash

# Source image
SOURCE="museai.png"

# Create different sizes
sips -z 16 16     "$SOURCE" --out "museai.iconset/icon_16x16.png"
sips -z 32 32     "$SOURCE" --out "museai.iconset/icon_16x16@2x.png"
sips -z 32 32     "$SOURCE" --out "museai.iconset/icon_32x32.png"
sips -z 64 64     "$SOURCE" --out "museai.iconset/icon_32x32@2x.png"
sips -z 128 128   "$SOURCE" --out "museai.iconset/icon_128x128.png"
sips -z 256 256   "$SOURCE" --out "museai.iconset/icon_128x128@2x.png"
sips -z 256 256   "$SOURCE" --out "museai.iconset/icon_256x256.png"
sips -z 512 512   "$SOURCE" --out "museai.iconset/icon_256x256@2x.png"
sips -z 512 512   "$SOURCE" --out "museai.iconset/icon_512x512.png"
sips -z 1024 1024 "$SOURCE" --out "museai.iconset/icon_512x512@2x.png"

# Convert to icns
iconutil -c icns museai.iconset

# Move the generated icns file
mv museai.icns museai.icns

# Clean up
rm -rf museai.iconset 