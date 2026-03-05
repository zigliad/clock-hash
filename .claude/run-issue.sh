#!/bin/bash
# Usage: .claude/run-issue.sh IAI-15

ISSUE_ID=$1

if [ -z "$ISSUE_ID" ]; then
  echo "Usage: .claude/run-issue.sh <ISSUE_ID>  (e.g. IAI-15)"
  exit 1
fi

# Load secrets
source "$(dirname "$0")/../.env.local"

echo "================================================"
echo "  Claude Code — $ISSUE_ID"
echo "================================================"

# Fetch issue details + team info from Linear API directly
echo "Fetching $ISSUE_ID from Linear..."
ISSUE_JSON=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"{ issue(id: \\\"$ISSUE_ID\\\") { id identifier title description team { id states { nodes { id name type } } } } }\"}")

ISSUE_TITLE=$(echo "$ISSUE_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['issue']['title'])" 2>/dev/null)
ISSUE_DESC=$(echo "$ISSUE_JSON"  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['issue']['description'] or '')" 2>/dev/null)
ISSUE_UUID=$(echo "$ISSUE_JSON"  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['issue']['id'])" 2>/dev/null)
DONE_STATE_ID=$(echo "$ISSUE_JSON" | python3 -c "
import sys,json
d=json.load(sys.stdin)
states=d['data']['issue']['team']['states']['nodes']
done=[s for s in states if s['type']=='completed']
print(done[0]['id'] if done else '')
" 2>/dev/null)
IN_PROGRESS_STATE_ID=$(echo "$ISSUE_JSON" | python3 -c "
import sys,json
d=json.load(sys.stdin)
states=d['data']['issue']['team']['states']['nodes']
prog=[s for s in states if s['type']=='started']
print(prog[0]['id'] if prog else '')
" 2>/dev/null)

if [ -z "$ISSUE_TITLE" ]; then
  echo "ERROR: Could not fetch issue $ISSUE_ID. Check your LINEAR_API_KEY."
  echo "Raw response: $ISSUE_JSON"
  exit 1
fi

echo "✓ Got issue: $ISSUE_TITLE"

# Move issue to In Progress via curl (avoids MCP linear_search_issues hanging)
if [ -n "$IN_PROGRESS_STATE_ID" ] && [ -n "$ISSUE_UUID" ]; then
  echo "Moving $ISSUE_ID to In Progress..."
  curl -s -X POST https://api.linear.app/graphql \
    -H "Authorization: $LINEAR_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"mutation { issueUpdate(id: \\\"$ISSUE_UUID\\\", input: { stateId: \\\"$IN_PROGRESS_STATE_ID\\\" }) { success } }\"}" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print('✓ In Progress' if d.get('data',{}).get('issueUpdate',{}).get('success') else '⚠ Could not update state')" 2>/dev/null
fi

echo ""

# Write prompt to temp file
PROMPT_FILE=$(mktemp -t claude-prompt)
cat > "$PROMPT_FILE" <<PROMPT
You are an autonomous engineer on the clock-hash project.

Here are the full details for Linear issue $ISSUE_ID:

TITLE: $ISSUE_TITLE
INTERNAL UUID: $ISSUE_UUID
DONE STATE ID: $DONE_STATE_ID

$ISSUE_DESC

---

Your job is to fully implement Linear issue $ISSUE_ID autonomously.

## IMPORTANT — Linear MCP rules
NEVER call linear_search_issues or linear_get_issues. These hang in non-interactive mode.
The issue details are already provided above — you do not need to fetch them.
Issue is already moved to In Progress by the shell script.
To mark the issue Done at the end, run this exact bash command:
  curl -s -X POST https://api.linear.app/graphql \
    -H "Authorization: \$LINEAR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"query":"mutation{issueUpdate(id:\"$ISSUE_UUID\",input:{stateId:\"$DONE_STATE_ID\"}){success}}"}'

## Step 0 — Classify
Read the issue title and description above. Output: [TIER: SMALL | MEDIUM | LARGE]
Use the Tier Classification rules in CLAUDE.md.

## Step 1 — Branch setup
git checkout dev && git pull origin dev
Create branch using the naming convention in CLAUDE.md.

## Steps 2–4 — Follow the adaptive workflow in CLAUDE.md exactly
Based on your tier classification, follow the matching Phase 1 (Research),
Phase 2 (Planning & Implementation), Phase 3 (Self-CR), and Phase 4 (Merge)
instructions from CLAUDE.md.

Key rules that apply to ALL tiers:
- TDD always: write failing tests first, then implement
- Follow ALL Coding Conventions in CLAUDE.md
- npm run lint && (command -v semgrep &>/dev/null && semgrep --config=auto src/ || echo "semgrep skipped")
- Self-CR fix loop: max 3 rounds before escalating to human
- After merge: capture PR URL and run: bash .claude/changelog.sh "$ISSUE_ID" "$ISSUE_TITLE" "<pr_url>"
- Then mark issue Done using the curl command above

Do not stop until the issue is Done in Linear.
PROMPT

claude --mcp-config "$(dirname "$0")/mcp-config.json" \
  --dangerously-skip-permissions \
  --verbose \
  --output-format stream-json \
  -p "$(cat "$PROMPT_FILE")" | python3 -u -c "
import sys, json

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    try:
        ev = json.loads(line)
    except json.JSONDecodeError:
        print(line)
        continue

    t = ev.get('type', '')

    if t == 'assistant':
        for block in ev.get('message', {}).get('content', []):
            if block.get('type') == 'text':
                print(block['text'], end='', flush=True)
            elif block.get('type') == 'tool_use':
                name = block.get('name', '')
                inp  = block.get('input', {})
                if 'command' in inp:
                    print(f'\n[bash] {inp[\"command\"]}', flush=True)
                elif 'file_path' in inp and name in ('Write', 'Edit'):
                    print(f'\n[{name}] {inp[\"file_path\"]}', flush=True)
                elif name.startswith('mcp'):
                    print(f'\n[mcp]  {name}({list(inp.keys())})', flush=True)
                else:
                    print(f'\n[{name}]', flush=True)

    elif t == 'tool_result':
        content = ev.get('content', '')
        if isinstance(content, list):
            for c in content:
                if c.get('type') == 'text':
                    print(f'  → {c[\"text\"][:300]}', flush=True)
        elif isinstance(content, str) and content.strip():
            print(f'  → {content.strip()[:300]}', flush=True)

    elif t == 'result':
        print(f'\n================================================', flush=True)
        print(f'  Done — {ev.get(\"subtype\",\"\")}', flush=True)
        print(f'  Cost: \${ev.get(\"cost_usd\", 0):.4f}  |  Turns: {ev.get(\"num_turns\", \"?\")}', flush=True)
        print(f'================================================', flush=True)
"

rm -f "$PROMPT_FILE"
