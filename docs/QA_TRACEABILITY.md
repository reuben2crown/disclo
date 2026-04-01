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
| **E2E path 1 — Install:** Merchant installs app, OAuth completes, session persisted in Prisma | AD-01, FE-01 | Planned: `disclo/apps/embedded/shopify` Playwright (not yet added); manual dev store checklist | e2e | | pending |
| **E2E path 2 — Scan to label:** Trigger scan, view results, apply label, audit entry written | QA-01, BE-15, AD-03, FE-06 | Planned: Playwright against staging + worker mocks policy in `docs/TESTING.md` | e2e | | pending |
| **E2E path 3 — Storefront badge:** Theme extension / metafield reads show disclosure badge on storefront | AD-05, QA-01 | Planned: Theme check + storefront assertion in Playwright or manual screenshot evidence | e2e | | pending |

## Phase 1 — other must-haves (fill in)


| Requirement / AC (summary)          | Linear issue(s)         | Test IDs or file paths | Level       | Owner | Last verified |
| ----------------------------------- | ----------------------- | ---------------------- | ----------- | ----- | ------------- |
| Webhook HMAC rejects invalid        | SEC-03, AD-04           | `packages/core/src/shopify-webhook-hmac.test.ts` | unit        |       | CI |
| Token encryption                    | SEC-04, INFRA-06        | `packages/core/src/crypto.test.ts` | unit        |       | CI |
| Plan enforcement on premium actions | BE-04, routes           | *TBD*                  | integration |       |               |
| GDPR / uninstall cascade            | COMP-02                 | *TBD*                  | integration |       |               |


## Release gate checklist (copy per release)

- All rows for in-scope issues have evidence or explicit waiver
- No committed `test.skip` / `it.skip`
- `pnpm typecheck`, `lint`, `test` green on release SHA
