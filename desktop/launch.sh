#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
exec "$DIR/node_modules/.bin/electron" "$DIR/main.js" --no-sandbox
