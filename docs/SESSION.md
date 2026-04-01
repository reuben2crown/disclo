# Disclo - Session Handoff

Last updated: 2026-04-01
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
- **Sprint 0 status (2026-04-01):** **Foundations** (docs, QA rows, webhook HMAC tests, SEC-06 critical audit job, incident doc) remain as before. **Sprint 0 — infrastructure + core:** `BE-01` / `BE-02` done in `@disclo/core` (`types.ts` + `src/regulations/` + `resolve.test.ts`). **INFRA** YAML: `w1-infra-01`, `03–06`, `08` completed; `02`, `07`, `09–11` still need integration proof. **DB scripts:** `pnpm db:migrate:deploy` / `db:seed` load `disclo/.env` via `pnpm exec dotenv` + `@disclo/db` scripts (Windows-safe). **Migrate attempt:** `P1001` against direct `db.*.supabase.co:5432` — switch `DATABASE_URL` to **transaction pooler** (port `6543`) per `infra/env.example` comment. **Redis:** add `REDIS_URL` to `disclo/.env`, then `pnpm smoke:bullmq` for INFRA-07 proof. **Linear (this session):** Done — REU-145, 146, 154, 156, 157, 58 (BE-01), 57 (BE-02), 46 (INFRA-01). In Review — REU-150 (COMP-01), REU-153 (SEC-06). Comments on REU-151, 152 (COMP-02/03 backlog context). **Git:** **`dev`** = full codebase; **`main`** = minimal until production (PR from `dev` only). **Shopify app:** nested `.git` removed for one repo. **Remote:** `disclo-apps`; push both branches, default **`dev`** (see **Next steps**).
- **Still in Linear:** Add `[Test]` subtasks on remaining coding issues (pattern established on SEC-01–03); apply phase/component labels when useful.

## Local environment

- **Monorepo env:** `disclo/.env` (gitignored). Template: `disclo/infra/env.example`.
- **Shopify app env:** `disclo/apps/embedded/shopify/.env` (gitignored). Template: `.env.example` in that folder.
- Fill **real** `DATABASE_URL` (Supabase pooler recommended), `REDIS_URL`, API keys, and Shopify vars before apps, `pnpm db:migrate:deploy`, or `pnpm smoke:bullmq`.

## Current implementation (code)

- **Prisma:** `disclo/packages/db/prisma/schema.prisma` — domain + Shopify `Session`. Shopify loads DB via `@disclo/db` (`apps/embedded/shopify/app/db.server.ts`). **End-to-end DB + migrate + seed on your Supabase URL is not treated as done** until you verify it (see Phase 1 sprints plan INFRA policy).
- **Core:** `disclo/packages/core` — config (Zod), errors, logger (`loggerWithCorrelation`), crypto, `shopify-webhook-hmac`, **`regulations/`** (five configs + `resolveRegulationsForMarkets`), queue helpers. **Shared Redis:** BullMQ **`prefix: disclo_`** via `getBullmqQueueOptions()` on every queue/worker (including API `notification-queue`). **INFRA-07:** run `pnpm smoke:bullmq` with real Redis.
- **CI:** `.github/workflows/ci.yml` runs on **`dev`** (push + PR) from `disclo/` with a **placeholder** `DATABASE_URL` for Prisma generate.
- **Git:** **`dev`** = active development (full tree). **`main`** = minimal placeholder until production; merge only **PR from `dev`** (workflow `main-pr-source-dev.yml`). See `docs/GITHUB_BRANCHES.md`, `CLAUDE.md`. After first push: `gh repo edit OWNER/disclo-apps --default-branch dev` and protect `main`.
- **Supabase:** Cursor **Supabase MCP** is available for project checks and docs; do not paste secrets into chat.
- **Keep-alive:** `.github/workflows/supabase-keep-alive.yml` — secret `SUPABASE_DATABASE_URL`, cron `SELECT 1` (workflow must **run successfully** to count toward INFRA-11).
- **Railway:** `disclo/infra/railway.toml` is **documentation** until services deploy and pass health checks (INFRA-09).
- **Local gate (2026-03-31):** `pnpm typecheck`, `pnpm lint`, `pnpm test` all **passed** from `disclo/` after `pnpm` was installed on the machine.
- **Sprint plan:** `.cursor/plans/disclo_phase1_sprints.plan.md` — see YAML for `w1-infra-*` / `w1-be-*` status; Maintainer policy still governs **live** DB, Redis, Railway, keep-alive.

## Next steps

1. **Push branches:** `git remote set-url origin https://github.com/reuben2crown/disclo-apps.git` (if needed), `git push -u origin main`, `git push -u origin dev`, then `gh repo edit reuben2crown/disclo-apps --default-branch dev`. Confirm CI on **`dev`** (`s0-ci-github-main` equivalent).
2. **Protect `main`:** GitHub branch protection + optional `docs/GITHUB_BRANCHES.md` CLI notes.
3. **Supabase:** pooler `DATABASE_URL`, then `pnpm db:migrate:deploy` / `db:seed` from `disclo/`.
4. **Redis:** `REDIS_URL` set → `pnpm smoke:bullmq` (keys under `disclo_:` prefix).
5. **GitHub:** `SUPABASE_DATABASE_URL` secret for keep-alive (runs from default branch `dev`).
6. **Railway:** deploy per `disclo/infra/railway.toml` (INFRA-09).

## Known issues

- Shopify peer dependency warning on session storage (non-blocking for build).
- Polaris CSS minify warning during Vite build (cosmetic).
