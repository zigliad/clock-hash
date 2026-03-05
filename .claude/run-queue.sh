#!/bin/bash
# Fetches all Todo issues from Linear (highest priority first) and runs them sequentially.
# Usage: .claude/run-queue.sh
#        .claude/run-queue.sh --dry-run   (list issues without running)

DRY_RUN=false
[[ "$1" == "--dry-run" ]] && DRY_RUN=true

source "$(dirname "$0")/../.env.local"

SCRIPT_DIR="$(dirname "$0")"

echo "================================================"
echo "  Claude Code — Auto Queue"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================================"
echo ""

# Fetch all Todo issues sorted by priority (1=Urgent, 2=High, 3=Normal, 4=Low)
ISSUES_JSON=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ issues(filter: { state: { type: { eq: \"unstarted\" } } }) { nodes { identifier title priority state { name } } } }"}')

# Parse and sort by priority (1=Urgent → 4=Low → 0=No priority last)
ISSUES=$(echo "$ISSUES_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)
nodes = data.get('data', {}).get('issues', {}).get('nodes', [])
priority_labels = {0: 'No priority', 1: 'Urgent', 2: 'High', 3: 'Normal', 4: 'Low'}
# Sort: 1,2,3,4 first, then 0 (no priority) last
nodes.sort(key=lambda n: n.get('priority') or 99)
for n in nodes:
    p = priority_labels.get(n.get('priority', 0), 'Unknown')
    print(f\"{n['identifier']}|{n['title']}|{p}\")
" 2>/dev/null)

if [ -z "$ISSUES" ]; then
  echo "No Todo issues found in Linear. Nothing to do."
  exit 0
fi

# Count and list
TOTAL=$(echo "$ISSUES" | wc -l | tr -d ' ')
echo "Found $TOTAL issue(s) in queue:"
echo ""
echo "$ISSUES" | while IFS='|' read -r id title priority; do
  echo "  [$priority] $id — $title"
done
echo ""

if [ "$DRY_RUN" = true ]; then
  echo "Dry run — exiting without running."
  exit 0
fi

echo "Starting in 3 seconds... (Ctrl+C to abort)"
sleep 3
echo ""

# Process each issue
PASSED=0
FAILED=0
FAILED_IDS=""

echo "$ISSUES" | while IFS='|' read -r ISSUE_ID ISSUE_TITLE PRIORITY; do
  echo "================================================"
  echo "  Running [$PRIORITY] $ISSUE_ID — $ISSUE_TITLE"
  echo "  Started: $(date '+%H:%M:%S')"
  echo "================================================"

  bash "$SCRIPT_DIR/run-issue.sh" "$ISSUE_ID"
  EXIT_CODE=$?

  if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✓ $ISSUE_ID completed successfully"
    PASSED=$((PASSED + 1))
  else
    echo ""
    echo "✗ $ISSUE_ID failed (exit $EXIT_CODE) — skipping to next issue"
    FAILED=$((FAILED + 1))
    FAILED_IDS="$FAILED_IDS $ISSUE_ID"
  fi
  echo ""
done

echo "================================================"
echo "  Queue complete — $(date '+%H:%M:%S')"
echo "  ✓ Passed: $PASSED  |  ✗ Failed: $FAILED"
[ -n "$FAILED_IDS" ] && echo "  Failed issues:$FAILED_IDS"
echo "================================================"
