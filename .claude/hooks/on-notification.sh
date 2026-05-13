#!/usr/bin/env bash
# macOS desktop notification + sound when Claude needs attention.

INPUT=$(cat)
MESSAGE=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('message', 'Claude needs attention'))
" 2>/dev/null)

MESSAGE="${MESSAGE:-Claude needs attention}"

osascript -e "display notification \"$MESSAGE\" with title \"Claude Code\" sound name \"Glass\"" 2>/dev/null || \
  afplay /System/Library/Sounds/Glass.aiff 2>/dev/null || \
  true

exit 0
