# Linear Issue Template — clock-hash

Copy this template into every Linear issue assigned to Claude.

---

## Description
[What needs to be built or fixed — be specific, one paragraph max]

## Acceptance Criteria
- [ ] Criterion 1 (testable, specific)
- [ ] Criterion 2
- [ ] Criterion 3

## Example Inputs / Outputs
Input: [concrete example]
Output: [expected result]

## Out of Scope
- [What Claude should NOT change or touch]

## Notes
- [Any constraints, related issues, relevant context]

---

# Session Starter Prompt — Create issue + run feature

Paste this into Claude Code to create the Linear issue and immediately work on it.
Fill in the FEATURE DESCRIPTION section before pasting.

```
You are an autonomous engineer on the clock-hash project.
Linear workspace: zigliad
Linear project: Clock Hash

== FEATURE DESCRIPTION ==
Add a row of semi-transparent world clock squares at the top of the screen.
Each square shows a city name and its current local time, updating in real time.
Clicking a square sets the main clock to that timezone.
The clicked card should be visually highlighted as active.
Default timezones: UTC, New York, London, Tokyo, Sydney.
Use the browser Intl.DateTimeFormat API — no external date libraries.
Keep the existing main clock UI intact.
== END FEATURE DESCRIPTION ==

Follow this exact sequence:

STEP 0 — Create Linear issue
- Use MCP to create a new issue in the zigliad workspace, Clock Hash project
- Title: "Add world clocks bar with click-to-set main time"
- Write a full description with Acceptance Criteria, Example Inputs/Outputs,
  Out of Scope, and Notes based on the feature description above
- Note the issue ID (e.g. CLK-5) — use it for all remaining steps

STEP 1 — Start work
- Move issue status to In Progress via MCP
- git checkout dev && git pull origin dev
- Create branch: feature/{ISSUE-ID}-world-clocks-bar

STEP 2 — TDD (tests first)
- Write unit tests for: timezone formatting, active state logic, time updates
- Write component tests for: card rendering, click handler, highlight behaviour
- Run: npm test — confirm ALL tests are RED before writing any implementation

STEP 3 — Implement
- Follow ALL coding conventions in CLAUDE.md (SOLID, file size, naming, structure)
- Write minimum code to make all tests green
- Run: npm test — confirm all pass

STEP 4 — Quality gates
- Run: npm run lint — fix all errors
- Run: npx semgrep --config=auto src/ — fix HIGH/CRITICAL findings

STEP 5 — Self-CR (as defined in CLAUDE.md)
- Spawn reviewer subagent with git diff vs dev
- Reviewer checks code quality AND coding conventions from CLAUDE.md
- Fix findings silently (HIGH → MED → LOW), max 3 rounds
- When APPROVED: write .claude/.cr_approved marker file

STEP 6 — Ship
- Run merge gate: bash .claude/merge-gate.sh
- Commit: git commit -m "feat({ISSUE-ID}): add world clocks bar with click-to-set main time"
- Push branch and open PR with gh cli
- gh pr merge --squash --delete-branch
- git checkout dev && git pull origin dev
- Move Linear issue to Done via MCP
- Linear issue moved to Done via MCP

Do not ask for clarification. Make reasonable assumptions and document them in the PR body.
Do not stop until the issue is Done.
```

---

# Re-usable starter prompt (for future issues)

For future features where the Linear issue already exists, paste this and replace {ISSUE-ID}:

```
You are an autonomous engineer on the clock-hash project.
Work on Linear issue {ISSUE-ID} in the zigliad workspace.

1. Fetch the issue via MCP — read title, description, and ALL acceptance criteria
2. Move issue to In Progress
3. git checkout dev && git pull origin dev
4. Create branch: feature/{ISSUE-ID}-{kebab-slug}
5. Write tests first — confirm RED — then implement until GREEN
6. Follow ALL coding conventions in CLAUDE.md (SOLID, file size, naming, structure)
7. npm run lint && npx semgrep --config=auto src/
8. Self-CR protocol (CLAUDE.md) — reviewer checks conventions too — max 3 rounds
9. When APPROVED: run merge-gate.sh, commit, push, open PR, merge --squash, close Linear issue

Do not stop until the issue is Done.
```
