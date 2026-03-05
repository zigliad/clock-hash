#!/bin/bash
# Runs before Claude can stop. Blocks if quality conditions not met.

BRANCH=$(git branch --show-current)

# Only enforce on feature/fix branches
[[ "$BRANCH" != feature/* ]] && [[ "$BRANCH" != fix/* ]] && exit 0

echo "=== Merge gate check for branch: $BRANCH ==="

# 1. Tests must pass
echo "Checking tests..."
npm test --silent
if [ $? -ne 0 ]; then
  echo "BLOCK: Tests failing — fix all failing tests before proceeding."
  exit 1
fi
echo "✓ Tests passed"

# 2. Lint must be clean
echo "Checking lint..."
npm run lint --silent
if [ $? -ne 0 ]; then
  echo "BLOCK: Lint errors present — run 'npm run lint' and fix all errors."
  exit 1
fi
echo "✓ Lint clean"

# 3. No HIGH/CRITICAL security findings from Semgrep
echo "Checking security (semgrep)..."
FINDINGS=$(npx semgrep --config=auto src/ --json 2>/dev/null | \
  python3 -c "import sys,json; r=json.load(sys.stdin); \
  print(len([f for f in r.get('results',[]) if f.get('extra',{}).get('severity') in ['ERROR','WARNING']]))")
if [ "$FINDINGS" -gt 0 ]; then
  echo "BLOCK: $FINDINGS security findings — run 'npx semgrep --config=auto src/' and fix HIGH/CRITICAL items."
  exit 1
fi
echo "✓ Security scan clean"

# 4. Self-CR must have been approved (reviewer agent writes this file)
if [ ! -f .claude/.cr_approved ]; then
  echo "BLOCK: Self-CR not yet approved — complete the reviewer agent loop before merging."
  exit 1
fi
echo "✓ Self-CR approved"

echo ""
echo "=== All gates passed — proceeding to merge ==="
exit 0
