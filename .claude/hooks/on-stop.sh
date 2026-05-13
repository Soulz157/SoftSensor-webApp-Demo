#!/usr/bin/env bash
# Logs session end time and transcript path when Claude finishes a task.

INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('session_id', 'unknown'))
" 2>/dev/null)
TRANSCRIPT=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('transcript_path', ''))
" 2>/dev/null)

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
LOG_FILE="$ROOT/.claude/logs/sessions.log"
mkdir -p "$(dirname "$LOG_FILE")"

echo "$(date '+%Y-%m-%d %H:%M:%S')  session=$SESSION_ID  transcript=$TRANSCRIPT" >> "$LOG_FILE"

exit 0
