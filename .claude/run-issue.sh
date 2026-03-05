#!/bin/bash
# Usage: .claude/run-issue.sh IAI-15
# Launches Claude Code pointed at a specific Linear issue.

ISSUE_ID=$1

if [ -z "$ISSUE_ID" ]; then
  echo "Usage: .claude/run-issue.sh <ISSUE_ID>  (e.g. IAI-15)"
  exit 1
fi

# Load secrets
source "$(dirname "$0")/../.env.local"

PROMPT="You are an autonomous engineer on the clock-hash project.
Work on Linear issue $ISSUE_ID in the Iaig workspace.

1. Fetch the issue via MCP — read title, description, and ALL acceptance criteria
2. Move issue to In Progress
3. git checkout dev && git pull origin dev
4. Create branch: feature/$ISSUE_ID-{kebab-slug}
5. Write tests first — confirm RED — then implement until GREEN
6. Follow ALL coding conventions in CLAUDE.md (SOLID, file size, naming, structure)
7. npm run lint && npx semgrep --config=auto src/
8. Self-CR protocol (CLAUDE.md) — reviewer checks conventions too — max 3 rounds
9. When APPROVED: run merge-gate.sh, commit, push, open PR, merge --squash, close issue, post Slack

Do not stop until the issue is Done."

echo "Starting Claude Code for $ISSUE_ID..."
echo ""

claude --mcp-config "$(dirname "$0")/mcp-config.json" \
  --dangerously-skip-permissions \
  --verbose \
  -p "$PROMPT"
