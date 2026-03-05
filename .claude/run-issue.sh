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

# Fetch issue details from Linear API directly
echo "Fetching $ISSUE_ID from Linear..."
ISSUE_JSON=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"{ issue(id: \\\"$ISSUE_ID\\\") { id identifier title description state { name } } }\"}")

ISSUE_TITLE=$(echo "$ISSUE_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['issue']['title'])" 2>/dev/null)
ISSUE_DESC=$(echo "$ISSUE_JSON"  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['issue']['description'] or '')" 2>/dev/null)

if [ -z "$ISSUE_TITLE" ]; then
  echo "ERROR: Could not fetch issue $ISSUE_ID. Check your LINEAR_API_KEY."
  echo "Raw response: $ISSUE_JSON"
  exit 1
fi

echo "✓ Got issue: $ISSUE_TITLE"
echo ""

# Write prompt to temp file
PROMPT_FILE=$(mktemp -t claude-prompt)
cat > "$PROMPT_FILE" <<PROMPT
You are an autonomous engineer on the clock-hash project.

Here are the full details for Linear issue $ISSUE_ID:

TITLE: $ISSUE_TITLE

$ISSUE_DESC

---

Follow this exact sequence:

1. Move issue $ISSUE_ID to In Progress via Linear MCP
2. git checkout dev && git pull origin dev
3. Create branch: feature/$ISSUE_ID-{kebab-slug derived from title}
4. Write tests first — confirm RED — then implement until GREEN
5. Follow ALL coding conventions in CLAUDE.md (SOLID, file size, naming, structure)
6. npm run lint && (command -v semgrep &>/dev/null && semgrep --config=auto src/ || echo "semgrep not installed, skipping")
7. Self-CR protocol (CLAUDE.md) — reviewer checks conventions too — max 3 rounds
8. When APPROVED: bash .claude/merge-gate.sh, commit, push, open PR with gh, merge --squash --delete-branch, move $ISSUE_ID to Done via Linear MCP
9. After merge: capture the PR URL and run: bash .claude/changelog.sh "$ISSUE_ID" "<issue title>" "<pr url>"

Do not stop until the issue is Done.
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
