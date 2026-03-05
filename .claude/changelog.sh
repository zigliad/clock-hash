#!/bin/bash
# Appends an entry to CHANGELOG.md after a successful merge.
# Usage: .claude/changelog.sh <ISSUE_ID> <ISSUE_TITLE> <PR_URL>

ISSUE_ID=$1
ISSUE_TITLE=$2
PR_URL=$3
DATE=$(date '+%Y-%m-%d')
ROOT="$(dirname "$0")/.."
CHANGELOG="$ROOT/CHANGELOG.md"

if [ -z "$ISSUE_ID" ] || [ -z "$ISSUE_TITLE" ]; then
  echo "Usage: changelog.sh <ISSUE_ID> <ISSUE_TITLE> [PR_URL]"
  exit 1
fi

# Create CHANGELOG.md if it doesn't exist
if [ ! -f "$CHANGELOG" ]; then
  cat > "$CHANGELOG" <<EOF
# Changelog

All notable changes to clock-hash are documented here.
Format: \`[ISSUE-ID] Title — PR link (date)\`

---

EOF
fi

# Build the entry line
if [ -n "$PR_URL" ]; then
  ENTRY="- [$ISSUE_ID] $ISSUE_TITLE — [PR]($PR_URL) ($DATE)"
else
  ENTRY="- [$ISSUE_ID] $ISSUE_TITLE ($DATE)"
fi

# Insert after the --- separator (line 7)
sed -i '' "s|^---$|---\n$ENTRY|" "$CHANGELOG"

echo "✓ Changelog updated: $ENTRY"
