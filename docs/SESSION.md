# Disclo - Session Handoff

Last updated: 2026-04-17 — **Sprint 2 (started):** **FE-05** item detail route `/app/scans/:scanId/items/:itemId` (`scan-item-detail.server.ts`, product preview via adapter when `ENCRYPTION_KEY` set); **FE-06** Apply AI disclosure label (`apply-label.server.ts`, `fixDashboard` plan gate, audit `labelled`, item status `labelled`, `refreshCompletedScanAggregates` in `@disclo/core`). Scan progress page lists products with links to item detail. Merchant `scanItemDetail` strings added to all locales (non-EN copy temporarily English). Next Sprint 2 slice: **BE-11** / **FE-13** PDF, **BE-21** / **FE-10** billing, **NOTIF-***.
Active phase: Phase 1 — Sprint 1B closed in repo; Sprint 2 in progress (FE-05/06 landed; BE-11+, BE-21, notifications remain).

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
- **Epics (parent issues):** INFRA REU-28, BE REU-29, AD REU-30, UI REU-31, BILL REU-32, NOTIF REU-33, AUDIT REU-34, PRO REU-35, EVID REU-36, API REU-37, WP REU-38, SITE REU-39, OBS REU-40, DASH REU-41, AUTH REU-42, REV REU-43, QA REU-44, SEC-COMP REU-45. **Sprint 1B (Linear Done 2026-04-15):** **REU-158** (INT-01), **REU-101** (FE-03), **REU-78** (BE-19), plus **REU-88** (AD-04), **REU-86–91** (AD-01/02/03/05), **REU-99–102** (FE-01/02/03/04), **REU-47–54** (INFRA-02–08, 10), **REU-153** (SEC-06) — synced from plan YAML `status: completed` via Linear MCP.
- **Re-sync:** Export project issues (Linear MCP `list_issues` or UI CSV), then dry run: `node disclo/scripts/linear-sync-completed.mjs path/to/issues.json` (expects `{ \"issues\": [...] }`); issues to set **Done** are printed. Parent epics (**REU-28**, **REU-29**, **REU-30**, **REU-31**, **REU-45**) stay open until their remaining children ship.
- **Backlog:** All plan IDs from §4.2–4.4 plus WEB-01–09, OBS-01–03, REV-01, SEC-01–07, COMP-01–03 are created as children under the matching epic with milestones. Descriptions include requirements, AC, and test-prerequisite notes per §4.5–4.7.
- **Sprint 0 (started):** Draft `docs/security/threat-model.md`, `docs/security/secrets-runbook.md`, QA shell `docs/QA_TRACEABILITY.md`, ops guide `docs/AGENT_OPERATIONS.md`. **Phase 1 sprint checklist** is `.cursor/plans/disclo_phase1_sprints.plan.md` (see `docs/SPRINT_PLANS.md`). Agents set YAML `todos[].status: completed` and mirror the body line when a row is done (see `docs/AGENT_OPERATIONS.md`). Cursor role triggers: `.cursor/commands/agent-*.md`.
- **Sprint 0 status (2026-04-01):** **Foundations** as before. **`BE-01` / `BE-02`** done. **INFRA:** `w1-infra-02`, `w1-infra-07`, `w1-infra-10` **completed** — Supabase migrate + seed; **`pnpm smoke:bullmq`** OK with **`REDIS_URL`**. **`w1-infra-09` / `11`:** Railway deploy + keep-alive secret + successful cron still open. **Linear:** close INFRA issues in UI when you match this. **Git `origin`:** `github.com/reuben2crown/disclo.git`; use `disclo-apps` if canonical (see **Next steps**).
- **Still in Linear:** Add `[Test]` subtasks on remaining coding issues (pattern established on SEC-01–03); apply phase/component labels when useful.

## Local environment

- **Monorepo env:** `disclo/.env` (gitignored; **not in Git**). Template: `disclo/infra/env.example`. **Backup** before destructive tree wipes (orphan checkout cleanup, `git clean -fdx`, recursive delete of repo files); see `.cursor/rules/session-handoff.mdc`.
- **Shopify app env:** `disclo/apps/embedded/shopify/.env` (gitignored). Template: `.env.example` in that folder.
- Fill **`DATABASE_URL`** (one pooler URL), **`DIRECT_URL`** (session/direct for Prisma migrate), **`REDIS_URL`** for BullMQ, plus other keys per `infra/env.example`.

