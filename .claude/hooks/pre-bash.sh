#!/usr/bin/env bash
# Blocks dangerous bash commands and requires explicit user confirmation.
# Exit 2 = block the tool call; Claude will report the reason to the user.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('tool_input', {}).get('command', ''))
" 2>/dev/null)

DANGEROUS_PATTERNS=(
  "rm -rf"
  "rm -fr"
  "git push --force"
  "git push -f "
  "git reset --hard"
  "git clean -f"
  "git clean -fd"
  "git clean -fx"
  "DROP TABLE"
  "DROP DATABASE"
  "truncate table"
  "chmod -R 777"
  ":(){ :|:& };:"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern"; then
    echo "BLOCKED: Dangerous pattern detected → '$pattern'" >&2
    echo "Ask the user for explicit confirmation before running this command." >&2
    exit 2
  fi
done

exit 0
