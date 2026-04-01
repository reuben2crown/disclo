# Disclo - Session Handoff

Last updated: 2026-04-01 (Prisma `directUrl`, Supabase migrate+seed, pending `REDIS_URL` smoke)
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
- **Sprint 0 status (2026-04-01):** **Foundations** as before. **`BE-01` / `BE-02`** done. **INFRA:** `w1-infra-02` + `w1-infra-10` **completed** — `pnpm db:migrate:deploy` + `pnpm db:seed` against Supabase after **`schema.prisma` `directUrl = env("DIRECT_URL")`** (migrations use session pooler `:5432`; app uses **single** `DATABASE_URL` pooler `6543`; remove duplicate `DATABASE_URL` lines in `.env`). **`w1-infra-07` pending:** only `REDIS_REST_*` in `.env` is not enough; add Upstash **`REDIS_URL`** (`rediss://…`) then `pnpm smoke:bullmq`. **`w1-infra-09` / `11`:** Railway deploy + keep-alive secret + successful cron still open. **Linear:** unchanged from prior snapshot unless you close INFRA issues in UI. **Git `origin`:** still `github.com/reuben2crown/disclo.git` in this clone; point at `disclo-apps` if that is the canonical repo (see **Next steps**).
- **Still in Linear:** Add `[Test]` subtasks on remaining coding issues (pattern established on SEC-01–03); apply phase/component labels when useful.

## Local environment

- **Monorepo env:** `disclo/.env` (gitignored; **not in Git**). Template: `disclo/infra/env.example`. **Backup** before destructive tree wipes (orphan checkout cleanup, `git clean -fdx`, recursive delete of repo files); see `.cursor/rules/session-handoff.mdc`.
- **Shopify app env:** `disclo/apps/embedded/shopify/.env` (gitignored). Template: `.env.example` in that folder.
- Fill **`DATABASE_URL`** (one pooler URL), **`DIRECT_URL`** (session/direct for Prisma migrate), **`REDIS_URL`** for BullMQ, plus other keys per `infra/env.example`.

## Current implementation (code)

- **Prisma:** `schema.prisma` includes **`directUrl`** for migrations when `DATABASE_URL` is pooled. **Migrate + seed verified** on Supabase (2026-04-01). Shopify loads DB via `@disclo/db` (`apps/embedded/shopify/app/db.server.ts`).
- **Core:** `disclo/packages/core` — config (Zod), errors, logger (`loggerWithCorrelation`), crypto, `shopify-webhook-hmac`, **`regulations/`** (five configs + `resolveRegulationsForMarkets`), queue helpers. **Shared Redis:** BullMQ **`prefix: disclo_`** via `getBullmqQueueOptions()` on every queue/worker (including API `notification-queue`). **INFRA-07:** run `pnpm smoke:bullmq` with real Redis.
- **CI:** `.github/workflows/ci.yml` sets **`DATABASE_URL` + `DIRECT_URL`** placeholders for `prisma generate`. Triggers: push **`dev`**, PRs to **`dev`** or **`main`**.
- **Git:** **`dev`** = active development (full tree). **`main`** = minimal placeholder until production; merge only **PR from `dev`** (workflow `main-pr-source-dev.yml`). See `docs/GITHUB_BRANCHES.md`, `CLAUDE.md`. After first push: `gh repo edit OWNER/disclo-apps --default-branch dev` and protect `main`.
- **Supabase:** Cursor **Supabase MCP** is available for project checks and docs; do not paste secrets into chat.
- **Keep-alive:** `.github/workflows/supabase-keep-alive.yml` — secret `SUPABASE_DATABASE_URL`, cron `SELECT 1` (workflow must **run successfully** to count toward INFRA-11).
- **Railway:** `disclo/infra/railway.toml` is **documentation** until services deploy and pass health checks (INFRA-09).
- **Local gate (2026-04-01):** `pnpm lint`, `typecheck`, `test`, **`pnpm audit --audit-level critical`** (no critical vulns; moderate/high still reported), **`pnpm db:migrate:deploy`**, **`pnpm db:seed`** — **passed** with restored `.env`. **`pnpm smoke:bullmq`** blocked until **`REDIS_URL`** is set (REST-only vars do not run BullMQ).
- **Smoke script:** Root `pnpm smoke:bullmq` calls `@disclo/workers` script `smoke:bullmq` so **`tsx`** resolves on Windows.
- **Sprint plan:** `.cursor/plans/disclo_phase1_sprints.plan.md` — see YAML for `w1-infra-*` / `w1-be-*` status; Maintainer policy still governs **live** DB, Redis, Railway, keep-alive.

## Next steps

1. **Git / Actions:** Point **`origin`** at the canonical repo if needed; push **`main`** (README-only) + **`dev`**; `gh repo edit … --default-branch dev`; protect **`main`**. Confirm CI green on **`dev`**.
2. **Redis / INFRA-07:** Set Upstash **`REDIS_URL`** (`rediss://…`), then **`pnpm smoke:bullmq`**.
3. **GitHub INFRA-11:** Repo secret **`SUPABASE_DATABASE_URL`**; confirm keep-alive workflow succeeded once.
4. **Railway INFRA-09:** Deploy when you promote **`main`**.

## Known issues

- Shopify peer dependency warning on session storage (non-blocking for build).
- Polaris CSS minify warning during Vite build (cosmetic).
