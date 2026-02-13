#!/usr/bin/env bash
set -euo pipefail

if [ $# -eq 0 ]; then
  echo "Usage: ./scripts/new.sh \"experiment name\""
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
EXPERIMENTS_DIR="$ROOT/experiments"
TEMPLATE_DIR="$ROOT/template"
INDEX_JSON="$EXPERIMENTS_DIR/index.json"

NAME="$1"

# find next number
LAST=$(ls -1d "$EXPERIMENTS_DIR"/[0-9][0-9][0-9]-* 2>/dev/null | sort | tail -1 | grep -oE '[0-9]{3}' | head -1 || echo "000")
NEXT=$(printf "%03d" $((10#$LAST + 1)))

# slugify: lowercase, spaces to hyphens, strip non-alphanumeric except hyphens
SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')
FOLDER="${NEXT}-${SLUG}"
DEST="$EXPERIMENTS_DIR/$FOLDER"

# create experiment folder and copy template
mkdir -p "$DEST"
cp "$TEMPLATE_DIR/index.html" "$DEST/index.html"
cp "$TEMPLATE_DIR/sketch.js" "$DEST/sketch.js"
cp "$TEMPLATE_DIR/meta.json" "$DEST/meta.json"

# collect all .js files from lib/ for auto-inclusion
LIBS_JSON="[]"
LIB_FILES=$(ls -1 "$ROOT/lib/"*.js 2>/dev/null | sort)
if [ -n "$LIB_FILES" ]; then
  LIBS_JSON="["
  FIRST=true
  for f in $LIB_FILES; do
    BASENAME=$(basename "$f")
    if $FIRST; then FIRST=false; else LIBS_JSON="$LIBS_JSON,"; fi
    LIBS_JSON="$LIBS_JSON\"$BASENAME\""
  done
  LIBS_JSON="$LIBS_JSON]"
fi

# update meta.json with title, date, and libs
DATE=$(date +%Y-%m-%d)
TMP=$(mktemp)
sed -e "s/\"title\": \"\"/\"title\": \"$NAME\"/" \
    -e "s/\"date\": \"\"/\"date\": \"$DATE\"/" \
    -e "s/\"libs\": \[\]/\"libs\": $LIBS_JSON/" \
    "$DEST/meta.json" > "$TMP" && mv "$TMP" "$DEST/meta.json"

# add to experiments/index.json
ENTRY="{\"slug\":\"$FOLDER\",\"title\":\"$NAME\",\"date\":\"$DATE\",\"tags\":[],\"libs\":$LIBS_JSON}"
TMP=$(mktemp)
if [ "$(cat "$INDEX_JSON")" = "[]" ]; then
  echo "[$ENTRY]" > "$TMP"
else
  # remove trailing ] and append new entry
  sed '$ s/]$//' "$INDEX_JSON" > "$TMP"
  echo ",$ENTRY]" >> "$TMP"
fi
mv "$TMP" "$INDEX_JSON"

echo "created: experiments/$FOLDER/"