## Current implementation (code)

- **Prisma:** `schema.prisma` includes **`directUrl`** for migrations when `DATABASE_URL` is pooled. **Migrate + seed verified** on Supabase (2026-04-01). Shopify loads DB via `@disclo/db` (`apps/embedded/shopify/app/db.server.ts`).
- **Core:** `disclo/packages/core` — config (Zod), errors, logger, crypto, `webhooks/shopify-webhook-hmac`, **`regulations/`**, **`plan/`** (BE-03/04), **`audit/`** (BE-10 append + exemption helpers), **`classifiers/`** (`text-classifier`, `image-classifier`, `claims-keywords`, `claims-llm`), **`risk/`** (`risk-score`, `quality-tier`), **`scan/`** (`payloads`, **`enqueue`** `createScanOrchestratorQueue` / `enqueueScanOrchestratorJob`, **`finalize`** + **`refreshCompletedScanAggregates`**, `auto-scan-eligibility`), **`reportGeneratorJobSchema`** on `report` queue, **`plan/green-claims-llm.ts`**, **`i18n/`** (`merchant`, `plan`, `notifications`, **`internalHttp`** for worker-only JSON errors). **Shared Redis:** BullMQ **`prefix: disclo_`**. **`@disclo/db`** in core for plan + `finalizeScanIfComplete` typing (no adapter imports). Server-returned merchant strings follow `.cursor/rules/writing.mdc`; see plan **Agent ownership** subsection.
- **Adapters:** `@disclo/adapters` — **`createShopifyAdapter({ prisma, encryptionKey })`** (paginated `fetchContent`, **`fetchProductByNumericId`**, `metafieldsSet` label write, `revokeAccess`). **`getAdapter("shopify")` throws**; use the factory. Default API version **`2026-01`** (`SHOPIFY_DEFAULT_API_VERSION`).
- **Shopify embedded app:** `after-auth.server.ts` … **`features/scans/scan-enqueue.server.ts`** returns **400** if **`getFeatures`** is null (no plan row). On **403** (`PlanError`), **404** (shop missing), and that **400**, JSON includes **`actionUrl`** (`shopifyAdminAppsSettingsUrl`) + **`actionLabel`** (`hints.openAppsToManagePlan`) so the dashboard can show a one-tap **Open Apps and sales channels** button (`app._index` scan error banner). **i18n:** `locales/i18n.server.ts` **`localeFromRequest`** reads **`disclo_locale`** then **`Accept-Language`**; **`POST /locale`** (no auth) sets cookie and redirects to a **safe same-origin `returnTo`** (`locales/locale-action.server.ts`). **`LanguageSwitcherFooter`** (`app/components/`) on **`app.tsx`** (embedded shell), **`auth.login`**, **`_index`**, and **plain** variant inside **`app.settings`**. **Polaris** on **`auth.login`** stays **`en.json`** until wired to per-locale Polaris packs. **Dashboard** (`app._index`): onboarding list, applicable regulation cards, risk breakdown (`ProgressBar` by tier), **target markets** `ChoiceList` (POST `updateMarkets` via **`features/dashboard/target-markets-form.server.ts`**), active-scan banner → **`/app/scans/:id`**. **FE-03:** **`app.scans.$scanId`** loader + **`useRevalidator`** every 2.5s; overall + three pipeline bars; **product list** + links to **`/app/scans/:scanId/items/:itemId`**. **FE-05 / FE-06:** **`app.scans.$scanId.items.$itemId`** — item detail, optional Shopify text preview, **Apply AI disclosure label** (`apply-label.server.ts`, `fixDashboard` gate). **FE-04:** **`app.scans._index`** — `IndexTable` of shop scans, **GET** filter `?regulation=`, sort **Started** column (`?dir=asc|desc`), bulk **Export scan IDs (CSV)**. **Auth / marketing:** **`auth.login`** and **`_index`** use core merchant strings with resolved locale. **`POST /app/scan`**, webhooks incremental, **`/internal/monthly-scan`**, theme extension as before. **Vitest:** `features/scans/*.server.test.ts`, `features/dashboard/*.server.test.ts`, webhooks tests.
- **Workers:** **`scan/scan-orchestrator-worker.ts`** … (unchanged). **`maintenance/register-auto-scan-schedule.ts`** registers monthly repeatable job on **`auto-scan`**. **`maintenance/auto-scan-worker.ts`** POSTs to **`${SHOPIFY_APP_URL}/internal/monthly-scan`** with **`INTERNAL_API_SECRET`** (no `@disclo/adapters` in workers). **`reports/report-generator-worker.ts`** parses **`reportGeneratorJobSchema`**; on success creates **`notifications`** with titles/bodies from **`getNotificationMessages(defaultLocaleFromEnv())`** (set **`DEFAULT_LOCALE`** for French). **`pnpm start`** → `node dist/main.js`.
- **Linear:** Match issue status to `.cursor/plans/disclo_phase1_sprints.plan.md` YAML. **REU-30** stays open until BE-21 billing and remaining AD/UI scope you track there.
- **CI:** `.github/workflows/ci.yml` sets **`DATABASE_URL` + `DIRECT_URL`** placeholders for `prisma generate`. Triggers: push **`dev`**, PRs to **`dev`** or **`main`**.
- **Git:** **`dev`** = active development (full tree). **`main`** = minimal placeholder until production; merge only **PR from `dev`** (workflow `main-pr-source-dev.yml`). See `docs/GITHUB_BRANCHES.md`, `CLAUDE.md`. After first push: `gh repo edit OWNER/disclo-apps --default-branch dev` and protect `main`.
- **Supabase:** Cursor **Supabase MCP** is available for project checks and docs; do not paste secrets into chat.
- **Keep-alive:** `.github/workflows/supabase-keep-alive.yml` — secret `SUPABASE_DATABASE_URL`, cron `SELECT 1` (workflow must **run successfully** to count toward INFRA-11).
- **Railway:** `disclo/infra/railway.toml` is **documentation** until services deploy and pass health checks (INFRA-09).
- **Local gate (2026-04-01):** `pnpm lint`, `typecheck`, `test`, **`pnpm audit --audit-level critical`**, **`pnpm db:migrate:deploy`**, **`pnpm db:seed`**, **`pnpm smoke:bullmq`** — **passed** with `.env` (DB + Redis).
- **Local gate (2026-03-31):** **`pnpm build`** — **passed** after **`@disclo/core`** **`exports`** subpaths (`./config`, `./i18n`, `./regulations`) and Shopify app imports that avoid the main barrel in client-route modules (prevents `node:crypto` / `createHash` in the browser bundle). Re-run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` from **`disclo/`**.
- **Smoke script:** Root `pnpm smoke:bullmq` runs `tsx src/smoke/bullmq-smoke.ts` in **`@disclo/workers`** so **`tsx`** resolves on Windows.
- **Sprint plan:** `.cursor/plans/disclo_phase1_sprints.plan.md` — see YAML for `w1-infra-*` / `w1-be-*` status; Maintainer policy still governs **live** DB, Redis, Railway, keep-alive.

## Next steps

1. **Dev-store proof:** Run one full **install → Start scan → workers** pass; attach evidence to **REU-158** / **REU-101** / **REU-78** in Linear if you want audit trail (issues already **Done** per plan YAML sync on 2026-04-15).
2. **Sprint 2 (unblocked):** **FE-05** item detail, **FE-06** Apply label, **BE-11** audit PDF, **BE-21** Shopify billing, **NOTIF-*** as prioritized in `.cursor/plans/disclo_phase1_sprints.plan.md`. **BE-20** remainder (report job producer + PDF) stays optional vs FE/BE-21.
3. **Git / Actions:** Point **`origin`** at the canonical repo if needed; push **`dev`**; confirm CI green. **`s0-ci-github-main`:** green **`dev`** push + PRs to **`main`**.
4. **GitHub INFRA-11:** Repo secret **`SUPABASE_DATABASE_URL`**; confirm keep-alive workflow succeeded once.
5. **Railway INFRA-09:** Deploy when you promote **`main`**.

## Known issues

- Shopify peer dependency warning on session storage (non-blocking for build).
- Polaris CSS minify warning during Vite build (cosmetic).
