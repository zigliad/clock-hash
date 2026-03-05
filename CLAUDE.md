# Project: clock-hash
# Stack: React 19, Vite 7, ESLint, Vitest, @testing-library/react

## Workflow Rules
1. ALWAYS read the Linear issue fully before touching any code
2. Write tests FIRST — no implementation without failing tests (TDD)
3. Run lint before every commit: `npm run lint`
4. Run security scan: `npx semgrep --config=auto src/`
5. Coverage must stay >= 80%
6. Max 3 Self-CR rounds before escalating to human

## Branch Naming
feature/LIN-{issue-id}-{kebab-slug}
fix/LIN-{issue-id}-{kebab-slug}
chore/LIN-{issue-id}-{kebab-slug}

## Base Branch
Always branch off `master` and merge back to `master`.
`git checkout master && git pull origin master` before creating a new branch.

## Test Strategy
- Unit: vitest for pure functions, hooks, utils
- Integration: @testing-library/react for components
- Run all: `npm test` before marking work done
- Coverage: `npm run test:coverage`

## PR Format
Title: [LIN-{id}] Brief description
Body:
## What changed
## Why
## Tests added
Closes LIN-{id}

## Self-CR Protocol
After implementation is complete and tests are green:

### Step 1 — Spawn Reviewer Agent
Run a NEW subagent with this system prompt:
"You are a senior code reviewer. You did NOT write this code.
Find real bugs, security issues, missing edge cases, test gaps.
Be adversarial. Output ONLY valid JSON:
{ verdict: APPROVED | CHANGES_REQUESTED,
  findings: [{ severity: HIGH|MED|LOW, file, line, issue }] }"
Give the reviewer: git diff of feature branch vs master

### Step 2 — Fix Loop (silent, no Linear comments)
IF verdict == CHANGES_REQUESTED:
  - Fix each finding (HIGH first, then MED, then LOW)
  - Re-run full test suite + lint + semgrep
  - Spawn reviewer agent again with new diff
  - Repeat up to MAX 3 ROUNDS
  - Do NOT comment on Linear during this loop

IF still failing after round 3:
  - Comment on Linear: 'Self-CR blocked after 3 rounds. Human review needed.'
  - Post to Slack: same message + diff summary
  - STOP. Do not merge.

### Step 3 — Notify Before Merge (when APPROVED)
1. Post to Slack #dev-merges:
   "LIN-{ID} ready to merge to master
   PR: {url} | Tests: OK | Lint: OK | Security: OK | CR: OK
   Merging in 5 min unless you reply STOP"
2. Comment on Linear issue with PR link + merge intent
3. Wait 300 seconds
4. Check Slack for STOP reply — if found, abort

### Step 4 — Auto-Merge
gh pr merge {PR} --squash --delete-branch
git checkout master && git pull origin master
Move Linear issue to: Done
Post Slack: LIN-{ID} merged to master.

## Definition of Done
- Tests: all passing
- Lint: zero errors
- Security: no HIGH or CRITICAL findings
- Self-CR: APPROVED verdict received
- PR: opened and linked to Linear issue
- Notify: Slack + Linear comment sent
- Merge: squash-merged to master
- Linear: issue moved to Done
