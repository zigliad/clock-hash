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
Always branch off `dev` and merge back to `dev`.
`git checkout dev && git pull origin dev` before creating a new branch.

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
Give the reviewer: git diff of feature branch vs dev

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

### Step 3 — Auto-Merge (when APPROVED)
1. Write .claude/.cr_approved marker file
2. Run merge gate: bash .claude/merge-gate.sh
3. gh pr merge {PR} --squash --delete-branch
4. git checkout dev && git pull origin dev
5. Move Linear issue to: Done

## Definition of Done
- Tests: all passing
- Lint: zero errors
- Security: no HIGH or CRITICAL findings
- Self-CR: APPROVED verdict received
- PR: opened and linked to Linear issue
- Merge: squash-merged to dev
- Linear: issue moved to Done

---

## Coding Conventions

These rules are enforced during Self-CR. Violations are treated as MED findings.

### File Size
- Max 200 lines per file. If a file exceeds this, split it.
- One concept per file: one component, one hook, one util module.

### SOLID Principles
- **Single Responsibility**: every function, hook, and component does exactly one thing.
  If you need "and" to describe what it does, split it.
- **Open/Closed**: extend behaviour via props/composition, not by modifying existing components.
- **Liskov Substitution**: components/functions should be replaceable with variants
  without breaking callers.
- **Interface Segregation**: don't pass props a component doesn't use. Compose small
  focused interfaces rather than one large object.
- **Dependency Inversion**: depend on abstractions (props, callbacks, context) not
  concrete implementations. Inject dependencies; don't hardcode them.

### React-Specific
- Extract all non-trivial logic into custom hooks (`use` prefix). Components render, hooks think.
- No component longer than ~80 lines. If it is, extract sub-components or hooks.
- No prop drilling beyond 2 levels. Use context or composition instead.
- Prefer pure, stateless components. Lift state only as high as needed.
- Co-locate tests with source: `MyComponent.test.jsx` next to `MyComponent.jsx`.

### Functions & Logic
- Pure functions wherever possible — no hidden side effects.
- Max 3 parameters per function. Group related params into an object.
- No magic numbers or strings — use named constants.
- Early returns over nested conditionals.
- Avoid comments that explain "what" — write self-documenting code.
  Comments should only explain "why" when the reason is non-obvious.

### Naming
- Components: PascalCase (`WorldClockCard`)
- Hooks: camelCase with `use` prefix (`useWorldClock`)
- Utils/constants: camelCase (`formatTime`, `DEFAULT_TIMEZONES`)
- Test files: `{name}.test.jsx` or `{name}.test.js`

### Structure
```
src/
  components/    # Pure UI components, no business logic
  hooks/         # Custom React hooks
  utils/         # Pure functions, helpers, constants
  test/          # Global test setup only
```
