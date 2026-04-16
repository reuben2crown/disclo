# QA traceability matrix (shell)

**Purpose:** Map requirements and Linear issues to tests and release evidence. **Linked Linear:** QA epic (REU-44), plan §4.6–4.9.

## How to use

- Add a row per **must-have** acceptance criterion for the active milestone (Phase 1 first).
- **Test level:** `unit` | `integration` | `e2e` | `manual`.
- **Evidence:** PR link, CI run, Playwright report, or signed manual checklist.

## Phase 1 — first three E2E paths (Sprint 0 rows)

These rows replace generic placeholders for the **three primary merchant journeys** Phase 1 must prove end-to-end. Update **Test IDs** and **Last verified** when suites land.

| Requirement / AC (summary) | Linear issue(s) | Test IDs or file paths | Level | Owner | Last verified |
| --- | --- | --- | --- | --- | --- |
| **E2E path 1 — Install:** Merchant installs app, OAuth completes, session persisted in Prisma | AD-01, FE-01 | **Integration / unit:** `shopify.server` + `authenticate.admin` on `app.*` loaders. **E2E:** Playwright **`e2e/auth-login.spec.ts`** (login page only); full OAuth/install spec **pending** (`QA-01`). **Manual:** dev store install checklist. | e2e + unit | DASH / AD | partial |
| **E2E path 2a — Sprint 1B scan loop:** Trigger scan (dashboard), progress polling, scans list | INT-01, FE-03, BE-15, REU-158, REU-101 | **Integration / unit:** `scan-enqueue.server.test.ts`, `scan-progress.server.test.ts`, `scans-list.server.test.ts`, `dashboard-data.server.test.ts`. **E2E:** Playwright still **smoke only** (`health`, `auth/login`, marketing); full embedded scan **manual** or future spec. | integration + manual | QA / AD | CI (server tests); manual dev store |
| **E2E path 2b — Scan to label (Sprint 2):** Item detail, apply label, audit entry | QA-01, AD-03, FE-06, BE-10 | **TBD** until FE-06 ships. | e2e + integration | QA / UI | pending |
| **E2E path 3 — Storefront badge:** Theme extension / metafield reads show disclosure badge on storefront | AD-05, QA-01 | **Unit:** theme extension / Liquid not automated. **E2E:** Playwright storefront **pending** (`QA-01`). | e2e + manual | AD / QA | pending |

**Playwright smoke (always-on routes):** `disclo/apps/embedded/shopify/e2e/health.spec.ts` (`GET /health`), `marketing-landing.spec.ts` (`/`). Runbook: `docs/TESTING.md` § End-to-end.

### Screen 1 (FE-02 dashboard home) — traceability

| Requirement / AC (summary) | Linear issue(s) | Test IDs or file paths | Level | Owner | Last verified |
| --- | --- | --- | --- | --- | --- |
| Dashboard: compliance score, last scan, plan, regulations from target markets, risk breakdown, onboarding, markets `ChoiceList`, quick action full scan, active-scan banner | FE-02, INT-01 (scan) | `disclo/apps/embedded/shopify/app/dashboard-data.server.test.ts`; UI wiring `app/routes/app._index.tsx` | unit + manual | UI / DASH | CI (server tests) |

### Screen 2 (FE-03 scan progress) — traceability

| Requirement / AC (summary) | Linear issue(s) | Test IDs or file paths | Level | Owner | Last verified |
| --- | --- | --- | --- | --- | --- |
| After **Start scan**, detail route shows overall + pipeline progress, polls until complete; back to scans list | FE-03, INT-01, REU-101 | `scan-progress.server.test.ts`; `app/routes/app.scans.$scanId.tsx` | unit + manual | UI / AD | CI (server tests); manual dev store |

## Phase 1 — other must-haves (fill in)


| Requirement / AC (summary)          | Linear issue(s)         | Test IDs or file paths | Level       | Owner | Last verified |
| ----------------------------------- | ----------------------- | ---------------------- | ----------- | ----- | ------------- |
| Webhook HMAC rejects invalid        | SEC-03, AD-04           | `disclo/packages/core/src/webhooks/shopify-webhook-hmac.test.ts` | unit        | SEC / AD | CI |
| Token encryption                    | SEC-04, INFRA-06        | `disclo/packages/core/src/utils/crypto.test.ts` | unit        | SEC | CI |
| Plan enforcement on premium actions | BE-04, scan enqueue     | `disclo/apps/embedded/shopify/app/scan-enqueue.server.test.ts` (`requireFeature`, plan row null → 400) | integration | BE | CI |
| GDPR / uninstall cascade            | COMP-02                 | *TBD*                  | integration |       |               |


## Release gate checklist (copy per release)

- All rows for in-scope issues have evidence or explicit waiver
- No committed `test.skip` / `it.skip`
- `pnpm typecheck`, `lint`, `test` green on release SHA
