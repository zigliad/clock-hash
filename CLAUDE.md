# Project: clock-hash
# Stack: React 19, Vite 7, TypeScript, Tailwind CSS, shadcn/ui, ESLint, Vitest, @testing-library/react

## Rules
- TDD always: write failing tests first, implement until green
- Coverage >= 80% (`npm run test:coverage`)
- Lint before every commit: `npm run lint`
- Security: `npx semgrep --config=auto src/` (skip if not installed)
- Max 3 Self-CR rounds before escalating to human
- Branch off `dev`, merge back to `dev`
- Branch naming: `feature|fix|chore/LIN-{id}-{kebab-slug}`
- PR title: `[LIN-{id}] Brief description` — body: What/Why/Tests/Closes

---

## Step 0 — Classify
Output `[TIER: SMALL | MEDIUM | LARGE]` before doing anything else.

| Tier | Signal |
|------|--------|
| **SMALL** | ≤ 2 files, no new hooks/components |
| **MEDIUM** | 3–6 files, ≤ 1 new hook or util |
| **LARGE** | 7+ files, multiple new hooks/components, or cross-cutting data flow |

---

## Phase 1 — Research

**SMALL** — Read only relevant files directly.

**MEDIUM** — Spawn 2 agents IN PARALLEL:
- Agent 1: Read `src/components/` + `src/hooks/`. Summarise patterns + existing hooks. Output JSON.
- Agent 2: Read all `*.test.*` files. Summarise what's tested and gaps. Output JSON.

**LARGE** — Spawn 3 agents IN PARALLEL:
- Agent 1: Read `src/components/`. Output `{ components, patterns, sharedPrimitives }`.
- Agent 2: Read `src/hooks/` + `src/utils/`. Output `{ hooks, utils, constants }`.
- Agent 3: Read all `*.test.*` files. Output `{ covered, gaps, testPatterns }`.

Wait for all agents before continuing.

---

## Phase 2 — Implementation

**SMALL** — Branch → write failing tests → implement → green → lint.

**MEDIUM** — Branch → Architect Agent (output JSON plan: `filesToCreate, filesToModify, dataFlow`) → follow plan → TDD → lint.

**LARGE** — Run agents sequentially, each feeds the next:
1. **Architect** — full solution design, JSON plan
2. **Test Author** (gets plan) — write ALL tests, RED only, no implementation
3. **Parallel implementers** (get plan + tests): Agent A: hooks + utils | Agent B: components
4. **Integrator** (gets all outputs) — wire together, ensure GREEN, no logic changes
5. **UI Polish** (gets integrated code) — styles/layout/responsiveness only, no logic

---

## Phase 3 — Self-CR

All reviewers receive the full `git diff` vs `dev`. Output format for all:
`{ verdict: APPROVED | CHANGES_REQUESTED, findings: [{ severity: HIGH|MED|LOW, file, line, issue }] }`

**SMALL** — 1 reviewer: bugs, edge cases, SOLID violations, naming, missing tests.

**MEDIUM** — Run `bash .claude/visual-check.sh` first, then 3 reviewers IN PARALLEL:
- **Reviewer A** — bugs, security, null crashes, race conditions
- **Reviewer B** — SOLID violations, files >200 lines, components >80 lines, prop drilling, magic strings
- **Reviewer C** — overlapping components, missing flex/grid, bad `position:absolute`, z-index conflicts, overflow issues, unresponsive layouts

**LARGE** — 3 reviewers IN PARALLEL (A + B same as MEDIUM):
- **Reviewer C** — aria labels, keyboard traps, colour contrast, loading/error states, unresponsive layouts

Overall = APPROVED only if ALL reviewers approve.

**Fix loop:** Fix findings (HIGH → MED → LOW), re-run tests + lint, respawn reviewers. Max 3 rounds.
If still failing after round 3 → comment on Linear: "Self-CR blocked after 3 rounds. Human review needed." → STOP.

---

## Phase 4 — Merge
1. Write `.claude/.cr_approved`
2. `bash .claude/merge-gate.sh`
3. `gh pr merge {PR} --squash --delete-branch`
4. `git checkout dev && git pull origin dev`
5. Mark Linear issue Done
6. `bash .claude/changelog.sh "{id}" "{title}" "{pr_url}"`

---

## Coding Conventions

**Files** — Max 200 lines. One concept per file (one component, one hook, one util).

**SOLID** — Single responsibility (no "and"); extend via props not modification; no prop drilling >2 levels; inject dependencies, don't hardcode.

**React** — Hooks think, components render. Max ~80 lines per component. Pure/stateless preferred. Co-locate tests: `MyComponent.test.jsx` beside `MyComponent.jsx`.

**Functions** — Pure where possible. Max 3 params (group into object if more). Named constants, no magic values. Early returns over nesting.

**TypeScript** — Strict mode always. No `any` without a comment explaining why. All props must have explicit interfaces or type aliases. All hook return types and util function signatures must be explicitly typed. Files: `.ts` / `.tsx`.

**Naming** — Components: `PascalCase` | Hooks: `useHookName` | Utils: `camelCase` | Types: `PascalCase` | Tests: `{name}.test.tsx`

**Structure**
```
src/
  features/      # One folder per feature — component + hook + types + tests co-located
  components/    # Shared UI primitives used across 3+ features
    ui/          # shadcn/ui re-exports
  hooks/         # Shared hooks used by multiple features
  utils/         # Pure functions used app-wide
  types/         # Shared TypeScript types and interfaces
  test/          # Global test setup only
```
No cross-feature imports — shared logic goes to `hooks/` or `utils/`.

**UI & Styling** — Use shadcn/ui components first before building custom ones. Compose with Tailwind utility classes only — no CSS modules, no inline styles. Import shadcn components from `@/components/ui/`.

**Layout** (violations = HIGH in Self-CR):
- No `position:absolute/fixed` in normal flow — overlays only, always with `position:relative` parent
- Always flexbox/grid for multi-element layouts (`flex`, `grid` Tailwind classes)
- No magic z-index — use named constants in `src/utils/zIndex.js`
- Every component must define its own width
- `overflow:hidden` on containers whose children might escape
- Must pass at 375px (mobile) and 1280px (desktop) before Self-CR
- No inline styles for layout — Tailwind classes only (no CSS modules)
