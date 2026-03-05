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

---

## Adaptive Workflow

Before doing anything else, classify the issue into a tier:

### Tier Classification

**SMALL** — bug fix, copy change, style tweak, single prop addition
- Signals: touches ≤ 2 files, no new hooks/utils needed, no new component

**MEDIUM** — new component, new hook, small feature end-to-end
- Signals: touches 3–6 files, at most one new hook or util module

**LARGE** — multi-component feature, new subsystem, cross-cutting concern
- Signals: touches 7+ files, needs multiple new hooks/components/utils, or
  involves data flow changes across the app

Output your classification as: `[TIER: SMALL | MEDIUM | LARGE]` before proceeding.

---

## Phase 1 — Research

### SMALL
Read only the files directly relevant to the issue. No parallel agents needed.

### MEDIUM
Spawn 2 agents IN PARALLEL:

**Agent 1 — Codebase Scan**
"Read src/components/ and src/hooks/. Summarise existing patterns,
naming conventions, and what hooks already exist. Output JSON."

**Agent 2 — Test Coverage Map**
"Read all *.test.* files in src/. Summarise what is tested and what gaps exist. Output JSON."

### LARGE
Spawn 3 agents IN PARALLEL:

**Agent 1 — Component Patterns**
"Read all files in src/components/. Summarise: existing component structure,
naming conventions, prop patterns, and any shared primitives. Output as JSON:
{ components: [...], patterns: [...], sharedPrimitives: [...] }"

**Agent 2 — Hooks & Utils Inventory**
"Read all files in src/hooks/ and src/utils/. Summarise: existing hooks,
utility functions, constants, and what each does. Output as JSON:
{ hooks: [...], utils: [...], constants: [...] }"

**Agent 3 — Test Coverage Map**
"Read all *.test.* files in src/. Summarise: what is already tested,
what is NOT tested, and any patterns in test structure. Output as JSON:
{ covered: [...], gaps: [...], testPatterns: [...] }"

Wait for all agents to complete before continuing.

---

## Phase 2 — Planning & Implementation

### SMALL
1. Move issue to In Progress
2. Branch off dev
3. Write failing test(s) → implement → green
4. Lint + semgrep

### MEDIUM
1. Move issue to In Progress
2. Branch off dev
3. Spawn **Architect Agent**:
   "Given the issue and codebase research, produce a concise implementation plan:
   which files to create/modify, what each does, how they connect.
   Output JSON: { filesToCreate: [...], filesToModify: [...], dataFlow: '...' }"
4. Follow the plan: write failing tests → implement → green
5. Lint + semgrep

### LARGE
Spawn agents sequentially — each feeds the next:

**Step 1 — Architect Agent**
"Design the full solution: component tree, hook responsibilities, util contracts,
data flow, and file structure. Be precise. Output JSON plan."

**Step 2 — Test Author Agent** (receives architect's plan)
"Write ALL tests for the plan above. Do not implement — tests must be RED.
Cover: happy path, edge cases, error states, accessibility where relevant."

**Step 3 — Parallel Implementer Agents** (receive plan + failing tests)
Spawn one agent per logical slice, IN PARALLEL:
- Agent A: implement hooks + utils
- Agent B: implement components (pure UI, no logic)

Wait for both to complete, then:

**Step 4 — Integrator Agent** (receives all outputs)
"Wire everything together: update App/router/index exports as needed.
Ensure all tests are now GREEN. Do not change logic — only integrate."

**Step 5 — UI Polish Agent** (receives integrated code)
"Review only styles and layout. Fix spacing, responsiveness, visual consistency
with the existing design. No logic changes."

---

## Phase 3 — Self-CR

### SMALL
Spawn 1 reviewer with the full diff:

**Reviewer — Bug & Conventions**
"You did NOT write this code. Hunt for: bugs, edge cases, SOLID violations,
naming issues, missing tests. Output ONLY valid JSON:
{ verdict: APPROVED | CHANGES_REQUESTED,
  findings: [{ severity: HIGH|MED|LOW, file, line, issue }] }"

### MEDIUM
Spawn 2 reviewers IN PARALLEL with the full diff:

**Reviewer A — Bug & Security**
"You did NOT write this code. Hunt for: bugs, security issues, null crashes,
edge cases, race conditions. Be adversarial. Output ONLY valid JSON:
{ verdict: APPROVED | CHANGES_REQUESTED,
  findings: [{ severity: HIGH|MED|LOW, file, line, issue }] }"

**Reviewer B — Architecture & Conventions**
"You did NOT write this code. Hunt for: SOLID violations, components over 80 lines,
files over 200 lines, prop drilling, logic in components, magic strings, test gaps.
Output ONLY valid JSON:
{ verdict: APPROVED | CHANGES_REQUESTED,
  findings: [{ severity: HIGH|MED|LOW, file, line, issue }] }"

Overall = APPROVED only if BOTH approve.

### LARGE
Spawn 3 reviewers IN PARALLEL with the full diff:

**Reviewer A — Bug & Security** (same as MEDIUM)

**Reviewer B — Architecture & Conventions** (same as MEDIUM)

**Reviewer C — UX & Accessibility**
"You did NOT write this code. Hunt for: missing aria labels, keyboard traps,
colour contrast issues, poor loading/error states, janky animations,
unresponsive layouts. Output ONLY valid JSON:
{ verdict: APPROVED | CHANGES_REQUESTED,
  findings: [{ severity: HIGH|MED|LOW, file, line, issue }] }"

Overall = APPROVED only if ALL THREE approve.

### Fix Loop (all tiers)
IF any reviewer returns CHANGES_REQUESTED:
  - Fix all findings (HIGH first, then MED, then LOW)
  - Re-run full test suite + lint + semgrep
  - Spawn reviewer(s) again with new diff
  - Repeat up to MAX 3 ROUNDS
  - Do NOT comment on Linear during this loop

IF still failing after round 3:
  - Comment on Linear: 'Self-CR blocked after 3 rounds. Human review needed.'
  - STOP. Do not merge.

---

## Phase 4 — Merge (all tiers)
1. Write .claude/.cr_approved marker file
2. Run merge gate: bash .claude/merge-gate.sh
3. gh pr merge {PR} --squash --delete-branch
4. git checkout dev && git pull origin dev
5. Move Linear issue to: Done
6. bash .claude/changelog.sh "{id}" "{title}" "{pr_url}"

---

## Definition of Done
- Tests: all passing
- Lint: zero errors
- Security: no HIGH or CRITICAL findings
- Self-CR: APPROVED verdict received (1 reviewer for SMALL, 2 for MEDIUM, 3 for LARGE)
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
