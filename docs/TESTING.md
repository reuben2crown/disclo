## TESTING GOVERNANCE RULES

These rules are mandatory and apply across the entire system.

---

### RULE 1: TEST-FIRST ENFORCEMENT

- No implementation code may be written without corresponding tests
- Tests must define expected behavior before code exists
- Any violation = invalid output

---

### RULE 2: MINIMUM TEST CATEGORIES

The system MUST implement tests across the following categories (phased by delivery stage):

#### CORE (MVP REQUIRED)
- Unit Tests
- Integration Tests
- Contract Tests
- End-to-End Tests (critical flows only)

#### EXTENDED (POST-MVP REQUIRED)
- Security Tests
- Performance Tests
- Regression Tests

#### ADVANCED (AS APPLICABLE)
- AI/LLM Output Validation Tests
- Compliance/Domain-Specific Tests
- Data Integrity Tests
- UI/UX & Accessibility Tests
- Deployment & Environment Tests

---

### RULE 3: CONTRACT ENFORCEMENT

- All shared interfaces must have contract tests
- Contracts must be defined BEFORE parallel agent execution
- Any contract change must update all dependent tests

---

### RULE 4: COVERAGE THRESHOLDS

- Core business logic: ≥90%
- API layer: ≥85%
- Critical flows: 100% test coverage

---

### RULE 5: REGRESSION SAFETY

- No change may break existing tests
- All previous tests must pass before merging
- Snapshot/versioned tests required for critical outputs

---

### RULE 6: FAILURE HANDLING

- If requirements are unclear → STOP and request clarification
- If tests cannot be defined → DO NOT proceed to implementation

---

### RULE 7: MULTI-AGENT ALIGNMENT

- All agents must build against the same test definitions
- Tests act as the single source of behavioral truth
- No agent may override or bypass tests

---

### RULE 8: PHASED ENFORCEMENT

- MVP: enforce CORE rules only
- Scale phases: progressively enforce EXTENDED and ADVANCED rules

---

### RULE 9: OUTPUT VALIDITY

Any output that:
- skips tests
- weakens coverage
- violates contracts

→ must be rejected and regenerated

---

## End-to-end (Playwright, Shopify embedded app)

- **Package:** `disclo/apps/embedded/shopify`. **Specs:** `e2e/*.spec.ts`. **Config:** `playwright.config.ts`.
- **Not** part of default `pnpm test` (Vitest). Run **`pnpm test:e2e`** from `disclo/` after a server is reachable.
- **Local:** First time on a machine: `pnpm --filter disclo-shopify test:e2e:install-browsers` (downloads Chromium and friends). In one terminal, `pnpm --filter disclo-shopify dev` (or your usual Shopify CLI flow). Set **`PLAYWRIGHT_BASE_URL`** to the URL the CLI prints (tunnel or `http://127.0.0.1:3000` when Vite uses the default port). Then `pnpm test:e2e` from `disclo/`.
- **CI:** Workflow **E2E Playwright** (manual `workflow_dispatch`) asks for **`base_url`**. The app must already be running at that URL.
- **Coverage today:** `/health`, marketing `/`, `/auth/login` (Sprint 1 smoke). Install → embedded admin → scan UI still **manual** or future specs; see `docs/QA_TRACEABILITY.md`.
