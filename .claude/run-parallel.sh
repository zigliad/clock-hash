#!/bin/bash
# Run multiple Linear issues in parallel using git worktrees.
#
# Usage:
#   .claude/run-parallel.sh IAI-15 IAI-16 IAI-17     # specific issues
#   .claude/run-parallel.sh --queue 3                 # next 3 from Todo queue
#   .claude/run-parallel.sh --queue                   # entire Todo queue in parallel
#
# Each issue gets its own isolated git worktree so there are no file conflicts.
# Merges to dev happen independently as each issue completes.
# Logs are written to .claude/logs/{ISSUE_ID}.log for each issue.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOGS_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOGS_DIR"

source "$REPO_ROOT/.env.local"

# ── Parse arguments ───────────────────────────────────────────────────────────
ISSUE_IDS=()
QUEUE_MODE=false
QUEUE_LIMIT=0

if [[ "$1" == "--queue" ]]; then
  QUEUE_MODE=true
  QUEUE_LIMIT="${2:-0}"
else
  ISSUE_IDS=("$@")
fi

if [ ${#ISSUE_IDS[@]} -eq 0 ] && [ "$QUEUE_MODE" = false ]; then
  echo "Usage:"
  echo "  .claude/run-parallel.sh IAI-15 IAI-16 IAI-17"
  echo "  .claude/run-parallel.sh --queue 3"
  echo "  .claude/run-parallel.sh --queue"
  exit 1
fi

# ── Fetch queue from Linear if needed ────────────────────────────────────────
if [ "$QUEUE_MODE" = true ]; then
  echo "Fetching Todo issues from Linear..."
  ISSUES_JSON=$(curl -s -X POST https://api.linear.app/graphql \
    -H "Authorization: $LINEAR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"query": "{ issues(filter: { state: { type: { eq: \"unstarted\" } } }) { nodes { identifier priority } } }"}')

  QUEUE=$(echo "$ISSUES_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)
nodes = data.get('data', {}).get('issues', {}).get('nodes', [])
nodes.sort(key=lambda n: n.get('priority') or 99)
limit = $QUEUE_LIMIT
for i, n in enumerate(nodes):
    if limit and i >= limit:
        break
    print(n['identifier'])
" 2>/dev/null)

  if [ -z "$QUEUE" ]; then
    echo "No Todo issues found in Linear. Nothing to do."
    exit 0
  fi

  mapfile -t ISSUE_IDS <<< "$QUEUE"
fi

TOTAL=${#ISSUE_IDS[@]}

# ── Summary ───────────────────────────────────────────────────────────────────
echo "================================================"
echo "  Claude Code — Parallel Run"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "  Issues: $TOTAL"
echo "================================================"
for id in "${ISSUE_IDS[@]}"; do
  echo "  • $id"
done
echo ""
echo "Logs: .claude/logs/{ISSUE_ID}.log"
echo ""
echo "Starting in 3 seconds... (Ctrl+C to abort)"
sleep 3
echo ""

# ── Launch all issues in parallel ─────────────────────────────────────────────
declare -A PIDS

for ISSUE_ID in "${ISSUE_IDS[@]}"; do
  LOG="$LOGS_DIR/$ISSUE_ID.log"
  echo "▶ Starting $ISSUE_ID  (log: .claude/logs/$ISSUE_ID.log)"
  bash "$SCRIPT_DIR/run-issue.sh" "$ISSUE_ID" --worktree > "$LOG" 2>&1 &
  PIDS[$ISSUE_ID]=$!
done

echo ""
echo "All $TOTAL issues running. Waiting for completion..."
echo ""

# ── Wait and collect results ──────────────────────────────────────────────────
PASSED=0
FAILED=0
FAILED_IDS=()

for ISSUE_ID in "${!PIDS[@]}"; do
  PID=${PIDS[$ISSUE_ID]}
  wait "$PID"
  EXIT_CODE=$?

  if [ $EXIT_CODE -eq 0 ]; then
    echo "✓ $ISSUE_ID — done"
    PASSED=$((PASSED + 1))
  else
    echo "✗ $ISSUE_ID — failed (exit $EXIT_CODE) — see .claude/logs/$ISSUE_ID.log"
    FAILED=$((FAILED + 1))
    FAILED_IDS+=("$ISSUE_ID")
  fi
done

# ── Final report ──────────────────────────────────────────────────────────────
echo ""
echo "================================================"
echo "  Parallel run complete — $(date '+%H:%M:%S')"
echo "  ✓ Passed: $PASSED  |  ✗ Failed: $FAILED"
if [ ${#FAILED_IDS[@]} -gt 0 ]; then
  echo "  Failed: ${FAILED_IDS[*]}"
  echo "  Check logs in .claude/logs/ for details"
fi
echo "================================================"
