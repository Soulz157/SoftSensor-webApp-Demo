#!/usr/bin/env bash
# Auto-formats TS/TSX/JS/JSX files after Edit or Write tool calls.
# Non-blocking: always exits 0 so a format failure never breaks Claude's flow.

INPUT=$(cat)
FILE=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('tool_input', {}).get('file_path', ''))
" 2>/dev/null)

[[ -z "$FILE" || ! -f "$FILE" ]] && exit 0

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$ROOT" || exit 0

case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx)
    if command -v prettier &>/dev/null || [ -f node_modules/.bin/prettier ]; then
      pnpm exec prettier --write "$FILE" 2>/dev/null || true
    else
      pnpm exec eslint --fix "$FILE" 2>/dev/null || true
    fi
    ;;
  *.css|*.json)
    if command -v prettier &>/dev/null || [ -f node_modules/.bin/prettier ]; then
      pnpm exec prettier --write "$FILE" 2>/dev/null || true
    fi
    ;;
esac

exit 0
