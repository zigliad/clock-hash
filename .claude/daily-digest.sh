#!/bin/bash
# Prints a digest of all Linear issues completed today.
# Usage: .claude/daily-digest.sh

source "$(dirname "$0")/../.env.local"

TODAY=$(date '+%Y-%m-%d')
echo "================================================"
echo "  Daily Digest — $TODAY"
echo "================================================"
echo ""

RESULT=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"{ issues(filter: { state: { type: { eq: \\\"completed\\\" } }, completedAt: { gte: \\\"${TODAY}T00:00:00Z\\\" } }) { nodes { identifier title completedAt assignee { name } } } }\"
  }")

COUNT=$(echo "$RESULT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
nodes = data.get('data', {}).get('issues', {}).get('nodes', [])
print(len(nodes))
" 2>/dev/null)

if [ "$COUNT" = "0" ] || [ -z "$COUNT" ]; then
  echo "No issues completed today."
else
  echo "✓ $COUNT issue(s) shipped today:"
  echo ""
  echo "$RESULT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
nodes = data.get('data', {}).get('issues', {}).get('nodes', [])
for n in nodes:
    assignee = (n.get('assignee') or {}).get('name', 'unassigned')
    t = n.get('completedAt', '')[:16].replace('T', ' ')
    print(f\"  ✓ {n['identifier']} — {n['title']}\")
    print(f\"    Completed at {t} by {assignee}\")
    print()
" 2>/dev/null
fi

echo ""

# Also show what's still in progress
IN_PROGRESS=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ issues(filter: { state: { type: { eq: \"started\" } } }) { nodes { identifier title } } }"}')

echo "$IN_PROGRESS" | python3 -c "
import sys, json
data = json.load(sys.stdin)
nodes = data.get('data', {}).get('issues', {}).get('nodes', [])
if nodes:
    print('Still in progress:')
    for n in nodes:
        print(f\"  → {n['identifier']} — {n['title']}\")
" 2>/dev/null

echo ""
echo "================================================"
