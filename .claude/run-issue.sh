#!/bin/bash
# Usage: .claude/run-issue.sh IAI-15
# Launches Claude Code pointed at a specific Linear issue, with live streaming output.

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
7. npm run lint && (command -v semgrep &>/dev/null && semgrep --config=auto src/ || echo "semgrep not installed, skipping")
8. Self-CR protocol (CLAUDE.md) — reviewer checks conventions too — max 3 rounds
9. When APPROVED: run merge-gate.sh, commit, push, open PR, merge --squash, close Linear issue

Do not stop until the issue is Done."

echo "================================================"
echo "  Claude Code — $ISSUE_ID"
echo "================================================"
echo ""

claude --mcp-config "$(dirname "$0")/mcp-config.json" \
  --dangerously-skip-permissions \
  --verbose \
  --output-format stream-json \
  -p "$PROMPT" | python3 -u -c "
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
                # Show bash commands
                if 'command' in inp:
                    print(f'\n[bash] {inp[\"command\"]}', flush=True)
                # Show file writes
                elif 'file_path' in inp and name in ('Write', 'Edit'):
                    print(f'\n[{name}] {inp[\"file_path\"]}', flush=True)
                # Show MCP calls
                elif name.startswith('mcp'):
                    print(f'\n[mcp]  {name}({list(inp.keys())})', flush=True)
                else:
                    print(f'\n[{name}]', flush=True)

    elif t == 'tool_result':
        content = ev.get('content', '')
        if isinstance(content, list):
            for c in content:
                if c.get('type') == 'text':
                    text = c['text'][:300]
                    print(f'  → {text}', flush=True)
        elif isinstance(content, str) and content.strip():
            print(f'  → {content.strip()[:300]}', flush=True)

    elif t == 'result':
        print(f'\n================================================', flush=True)
        print(f'  Done — {ev.get(\"subtype\",\"\")}', flush=True)
        print(f'  Cost: \${ev.get(\"cost_usd\", 0):.4f}  |  Turns: {ev.get(\"num_turns\", \"?\")}', flush=True)
        print(f'================================================', flush=True)
"
