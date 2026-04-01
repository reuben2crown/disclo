# Disclo - Session Handoff

Last updated: 2026-03-31
Active phase: Phase 1 execution

## Security docs (quick links)

- Threat model: `docs/security/threat-model.md`
- Secrets runbook: `docs/security/secrets-runbook.md`
- Incident response: `docs/security/incident-response.md`

## Authoritative execution plan

- **Cursor Plans UI:** [`.cursor/plans/disclo_authoritative_execution.plan.md`](../.cursor/plans/disclo_authoritative_execution.plan.md) (`*.plan.md` under the workspace so it opens as a Plan, not a generic Markdown tab).
- Copy outside repo (same content): `c:\Users\samue\.cursor\plans\disclo_authoritative_execution_plan.md`

## Linear (Disclo program)

- **Team:** Reuben2Crown (REU). **Project:** Disclo.
- **Milestones:** Phase 1 — Feature-complete Shopify; Phase 2 — Multi-platform + API + website; Phase 3 — Central app + user management; Phase 4+ — Expansion & revenue.
- **Epics (parent issues):** INFRA REU-28, BE REU-29, AD REU-30, UI REU-31, BILL REU-32, NOTIF REU-33, AUDIT REU-34, PRO REU-35, EVID REU-36, API REU-37, WP REU-38, SITE REU-39, OBS REU-40, DASH REU-41, AUTH REU-42, REV REU-43, QA REU-44, SEC-COMP REU-45.
- **Backlog:** All plan IDs from §4.2–4.4 plus WEB-01–09, OBS-01–03, REV-01, SEC-01–07, COMP-01–03 are created as children under the matching epic with milestones. Descriptions include requirements, AC, and test-prerequisite notes per §4.5–4.7.
- **Sprint 0 (started):** Draft `docs/security/threat-model.md`, `docs/security/secrets-runbook.md`, QA shell `docs/QA_TRACEABILITY.md`, ops guide `docs/AGENT_OPERATIONS.md`. **Phase 1 sprint checklist** is `.cursor/plans/disclo_phase1_sprints.plan.md` (see `docs/SPRINT_PLANS.md`). Agents set YAML `todos[].status: completed` and mirror the body line when a row is done (see `docs/AGENT_OPERATIONS.md`). Cursor role triggers: `.cursor/commands/agent-*.md`.
- **Sprint 0 status (2026-03-31):** In-repo: ingress audit in threat model, `secrets-runbook.md` parity with `infra/env.example`, QA first-three-E2E rows, `shopify-webhook-hmac` contract tests in `@disclo/core`, SEC-06 `dependency-audit` CI job (critical gate), `docs/security/incident-response.md`. **Still open:** confirm CI green on **`main`** (`s0-ci-github-main`); Linear SEC-01–COMP-03 per AC (`s0-linear-sec-comp`). **INFRA-01–11** remain integration-gated. Details: Phase 1 sprints plan.
- **Still in Linear:** Add `[Test]` subtasks on remaining coding issues (pattern established on SEC-01–03); apply phase/component labels when useful.

## Local environment

- **Monorepo env:** `disclo/.env` (gitignored). Template: `disclo/infra/env.example`.
- **Shopify app env:** `disclo/apps/embedded/shopify/.env` (gitignored). Template: `.env.example` in that folder.
- Fill **real** `DATABASE_URL` (Supabase), Redis, API keys, and Shopify vars before running apps or `prisma migrate deploy`.

## Current implementation (code)

- **Prisma:** `disclo/packages/db/prisma/schema.prisma` — domain + Shopify `Session`. Shopify loads DB via `@disclo/db` (`apps/embedded/shopify/app/db.server.ts`). **End-to-end DB + migrate + seed on your Supabase URL is not treated as done** until you verify it (see Phase 1 sprints plan INFRA policy).
- **Core:** `disclo/packages/core` — config (Zod), errors, logger, crypto (+ tests); queue **names** in code. **BullMQ/Redis integration** is not treated as INFRA-complete until workers are proven against a real Redis.
- **CI:** `.github/workflows/ci.yml` runs from `disclo/` with a **placeholder** `DATABASE_URL` only so Prisma can parse the schema (not your real DB).
- **Keep-alive:** `.github/workflows/supabase-keep-alive.yml` — secret `SUPABASE_DATABASE_URL`, cron `SELECT 1` (workflow must **run successfully** to count toward INFRA-11).
- **Railway:** `disclo/infra/railway.toml` is **documentation** until services deploy and pass health checks (INFRA-09).
- **Local gate (2026-03-31):** `pnpm typecheck`, `pnpm lint`, `pnpm test` all **passed** from `disclo/` after `pnpm` was installed on the machine.
- **Sprint plan (2026-03-31):** **All INFRA-01–11** and **BE-01** reset to **pending** in `.cursor/plans/disclo_phase1_sprints.plan.md` until integration matches the plan’s INFRA done criteria (not scaffold-only). See plan **Repo validation log** and **Maintainer policy**.

## Next steps

1. Read `docs/AGENT_OPERATIONS.md` for role triggers (`/agent-*` in Cursor).
2. Execute Sprint 0 security path: finish SEC-03/04 test harness in code; expand threat model when new routes ship.
3. Set real values in `disclo/.env` and Shopify `.env`.
4. From `disclo/`: `pnpm --filter @disclo/db exec prisma migrate deploy` then `pnpm db:seed` if desired.
5. First implementation sprint order per plan: security/authenticity → scan + regulation core → remediation/evidence → billing + notifications → hardening.

## Known issues

- Shopify peer dependency warning on session storage (non-blocking for build).
- Polaris CSS minify warning during Vite build (cosmetic).
