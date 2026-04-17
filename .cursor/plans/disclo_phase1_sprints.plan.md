---
name: Disclo Phase 1 Sprints
overview: Phase 1 sprint checklist. Task wording matches disclo_authoritative_execution.plan.md sec 4.2, Phase 5, sec 4.7. Do not mark INFRA-* completed for repo scaffolding alone; see Maintainer policy (INFRA done criteria). YAML `todos` are ordered by dependency (core classifiers before workers, audit append before PDF export, adapter before INT-01 scan enqueue). Sprint 1 is split in the body into 1A (engine + adapter + shell) and 1B (integration closure); Sprint 2+ must not be required to call Sprint 1 “closed” for the dev-store scan loop — see “Practical sprint boundaries”. SEC-06 / `s0-ci-sec06` is npm/supply-chain and secret scanning in CI; that is separate from cross-sprint task dependencies. One YAML block; todos nested with two-space indents.
todos:
  - id: s0-artifact-threat-model
    content: "Sprint 0 (sec 4.7): Threat model draft at docs/security/threat-model.md"
    status: completed
  - id: s0-artifact-secrets-runbook
    content: "Sprint 0 (sec 4.7): Secrets inventory / runbook at docs/security/secrets-runbook.md"
    status: completed
  - id: s0-artifact-qa-traceability
    content: "Sprint 0 (sec 4.7): QA traceability matrix shell at docs/QA_TRACEABILITY.md"
    status: completed
  - id: s0-local-ci-pnpm
    content: "Sprint 0 (sec 4.7): CI green — pnpm typecheck, lint, test from disclo/ (GitHub: push to dev + PR to main)"
    status: completed
  - id: s0-threat-ingress-audit
    content: "Sprint 0: Threat model ingress map audited vs current Shopify + webhook routes (/agent-sec-comp)"
    status: completed
  - id: s0-secrets-env-parity
    content: "Sprint 0: Secrets runbook covers every disclo/infra/env.example entry (/agent-sec-comp)"
    status: completed
  - id: s0-qa-matrix-rows
    content: "Sprint 0: QA_TRACEABILITY.md non-placeholder rows for first three Phase 1 E2E paths (/agent-qa)"
    status: completed
  - id: s0-ci-github-main
    content: "Sprint 0: CI green in GitHub Actions — push to dev + PRs to main (/agent-infra)"
    status: pending
  - id: s0-webhook-contract-tests
    content: "Sprint 0: Webhook test harness / contract tests (e.g. Linear REU-157) (/agent-backend + /agent-sec-comp)"
    status: completed
  - id: s0-ci-sec06
    content: "Sprint 0: CI dependency audit and/or secret scanning + policy (SEC-06) (/agent-infra)"
    status: completed
  - id: s0-incident-response-doc
    content: "Sprint 0: docs/security/incident-response.md + link from SESSION (SEC-07) (/agent-sec-comp)"
    status: completed
  - id: s0-linear-sec-comp
    content: "Sprint 0: Linear SEC-01 through COMP-03 advanced toward Done per AC (/agent-sec-comp)"
    status: pending
  - id: w1-infra-01
    content: "INFRA-01: Monorepo scaffold — pnpm workspaces, Turborepo pipelines, shared tsconfig, ESLint, Prettier, Vitest workspace"
    status: completed
  - id: w1-infra-02
    content: "INFRA-02: Complete Prisma schema (ALL 17 tables) + initial migration + seed (5 plans, 6 cert registries)"
    status: completed
  - id: w1-infra-03
    content: "INFRA-03: Core config — config.ts with Zod validation for all env vars (GPTZero, Hive, Claude, Shopify, Resend, R2, Redis, DB)"
    status: completed
  - id: w1-infra-04
    content: "INFRA-04: Shared error classes — errors.ts (ClassifierError, AdapterError, PlanError, ValidationError, BillingError, EvidenceError)"
    status: completed
  - id: w1-infra-05
    content: "INFRA-05: Structured logger — logger.ts with Pino, JSON output, correlation IDs"
    status: completed
  - id: w1-infra-06
    content: "INFRA-06: Crypto utilities — crypto.ts AES-256-GCM encrypt/decrypt"
    status: completed
  - id: w1-infra-07
    content: "INFRA-07: BullMQ queue setup — connection, queue definitions (scan, text-classify, image-classify, claims-check, report, evidence-verify, auto-scan), worker base"
    status: completed
  - id: w1-infra-08
    content: "INFRA-08: GitHub Actions CI — lint, typecheck, test, build on push to dev + PR to main"
    status: completed
  - id: w1-infra-09
    content: "INFRA-09: Railway deployment config"
    status: pending
  - id: w1-infra-10
    content: "INFRA-10: Supabase project creation, DATABASE_URL wiring (pooler vs direct per Supabase + Prisma docs), Prisma migrate from local/CI"
    status: completed
  - id: w1-infra-11
    content: "INFRA-11: GitHub Actions keep-alive workflow (supabase-keep-alive.yml) — twice-weekly SELECT 1, secrets wired, failure visibility, runbook to disable on Supabase Pro upgrade"
    status: pending
  - id: w1-be-01
    content: "BE-01: Core types — ScanRequest, LabelInstruction, PlatformAdapter, RegulationConfig, EvidenceType, QualityTier"
    status: completed
  - id: w1-be-02
    content: "BE-02: Regulation registry — packages/core/src/regulations/ — all 5 regulation configs, applicability resolver based on target_markets"
    status: completed
  - id: w23-be-03
    content: "BE-03: Plan resolver — getFeatures(shopId) with Redis cache (5-min TTL), Postgres fallback, plan_override merge"
    status: completed
  - id: w23-be-04
    content: "BE-04: Plan enforcement — requireFeature(shopId, feature) and requireWithinLimit(shopId, feature, currentUsage)"
    status: completed
  - id: w23-be-05
    content: "BE-05: GPTZero text classifier — API integration, retry on 429, min 50-word threshold, risk level mapping, batch endpoint support"
    status: completed
  - id: w23-be-06
    content: "BE-06: Hive image classifier — CDN URL input, AI probability output, retry with 1h backoff, never mark clean on failure, incremental scan support"
    status: completed
  - id: w23-be-07
    content: "BE-07: Green claims keyword checker — keyword rules engine (4 categories from Section 7.3), flagged_claims array output"
    status: completed
  - id: w23-be-08
    content: "BE-08: Green claims LLM substantiation — Claude integration, structured prompt, SUBSTANTIATED vs BARE_ASSERTION per claim, Pro+ plan gate"
    status: completed
  - id: w23-be-09
    content: "BE-09: Risk scorer — weighted penalty calculation, 0-100 score, multi-regulation awareness"
    status: completed
  - id: w23-be-10
    content: "BE-10: Audit log service — write-only append, editorial exemption logic (hash comparison), content hash validation, multi-regulation citation"
    status: completed
  - id: w23-be-15
    content: "BE-15: Scan orchestrator worker — BullMQ job dispatch, adapter content fetching, fan-out to 3 classifier queues, result aggregation, risk score calculation, scan status updates"
    status: completed
  - id: w23-be-16
    content: "BE-16: Text classifier worker — BullMQ consumer, processes text jobs, writes ScanItem"
    status: completed
  - id: w23-be-17
    content: "BE-17: Image classifier worker — BullMQ consumer, processes image jobs, incremental cost control"
    status: completed
  - id: w23-be-18
    content: "BE-18: Claims checker worker — BullMQ consumer, keyword pass + optional LLM pass"
    status: completed
  - id: w23-be-19
    content: "BE-19: Auto-scan worker — BullMQ repeat jobs, monthly incremental scan for shops with monthly_auto_scan enabled"
    status: completed
  - id: w23-be-20
    content: "BE-20: Report generator worker — monthly compliance report generation"
    status: pending
  - id: w23-be-11
    content: "BE-11: Audit log PDF export — formatted PDF, SHA-256 integrity hash, export declaration, regulation citations per entry"
    status: pending
  - id: w23-be-12
    content: "BE-12: Rewrite engine — Claude integration, tone selection, spec preservation, change list, editorial note, audit log entry on apply"
    status: pending
  - id: w23-be-13
    content: "BE-13: Evidence system — CRUD for evidence_items, claim_evidence linking, evidence suggestion engine, R2 document upload, SHA-256 hash"
    status: pending
  - id: w23-be-14
    content: "BE-14: Evidence verifier worker — daily cron, certification registry lookup (API/URL), status update, re-open linked scan_items on expiry, notification"
    status: pending
  - id: w23-be-23
    content: "BE-23: R2 integration — presigned URL generation, upload handler, SHA-256 hash computation"
    status: pending
  - id: w23-be-21
    content: "BE-21: Shopify Billing — appSubscriptionCreate, confirmation, APP_SUBSCRIPTIONS_UPDATE webhook, plan_id sync, all 4 tiers"
    status: pending
  - id: w23-be-22
    content: "BE-22: Email notifications — Resend integration: scan complete, high-risk alert, evidence expiry, monthly report"
    status: pending
  - id: w23-ad-01
    content: "AD-01: Shopify OAuth flow — install, callback, token encryption, user + auth_identity + shop record creation"
    status: completed
  - id: w23-ad-02
    content: "AD-02: Shopify content fetcher — GraphQL Admin API, paginated product fetch (50/request), HTML stripping, ScanRequest construction"
    status: completed
  - id: w23-ad-03
    content: "AD-03: Shopify label writer — metafieldsSet mutation for eu_ai_compliance.ai_content_disclosure, machine-readable meta tag, multi-regulation citation in label text"
    status: completed
  - id: w23-ad-04
    content: "AD-04: Shopify webhook handler — PRODUCTS_CREATE, PRODUCTS_UPDATE, APP_UNINSTALLED, APP_SUBSCRIPTIONS_UPDATE"
    status: completed
  - id: w23-ad-05
    content: "AD-05: Shopify Theme App Extension — App Block (Liquid) rendering disclosure badge + green verification badge, reads metafields, customizable text/position"
    status: completed
  - id: w23-int-scan-01
    content: "INT-01: End-to-end scan enqueue — Remix authenticated action or API route creates `scans` row, loads `ScanRequest[]` via `PlatformAdapter.fetchContent` for the shop (respecting plan `maxItemsPerScan` and `requireWithinLimit` where applicable), enqueues BullMQ `scan` job with `scanOrchestratorJobSchema` payload (`scanId`, `shopId`, `requests`); `PRODUCTS_CREATE` and `PRODUCTS_UPDATE` webhooks enqueue incremental scan for affected product(s) when `shop_settings.autoScanOnUpdate` is true and plan gates for detection apply"
    status: completed
  - id: w23-notif-01
    content: "NOTIF-01: Notification dispatcher worker — workers/notification-dispatcher.ts, consumes from notification-queue, resolves template, renders email via Resend, writes to notifications table"
    status: pending
  - id: w23-notif-02
    content: "NOTIF-02: In-app surfacing — lightweight polling/toast patterns in embedded app (no WebSocket needed at MVP)"
    status: pending
  - id: w23-notif-03
    content: "NOTIF-03: Email templates — TypeScript template literals in packages/core/src/notifications/templates/"
    status: pending
  - id: w23-notif-04
    content: "NOTIF-04: Support alert routing — POST to internal Slack webhook or Linear issue creation on high-risk scan (configurable via SUPPORT_ALERT_WEBHOOK_URL)"
    status: pending
  - id: w23-notif-matrix
    content: "Notifications: All scenarios from Section 7 table — full trigger/channel/plan-gate matrix (see execution plan sec 4.2 and Section 7)"
    status: pending
  - id: w35-fe-01
    content: "FE-01: Embedded app shell — Remix + App Bridge + Polaris provider, session token validation, navigation structure"
    status: completed
  - id: w35-fe-02
    content: "FE-02: Dashboard home (S1) — compliance score, regulation summary cards, last scan, risk breakdown, quick actions, onboarding, target market selector"
    status: completed
  - id: w35-fe-03
    content: "FE-03: Scan trigger + progress (S2) — Start Scan button, progress polling with sub-indicators (text/image/claims), completion"
    status: completed
  - id: w35-fe-04
    content: "FE-04: Scan results list (S3) — filterable/sortable IndexTable, regulation filter, bulk actions"
    status: completed
  - id: w35-fe-05
    content: "FE-05: Item detail (S4) — AI probability, risk level, regulations list, sentence breakdown, all action buttons, green claims section, audit history"
    status: completed
  - id: w35-fe-06
    content: "FE-06: Apply Label flow — one-click, multi-regulation citation, audit entry, status update, score recalculation"
    status: completed
  - id: w35-fe-07
    content: "FE-07: Mark as Human-Reviewed flow — reviewer name form, validation, audit entry, exemption"
    status: pending
  - id: w35-fe-08
    content: "FE-08: Request Rewrite flow (S10) — side-by-side diff, tone selector, apply/edit, audit entry"
    status: pending
  - id: w35-fe-09
    content: "FE-09: Free tier summary (S5) — locked preview, upgrade CTA"
    status: pending
  - id: w35-fe-10
    content: "FE-10: Billing page (S6) — plan comparison, Shopify Billing, all 4 tiers"
    status: pending
  - id: w35-fe-11
    content: "FE-11: Green claims dashboard (S11) — claims grouped by type, status, regulation, evidence attachment, rewrite"
    status: pending
  - id: w35-fe-12
    content: "FE-12: Evidence library (S9) — list, add form (6 types), detail, suggestion engine, R2 upload"
    status: pending
  - id: w35-fe-13
    content: "FE-13: Audit log viewer (S8) — chronological list, filters (including regulation), PDF export button"
    status: pending
  - id: w35-fe-14
    content: "FE-14: Settings page (S7) — target markets, badge text, green badge tooltip, scan preferences"
    status: pending
  - id: w56-qa-01
    content: "QA-01: E2E test suite — install -> scan -> view results -> apply label -> verify badge on storefront"
    status: pending
  - id: w56-qa-02
    content: "QA-02: Classifier accuracy testing — test against corpus of known AI/human product descriptions"
    status: pending
  - id: w56-qa-03
    content: "QA-03: Rewrite engine testing — verify spec preservation, no hallucination"
    status: pending
  - id: w56-qa-04
    content: "QA-04: Multi-regulation testing — verify correct regulations applied per target market"
    status: pending
  - id: w56-qa-05
    content: "QA-05: Billing flow testing — all 4 plan tiers, upgrade, downgrade"
    status: pending
  - id: w56-qa-06
    content: "QA-06: Evidence flow testing — upload, link, verify, expiry"
    status: pending
  - id: w56-qa-07
    content: "QA-07: Shopify App Store submission preparation — review checklist, dev store testing, screenshots"
    status: pending
  - id: w56-qa-08
    content: "QA-08: Security review — token encryption, webhook signatures, R2 access, data minimization"
    status: pending
  - id: p1-ac-devstore
    content: "Phase 1 AC: App installs cleanly on Shopify dev store; scan completes for a 100-product store in < 10 minutes (text + images + claims)"
    status: pending
  - id: p1-ac-risk-ui
    content: "Phase 1 AC: Risk scores display correctly with regulation breakdown"
    status: pending
  - id: p1-ac-label-badge
    content: "Phase 1 AC: Apply Label writes metafield; badge renders on storefront citing correct regulation(s)"
    status: pending
  - id: p1-ac-human-reviewed
    content: "Phase 1 AC: Mark as Human-Reviewed creates audit entry, exempts item, re-opens on content change"
    status: pending
  - id: p1-ac-green-rewrite
    content: "Phase 1 AC: Green claims flagged with correct regulation (FTC/EU Green Claims); evidence attachable; rewrite preserves product specs"
    status: pending
  - id: p1-ac-pdf
    content: "Phase 1 AC: PDF export includes all entries with regulation citations and integrity hash"
    status: pending
  - id: p1-ac-free-tier
    content: "Phase 1 AC: Free tier stops at 50 items, shows upgrade CTA"
    status: pending
  - id: p1-ac-billing-tiers
    content: "Phase 1 AC: All 4 plan tiers purchasable via Shopify Billing"
    status: pending
  - id: p1-ac-uninstall
    content: "Phase 1 AC: APP_UNINSTALLED cascade-deletes all shop data within 48h"
    status: pending
  - id: p1-ac-markets
    content: "Phase 1 AC: Target market selector correctly determines applicable regulations"
    status: pending
  - id: dod-core-coverage
    content: "DoD: Unit tests >= 90% coverage on core logic"
    status: pending
  - id: dod-shopify-int
    content: "DoD: Integration tests for Shopify adapter"
    status: completed
  - id: dod-adapter-contract
    content: "DoD: Contract tests for PlatformAdapter interface"
    status: pending
  - id: dod-e2e-three
    content: "DoD: E2E install->scan->label->badge; green claim->evidence->substantiated; rewrite->review->apply->audit"
    status: pending
  - id: dod-corpus
    content: "DoD: Classifier accuracy tested against known corpus"
    status: pending
  - id: dod-lint-ts
    content: "DoD: No TypeScript errors, no ESLint warnings"
    status: pending
  - id: dod-railway
    content: "DoD: Deployed to Railway staging"
    status: pending
  - id: dod-app-store-ready
    content: "DoD: Shopify App Store submission-ready"
    status: pending
  - id: w67-submit
    content: "Weeks 6-7: Shopify App Store submission + review buffer — submission sent; review feedback triaged"
    status: pending
  - id: w67-session
    content: "Weeks 6-7: SESSION handoff — docs/SESSION.md updated at each meaningful handoff (session-handoff rule)"
    status: pending
isProject: false
---

# Disclo — Phase 1 sprint checklist

**Scope source:** [disclo_authoritative_execution.plan.md](disclo_authoritative_execution.plan.md). **Assignments:** Linear project **Disclo** (team REU).

**Plan todos:** Open this file as a **Plan** so the **To-dos** panel lists every YAML item. Each todo `id` matches the suffix on the body line (`(id)`). Markdown task lists in the body alone do not drive that panel; the frontmatter list does. **If the panel is empty or tasks appear as text above the title,** see `overview` in frontmatter (usually a duplicate empty stub or broken YAML indentation).

## Maintainer policy (required)

- **Valid YAML `status` values:** only `pending` and `completed`. Cursor Plan checkboxes read from these; do not write other values into frontmatter.
- **INFRA done criteria (strict):** Mark each `w1-infra-*` todo **completed** only when the **integration** matches the execution plan, not when files exist on disk. Minimum bar: **INFRA-02/10** — `prisma migrate deploy` (or equivalent) against the **intended** Supabase/Postgres URL and seed if required; **INFRA-07** — Redis/BullMQ reachable and a worker can consume a test job (or documented smoke with evidence); **INFRA-09** — Railway (or chosen host) **deploy succeeds** and health checks pass when you cut a release (no separate staging host; validate locally first); **INFRA-08** — CI green on **push to `dev`** and on **PRs targeting `main`** (release path from `dev`); **INFRA-11** — keep-alive workflow **succeeded** at least once with `SUPABASE_DATABASE_URL` set (scheduled runs use the **default branch**; that branch must contain `supabase-keep-alive.yml`). **INFRA-01/03/04/05/06** follow the same rule: complete only when you would sign the Linear issue off (wired, not stub-only).
- When work is **done** (Linear AC met, merged): set the matching YAML todo to `status: completed` **and** update the body line to `- [x] ~~same visible text as before~~ (`id`)`.
- **In progress:** track in Linear; keep YAML at `pending` until done.
- **Humans** may fix mismatches between Plan todos and body; they do not need to tick items routinely.

**Rendering:** Completed body lines use **task list** `- [x]` plus **strikethrough** `~~text~~` so source and preview stay aligned with the Plan panel.

---

## Practical sprint boundaries and dependency order (2026-04-04)

**Feedback:** The checklist is practical if you treat **Sprint 1** as two slices, not one monolith. The pain you felt came from **hidden dependencies**: workers and UI were listed as “Sprint 1” while **scan enqueue** (adapter + queue + `scans` row) was implicit inside AD-04/FE-03. That made Sprint 1 look “done” on paper when **Phase 1 AC** (`p1-ac-devstore`, etc.) still needed work that had been mentally filed under “later”. **SEC-06 / npm dependency audit** (`s0-ci-sec06`) is unrelated to that; it does not unblock scan flow.

**Sprint 1A (engine + adapter + embedded shell):** INFRA and BE classifiers/workers through BE-18, audit append (BE-10), Shopify adapter AD-01–AD-05, FE-01. These can complete without PDF export, evidence library, billing UI, or monthly reports.

**Sprint 1B (integration closure for the dev-store scan loop):** **INT-01** (`w23-int-scan-01`, Linear **REU-158**) — end-to-end enqueue from Remix/API + optional webhook incremental path; then **FE-03** (Start Scan + progress, REU-101) and **BE-19** (repeatable auto-scan) can ship without waiting for Sprint 2 compliance depth. **BE-20** (monthly report) and **BE-22** (email) enhance the loop but are not strict prerequisites for “first successful scan”.

**Sprint 2 onward:** BE-11–BE-14, BE-21–BE-23, NOTIF-*, remaining FE flows, billing, evidence, PDF. **Phase 1 AC** and **DoD** rows in Sprint 3 stay the release gate for the full milestone, not for calling Sprint 1A complete.

**Linear:** **REU-158** tracks INT-01 under epic AD (**REU-30**). **REU-78** (BE-19) and **REU-101** (FE-03) are linked as blocked by **REU-158** until enqueue exists (or an equivalent documented bridge).

### Agent ownership — backend vs embedded Shopify UI

- **Backend / integration agent:** Owns `@disclo/core` string tables that servers return or persist for humans (`merchant`, `plan`, `notifications`, `internalHttp`), plus Remix routes that only return JSON to clients or workers (`app.scan` action payloads, `internal.*`, webhook side effects), `scan-enqueue.server.ts`, and worker copy that writes `notifications`. Follow `.cursor/rules/writing.mdc` for every user-visible sentence (outcome first, what to do next, no opaque codes).
- **Shopify FE agent:** Owns Polaris layout and wiring; reads `getMerchantMessages` / outlet context for display. Suggests copy changes as PR comments or tasks; does not fork duplicate English tables outside `packages/core/src/i18n/` for strings the server already returns.

---

## Sprint 0 — agent routing (who executes what)

Each agent **checks for existing artifacts** before creating duplicates, **validates** tables and env parity for gaps, and **proves** connections with CLI or MCP where the task requires it.


| Sprint 0 todo / theme                                               | Primary agent                        | Validate / prove                                                                                 |
| ------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Threat model + **ingress audit** (`s0-threat-ingress-audit`)        | `/agent-sec-comp`                    | Grep `app/routes`, `shopify.app.toml`, `apps/api` vs `docs/security/threat-model.md` ingress map |
| **Secrets runbook** ↔ `infra/env.example` (`s0-secrets-env-parity`) | `/agent-sec-comp`                    | Table lists every `env.example` key + CI-only secrets (e.g. keep-alive)                          |
| **QA traceability** first E2E rows (`s0-qa-matrix-rows`)            | `/agent-qa`                          | Rows have real requirement text, planned test paths, not `*TBD*` for those rows                  |
| **CI on `dev` + PR to `main`** (`s0-ci-github-main`)                | `/agent-infra`                       | `gh run list --workflow=ci.yml --branch dev`; green on PRs to `main` from `dev`                  |
| **Webhook contract tests** (`s0-webhook-contract-tests`)            | `/agent-backend` + `/agent-sec-comp` | Unit/integration tests for HMAC contract; optional Remix route tests later                       |
| **SEC-06** dependency audit (`s0-ci-sec06`)                         | `/agent-infra`                       | Workflow job + policy in `agent-infra.md` (critical gate; high tracked)                          |
| **Incident response** doc (`s0-incident-response-doc`)              | `/agent-sec-comp`                    | File exists; linked from `docs/SESSION.md`                                                       |
| **Linear SEC/COMP** (`s0-linear-sec-comp`)                          | `/agent-sec-comp`                    | Linear MCP or UI; issues match AC, not scaffold-only                                             |
| **INFRA-01–11** (Week 1 block)                                      | `/agent-infra`                       | Maintainer policy integration bar; Railway/Supabase/Redis/CLI proof                              |
| **BE-01 / BE-02** (Sprint 0 infra + core section)                   | `/agent-backend`                     | Types in `types.ts`; `regulations/` + `resolve.test.ts`; no duplicate registry                   |


---

## Sprint 0 validation snapshot (2026-03-31)

**Sprint 0 is not fully “closed”** until `**s0-ci-github-main`** is green on GitHub (`**dev`** pushes and/or **PR `dev` → `main`**) and `**s0-linear-sec-comp`** matches Linear reality. Other doc and code gates below are landed in-repo.


| Criterion                                | Status                                                                                       |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| Threat model draft + ingress vs routes   | Done — ingress map lists concrete Remix webhook paths and `apps/api` stub                    |
| Secrets runbook vs `infra/env.example`   | Done — inventory table covers every template key + `SUPABASE_DATABASE_URL` (keep-alive CI)   |
| QA traceability — first three E2E paths  | Done — three rows with planned test IDs/paths (evidence still `pending` until tests exist)   |
| CI green locally (`pnpm` from `disclo/`) | Verified locally; **confirm on `main`** (`s0-ci-github-main`)                                |
| Webhook HMAC contract tests              | Done — `packages/core/src/shopify-webhook-hmac.test.ts` (+ export); Remix route tests later  |
| SEC-06 dependency audit                  | Done — `dependency-audit` job: `pnpm audit --audit-level critical`; policy in `/agent-infra` |
| `docs/security/incident-response.md`     | Done — linked from `docs/SESSION.md`                                                         |


**Ready for Sprint 1 / Week 1?** **Yes** for core types + regulation registry + **Supabase migrate + seed** + **BullMQ smoke**. **Still open for strict Maintainer bar:** `w1-infra-09` / `w1-infra-11` (Railway when you release, keep-alive with secret). **Sprint 0 foundations:** push `dev`, confirm Actions; **PR `dev` → `main`** for release gate; Linear: SEC/COMP as before.

---

## Sprint 0 — foundations (execution plan sec 4.7)

**Goal:** Documented security baseline, QA visibility, CI green, webhook tests started, pipeline hardening planned. Wording below matches YAML `content` (and should match Linear SEC-COMP issues where applicable).

- ~~Sprint 0 (sec 4.7): Threat model draft at docs/security/threat-model.md~~ (`s0-artifact-threat-model`)
- ~~Sprint 0 (sec 4.7): Secrets inventory / runbook at docs/security/secrets-runbook.md~~ (`s0-artifact-secrets-runbook`)
- ~~Sprint 0 (sec 4.7): QA traceability matrix shell at docs/QA_TRACEABILITY.md~~ (`s0-artifact-qa-traceability`)
- ~~Sprint 0 (sec 4.7): CI green — pnpm typecheck, lint, test from disclo/ (confirm GitHub Actions on main after push)~~ (`s0-local-ci-pnpm`)
- ~~Sprint 0: Threat model ingress map audited vs current Shopify + webhook routes~~ (`s0-threat-ingress-audit` / `/agent-sec-comp`)
- ~~Sprint 0: Secrets runbook covers every disclo/infra/env.example entry~~ (`s0-secrets-env-parity`)
- ~~Sprint 0: QA_TRACEABILITY.md non-placeholder rows for first three Phase 1 E2E paths~~ (`s0-qa-matrix-rows` / `/agent-qa`)
- Sprint 0: CI green on GitHub — `dev` push + PRs to `main` (`s0-ci-github-main` / `/agent-infra`)
- ~~Sprint 0: Webhook test harness / contract tests (e.g. Linear REU-157)~~ (`s0-webhook-contract-tests`)
- ~~Sprint 0: CI dependency audit and/or secret scanning + policy (SEC-06)~~ (`s0-ci-sec06`)
- ~~Sprint 0: docs/security/incident-response.md + link from SESSION (SEC-07)~~ (`s0-incident-response-doc`)
- Sprint 0: Linear SEC-01 through COMP-03 advanced toward Done per AC (`s0-linear-sec-comp`)

---

## Sprint 0 — infrastructure + core types + schema

**Focus:** INFRA-01–11, BE-01–02. Descriptions from execution plan sec 4.2.

### Infrastructure (Linear epic INFRA / REU-28)

**All INFRA rows reset to pending (2026-03-31):** Earlier checks treated “files in repo” as done. They are **not** complete until integrations match Maintainer policy (real DB migrate path, Redis/BullMQ smoke, Railway deploy green, CI on `main`, etc.).

- ~~INFRA-01: Monorepo scaffold — pnpm workspaces, Turborepo pipelines, shared tsconfig, ESLint, Prettier, Vitest workspace~~ (`w1-infra-01`)
- ~~INFRA-02: Complete Prisma schema (ALL 17 tables) + initial migration + seed (5 plans, 6 cert registries)~~ (`w1-infra-02`) — **2026-04-01:** `pnpm db:migrate:deploy` + `pnpm db:seed` against Supabase (`DIRECT_URL` for migrate; single `DATABASE_URL` pooler for client)
- ~~INFRA-03: Core config — config.ts with Zod validation for all env vars (GPTZero, Hive, Claude, Shopify, Resend, R2, Redis, DB)~~ (`w1-infra-03`)
- ~~INFRA-04: Shared error classes — errors.ts (ClassifierError, AdapterError, PlanError, ValidationError, BillingError, EvidenceError)~~ (`w1-infra-04`)
- ~~INFRA-05: Structured logger — logger.ts with Pino, JSON output, correlation IDs~~ (`w1-infra-05`)
- ~~INFRA-06: Crypto utilities — crypto.ts AES-256-GCM encrypt/decrypt~~ (`w1-infra-06`)
- ~~INFRA-07: BullMQ queue setup — connection, queue definitions (scan, text-classify, image-classify, claims-check, report, evidence-verify, auto-scan), worker base~~ (`w1-infra-07`) — `**pnpm smoke:bullmq` OK** (shared Redis; prefix `disclo`_)
- ~~INFRA-08: GitHub Actions CI — lint, typecheck, test on PR~~ (`w1-infra-08`)
- INFRA-09: Railway deployment config (`w1-infra-09`)
- ~~INFRA-10: Supabase project creation, DATABASE_URL wiring (pooler vs direct per Supabase + Prisma docs), Prisma migrate from local/CI~~ (`w1-infra-10`) — **2026-04-01:** `schema.prisma` `directUrl` + `infra/env.example`; migrate/seed proven locally
- INFRA-11: GitHub Actions keep-alive workflow (supabase-keep-alive.yml) — twice-weekly SELECT 1, secrets wired, failure visibility, runbook to disable on Supabase Pro upgrade (`w1-infra-11`)

### Core (Linear epic BE / REU-29)

- ~~BE-01: Core types — ScanRequest, LabelInstruction, PlatformAdapter, RegulationConfig, EvidenceType, QualityTier~~ (`w1-be-01`)
- ~~BE-02: Regulation registry — packages/core/src/regulations/ — all 5 regulation configs, applicability resolver based on target_markets~~ (`w1-be-02`)

---

## Sprint 1 — core engine + Shopify adapter (1A + 1B)

Execution plan sec 4.2. Epic IDs: BE REU-29, AD REU-30, BILL REU-32, NOTIF REU-33, AUDIT REU-34, PRO REU-35, EVID REU-36.

**Sprint 1A** = classifiers, workers, audit append, adapter, theme extension, app shell. **Sprint 1B** = **INT-01** (REU-158) + **FE-03** (REU-101) + **BE-19** (REU-78) so the dev store can run a full scan without taking Sprint 2 (PDF, evidence, billing UI, notifications matrix).

### Sprint 1 — what is still open (dependencies)


| Item                 | Notes                                                                                                                                                                                                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~**INT-01**~~       | **Done:** `scan-enqueue.server.ts`, webhooks, `/app/scan` (YAML `w23-int-scan-01`).                                                                                                                                                                                     |
| ~~**BE-19**~~        | **Done:** repeatable `auto-scan` + internal `/internal/monthly-scan`.                                                                                                                                                                                                   |
| **BE-20**            | **Partial:** report worker + schema + `notifications`; no producer / PDF yet (YAML `w23-be-20` pending).                                                                                                                                                                |
| ~~**FE-02**~~        | **Done (2026-04-04):** dashboard onboarding, regulation cards, risk breakdown, markets `ChoiceList`, active-scan banner.                                                                                                                                                |
| ~~**FE-03**~~        | **Done (2026-04-04):** `/app/scans/:id` polling + pipeline bars.                                                                                                                                                                                                        |
| ~~**FE-04**~~        | **Done (2026-04-04):** `/app/scans` list (Sprint 2 track; shipped early).                                                                                                                                                                                               |
| **BE-21 / billing**  | Separate epic (BILL); `app_subscriptions/update` handler logs only.                                                                                                                                                                                                     |
| **Phase 1 AC / DoD** | Many rows stay **pending** until E2E, coverage targets, Railway, and App Store work (Sprint 3–4). `**dod-shopify-int`** is met with **mocked** Admin GraphQL in `@disclo/adapters` tests. **Sprint 1 closure** for the scan loop does not require every Phase 1 AC row. |


### Core engine (BE / REU-29, plus domain epics)

- ~~BE-03: Plan resolver — getFeatures(shopId) with Redis cache (5-min TTL), Postgres fallback, plan_override merge~~ (`w23-be-03`)
- ~~BE-04: Plan enforcement — requireFeature(shopId, feature) and requireWithinLimit(shopId, feature, currentUsage)~~ (`w23-be-04`) — `requireFeature` / `requireWithinLimit` take resolved `PlanFeatures` (after `getFeatures`); see `packages/core/src/plan/`.
- ~~BE-05: GPTZero text classifier — API integration, retry on 429, min 50-word threshold, risk level mapping, batch endpoint support~~ (`w23-be-05`) — `classifiers/text-classifier.ts`; batch = `classifyPlainTextBatch` (sequential calls); `/v2/predict/files` deferred.
- ~~BE-06: Hive image classifier — CDN URL input, AI probability output, retry with 1h backoff, never mark clean on failure, incremental scan support~~ (`w23-be-06`) — `classifiers/image-classifier.ts`; 1h requeue is worker concern.
- ~~BE-07: Green claims keyword checker — keyword rules engine (4 categories from Section 7.3), flagged_claims array output~~ (`w23-be-07`) — `classifiers/claims-keywords.ts`.
- ~~BE-08: Green claims LLM substantiation — Claude integration, structured prompt, SUBSTANTIATED vs BARE_ASSERTION per claim, Pro+ plan gate~~ (`w23-be-08`) — `classifiers/claims-llm.ts`.
- ~~BE-09: Risk scorer — weighted penalty calculation, 0-100 score, multi-regulation awareness~~ (`w23-be-09`) — `risk/risk-score.ts`.
- ~~BE-10: Audit log service — write-only append, editorial exemption logic (hash comparison), content hash validation, multi-regulation citation~~ (`w23-be-10`) — `packages/core/src/audit/` (`append.ts`, `exemption.ts`); PDF export remains BE-11 (Sprint 2).
- ~~BE-15: Scan orchestrator worker — BullMQ job dispatch, adapter content fetching, fan-out to 3 classifier queues, result aggregation, risk score calculation, scan status updates~~ (`w23-be-15`) — `workers/src/scan/scan-orchestrator-worker.ts` + `scan/payloads.ts`; content comes from job payload (adapter upstream).
- ~~BE-16: Text classifier worker — BullMQ consumer, processes text jobs, writes ScanItem~~ (`w23-be-16`) — `workers/src/classify/text-classifier-worker.ts` (GPTZero + Hive + claims in one pipeline).
- ~~BE-17: Image classifier worker — BullMQ consumer, processes image jobs, incremental cost control~~ (`w23-be-17`) — merged into `text-classifier-worker`; separate queue stub in `workers/src/classify/image-classifier-worker.ts`.
- ~~BE-18: Claims checker worker — BullMQ consumer, keyword pass + optional LLM pass~~ (`w23-be-18`) — merged into `text-classifier-worker`; separate queue stub in `workers/src/classify/claims-checker-worker.ts`.
- ~~BE-19: Auto-scan worker — BullMQ repeat jobs, monthly incremental scan for shops with monthly_auto_scan enabled~~ (`w23-be-19`) — `register-auto-scan-schedule.ts` + `auto-scan-worker.ts` POST `SHOPIFY_APP_URL/internal/monthly-scan` with `INTERNAL_API_SECRET`; Remix `internal.monthly-scan.tsx` runs `enqueueMonthlyAutoScansFromPlan` (full scans per eligible shop; workers stay adapter-free).
- BE-20: Report generator worker — monthly compliance report generation (`w23-be-20`) — **Partial:** `reportGeneratorJobSchema` + worker writes `notifications` rows when jobs use that payload; PDF/export pipeline still open.

### Shopify adapter (AD / REU-30)

- ~~AD-01: Shopify OAuth flow — install, callback, token encryption, user + auth_identity + shop record creation~~ (`w23-ad-01`) — `after-auth.server.ts` + `shopify.server.ts` `afterAuth`; requires `ENCRYPTION_KEY` + seeded `free` plan.
- ~~AD-02: Shopify content fetcher — GraphQL Admin API, paginated product fetch (50/request), HTML stripping, ScanRequest construction~~ (`w23-ad-02`) — `createShopifyAdapter().fetchContent` in `@disclo/adapters`.
- ~~AD-03: Shopify label writer — metafieldsSet mutation for eu_ai_compliance.ai_content_disclosure, machine-readable meta tag, multi-regulation citation in label text~~ (`w23-ad-03`) — `metafieldsSet` + theme reads metafields; separate HTML `<meta>` tag not added on storefront HTML (optional follow-up).
- ~~AD-04: Shopify webhook handler — PRODUCTS_CREATE, PRODUCTS_UPDATE, APP_UNINSTALLED, APP_SUBSCRIPTIONS_UPDATE~~ (`w23-ad-04`) — Remix routes + `shopify.app.toml`; uninstall clears `shops.accessToken`. Product-topic **scan enqueue** is **INT-01** (`w23-int-scan-01`, Linear **REU-158**), not a Sprint 2 dependency.
- ~~AD-05: Shopify Theme App Extension — App Block (Liquid) rendering disclosure badge + green verification badge, reads metafields, customizable text/position~~ (`w23-ad-05`) — `extensions/disclosure-badge/` block settings + metafields.

### Embedded app — UI / REU-31 (Sprint 1 slice)

**These are UI epic items, not AD.** Listed here because they ship in the same Shopify embedded app as the adapter.

- ~~FE-01: Embedded app shell — Remix + App Bridge + Polaris provider, session token validation, navigation structure~~ (`w35-fe-01`) — `AppProvider` + `NavMenu` (Dashboard, Settings); authenticated `app` layout; **2026-04-03** cleanup of template-only nav.
- ~~FE-02: Dashboard home (S1) — compliance score, regulation summary cards, last scan, risk breakdown, quick actions, onboarding, target market selector~~ (`w35-fe-02`) — `dashboard-data.server.ts` + `app._index.tsx`: onboarding checklist, regulation cards from `resolveRegulationsForMarkets`, risk breakdown bars from last completed scan, `ChoiceList` target markets (POST saves `shop_settings`), active-scan banner with link.
- ~~FE-03: Scan trigger + progress (S2) — Start Scan button, progress polling with sub-indicators (text/image/claims), completion~~ (`w35-fe-03`) — `app.scan.tsx` enqueue; navigate to `app/scans/:scanId`; `scan-progress.server.ts` + `app.scans.$scanId.tsx` polls every 2.5s with overall + three stage bars (same per-product pipeline).

### Sprint 1B — integration closure (AD + UI)

- ~~INT-01: End-to-end scan enqueue~~ (`w23-int-scan-01`, Linear **REU-158**) — `scan-enqueue.server.ts`, `app/routes/app.scan.tsx`, dashboard **Start scan**; webhooks **products/create|update** → incremental enqueue; core `scan/enqueue.ts` + adapter `fetchProductByNumericId`; **unblock** FE-03 (REU-101) / BE-19 (REU-78) in Linear when verified in your environment.

### Sprint 1B — closure record (2026-04-04)

**Status: closed in repo** (code + automated tests). The three YAML items `**w23-int-scan-01`**, `**w35-fe-03`**, and `**w23-be-19**` are `**completed**`. What follows is the evidence bundle and the one **manual** gate before you mark Linear issues Done.


| Gate                 | Evidence                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **INT-01**           | `apps/embedded/shopify/app/scan-enqueue.server.ts`, `app/routes/app.scan.tsx`, `webhooks.products.`*; plan gates + `**actionUrl` / `actionLabel`** on merchant-recoverable errors          |
| **FE-03**            | `app/routes/app.scans.$scanId.tsx` (2.5s polling), `scan-progress.server.ts`; dashboard **Start full scan** → navigate to scan detail                                                      |
| **BE-19**            | `workers/.../register-auto-scan-schedule.ts`, `auto-scan-worker.ts`, `app/routes/internal.monthly-scan.tsx` (`INTERNAL_API_SECRET`)                                                        |
| **Vitest**           | `scan-enqueue.server.test.ts`, `scan-progress.server.test.ts`, `dashboard-data.server.test.ts`, `scans-list.server.test.ts`, webhook payload tests                                         |
| **Playwright smoke** | `apps/embedded/shopify/e2e/health.spec.ts`, `auth-login.spec.ts`, `marketing-landing.spec.ts` — run `**pnpm test:e2e`** from `disclo/` with app reachable (`docs/TESTING.md` § End-to-end) |


**Out of scope for Sprint 1B (Sprint 2+):** BE-20 PDF/monthly report delivery, FE-06 Apply label + audit entry, full automated **install → OAuth → embedded scan** Playwright (manual dev-store pass or future QA ticket).

**Linear:** Mark **REU-158**, **REU-101**, and **REU-78** **Done** after you run one **dev-store** pass: workers + Redis, **Start scan**, progress completes or fails visibly with CTA. **Next execution focus:** Sprint 2 (§ below); start with **FE-05** item detail, **BE-11** PDF, **BE-21** billing as your priority order allows.

---

## Sprint 2 — Audits + Evidence + Billing + notifications

**Scope note:** Sprint 2 deepens compliance (PDF, evidence, billing, notifications, remaining FE). **Sprint 1B is closed in-repo** as of the closure record above; dev-store verification is the only remaining gate to flip Linear **REU-158** / **REU-101** / **REU-78**.

**Started 2026-04-04:** FE-04 (scan list at `/app/scans`) landed first; continue with FE-05+, BE-11+, billing, notifications per dependency order.

### Audit / evidence / billing / storage (split epics)

- BE-11: Audit log PDF export — formatted PDF, SHA-256 integrity hash, export declaration, regulation citations per entry (`w23-be-11`)
- BE-12: Rewrite engine — Claude integration, tone selection, spec preservation, change list, editorial note, audit log entry on apply (`w23-be-12`)
- BE-13: Evidence system — CRUD for evidence_items, claim_evidence linking, evidence suggestion engine, R2 document upload, SHA-256 hash (`w23-be-13`)
- BE-14: Evidence verifier worker — daily cron, certification registry lookup (API/URL), status update, re-open linked scan_items on expiry, notification (`w23-be-14`)
- BE-23: R2 integration — presigned URL generation, upload handler, SHA-256 hash computation (`w23-be-23`)
- BE-21: Shopify Billing — appSubscriptionCreate, confirmation, APP_SUBSCRIPTIONS_UPDATE webhook, plan_id sync, all 4 tiers (`w23-be-21`)
- BE-22: Email notifications — Resend integration: scan complete, high-risk alert, evidence expiry, monthly report (`w23-be-22`)

### Notifications (NOTIF / REU-33)

- NOTIF-01: Notification dispatcher worker — workers/notification-dispatcher.ts, consumes from notification-queue, resolves template, renders email via Resend, writes to notifications table (`w23-notif-01`)
- NOTIF-02: In-app surfacing — lightweight polling/toast patterns in embedded app (no WebSocket needed at MVP) (`w23-notif-02`)
- NOTIF-03: Email templates — TypeScript template literals in packages/core/src/notifications/templates/ (`w23-notif-03`)
- NOTIF-04: Support alert routing — POST to internal Slack webhook or Linear issue creation on high-risk scan (configurable via SUPPORT_ALERT_WEBHOOK_URL) (`w23-notif-04`)
- Notifications: All scenarios from Section 7 table — full trigger/channel/plan-gate matrix (see execution plan sec 4.2 and Section 7) (`w23-notif-matrix`)

### Embedded frontend (FE-04 through FE-14; FE-03 lives under Sprint 1B with INT-01)

**Linear epic UI / REU-31.** Execution plan sec 4.2 (Frontend).

- ~~FE-04: Scan results list (S3) — filterable/sortable IndexTable, regulation filter, bulk actions~~ (`w35-fe-04`) — `/app/scans` (`app.scans._index.tsx`), `scans-list.server.ts`: regulation filter on `scan_items.regulations`, sort by `createdAt`, IndexTable + CSV export bulk action; nav **Scans**.
- ~~FE-05: Item detail (S4) — AI probability, risk level, regulations list, product text preview from Shopify, green claims section, audit history~~ (`w35-fe-05`) — `/app/scans/:scanId/items/:itemId`, `scan-item-detail.server.ts`, `scan-item-detail.server.test.ts`
- ~~FE-06: Apply Label flow — one-click AI disclosure metafield, multi-regulation citation, audit entry (`labelled`), item status `labelled`, `refreshCompletedScanAggregates`~~ (`w35-fe-06`) — `apply-label.server.ts`, `apply-label.server.test.ts`; plan gate `fixDashboard`
- FE-07: Mark as Human-Reviewed flow — reviewer name form, validation, audit entry, exemption (`w35-fe-07`)
- FE-08: Request Rewrite flow (S10) — side-by-side diff, tone selector, apply/edit, audit entry (`w35-fe-08`)
- FE-09: Free tier summary (S5) — locked preview, upgrade CTA (`w35-fe-09`)
- FE-10: Billing page (S6) — plan comparison, Shopify Billing, all 4 tiers (`w35-fe-10`)
- FE-11: Green claims dashboard (S11) — claims grouped by type, status, regulation, evidence attachment, rewrite (`w35-fe-11`)
- FE-12: Evidence library (S9) — list, add form (6 types), detail, suggestion engine, R2 upload (`w35-fe-12`)
- FE-13: Audit log viewer (S8) — chronological list, filters (including regulation), PDF export button (`w35-fe-13`)
- FE-14: Settings page (S7) — target markets, badge text, green badge tooltip, scan preferences (`w35-fe-14`)

---

## Sprint 3 — QA + security hardening

**Linear epic QA / REU-44.** Execution plan sec 4.2 (Testing and Launch) + Phase 5 acceptance criteria + definition of done.

- QA-01: E2E test suite — install -> scan -> view results -> apply label -> verify badge on storefront (`w56-qa-01`)
- QA-02: Classifier accuracy testing — test against corpus of known AI/human product descriptions (`w56-qa-02`)
- QA-03: Rewrite engine testing — verify spec preservation, no hallucination (`w56-qa-03`)
- QA-04: Multi-regulation testing — verify correct regulations applied per target market (`w56-qa-04`)
- QA-05: Billing flow testing — all 4 plan tiers, upgrade, downgrade (`w56-qa-05`)
- QA-06: Evidence flow testing — upload, link, verify, expiry (`w56-qa-06`)
- QA-07: Shopify App Store submission preparation — review checklist, dev store testing, screenshots (`w56-qa-07`)
- QA-08: Security review — token encryption, webhook signatures, R2 access, data minimization (`w56-qa-08`)

### Phase 1 milestone acceptance (execution plan Phase 5)

- Phase 1 AC: App installs cleanly on Shopify dev store; scan completes for a 100-product store in < 10 minutes (text + images + claims) (`p1-ac-devstore`)
- Phase 1 AC: Risk scores display correctly with regulation breakdown (`p1-ac-risk-ui`)
- Phase 1 AC: Apply Label writes metafield; badge renders on storefront citing correct regulation(s) (`p1-ac-label-badge`)
- Phase 1 AC: Mark as Human-Reviewed creates audit entry, exempts item, re-opens on content change (`p1-ac-human-reviewed`)
- Phase 1 AC: Green claims flagged with correct regulation (FTC/EU Green Claims); evidence attachable; rewrite preserves product specs (`p1-ac-green-rewrite`)
- Phase 1 AC: PDF export includes all entries with regulation citations and integrity hash (`p1-ac-pdf`)
- Phase 1 AC: Free tier stops at 50 items, shows upgrade CTA (`p1-ac-free-tier`)
- Phase 1 AC: All 4 plan tiers purchasable via Shopify Billing (`p1-ac-billing-tiers`)
- Phase 1 AC: APP_UNINSTALLED cascade-deletes all shop data within 48h (`p1-ac-uninstall`)
- Phase 1 AC: Target market selector correctly determines applicable regulations (`p1-ac-markets`)

### Definition of done (execution plan Phase 5)

- DoD: Unit tests >= 90% coverage on core logic (`dod-core-coverage`)
- ~~DoD: Integration tests for Shopify adapter~~ (`dod-shopify-int`) — `@disclo/adapters` Vitest + mocked `fetch` for GraphQL (`create-shopify-adapter.test.ts` et al.).
- DoD: Contract tests for PlatformAdapter interface (`dod-adapter-contract`)
- DoD: E2E install->scan->label->badge; green claim->evidence->substantiated; rewrite->review->apply->audit (`dod-e2e-three`)
- DoD: Classifier accuracy tested against known corpus (`dod-corpus`)
- DoD: No TypeScript errors, no ESLint warnings (`dod-lint-ts`)
- DoD: Deployed to Railway staging (`dod-railway`)
- DoD: Shopify App Store submission-ready (`dod-app-store-ready`)

---

## **Sprint 4 — Polish, Analytics & App Store**

- Configure Sentry `@sentry/remix` SDK with source maps in CI 
- Configure PostHog event taxonomy 
- Create Upptime `disclo-status` repo 
- Connect ChartMogul to Shopify billing webhooks
- Mobile-responsive audit and fixes
- Polaris merchant onboarding checklist component
- App Store listing: copy, screenshots, demo video 
- Privacy policy page at `/legal/privacy`
- Shopify usage-based billing configured
- Beta install on 2–3 test stores
- Final SECURITY sign-off
- Submit for Shopify App Review
- Final App Registry & E2E Validation
- Final Phase 1 Sign-off
- SESSION handoff — docs/SESSION.md updated at each meaningful handoff (session-handoff rule) (`w67-session`)

---

## Repo validation log (agent)

### 2026-03-31 — correction (owner review)

**INFRA-01–11 were incorrectly marked completed.** An agent treated “there is a `schema.prisma`, a `railway.toml`, worker `.ts` files, and CI YAML” as **implementation**. That is **scaffold only**. Without a **live** Postgres + successful migrate/seed path you control, **Upstash Redis** (or equivalent) + workers proven against a real queue, and **Railway** (or chosen host) **deployed and healthy**, the INFRA acceptance criteria in sec 4.2 are **not** met.

**Action:** All `w1-infra-`* YAML todos and body lines are **pending** until you sign them off using **Maintainer policy → INFRA done criteria**. Move corresponding Linear INFRA issues out of **Done** if they were closed on scaffold-only evidence.

### 2026-03-31 — other notes (still useful)


| Topic                                      | Notes                                                                                                                                                                            |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sprint 0 docs + local CI                   | Ingress/env parity/QA rows/incident doc/SEC-06 job + HMAC tests landed 2026-03-31; `s0-ci-github-main` + `s0-linear-sec-comp` still pending.                                     |
| `w1-be-01`                                 | `RegulationConfig`, `EvidenceType`, `QualityTier` not in `packages/core/src/types.ts` yet — remains pending.                                                                     |
| Prisma / seed (when you validate INFRA-02) | `seed.ts` includes 5 plans + 6 certification registry rows; schema has 18 `model` blocks including `Session` — reconcile “17 tables” wording vs Linear when you close the issue. |
| Linear                                     | Issue descriptions should match this plan’s long-form text; status should match verified integration, not file presence.                                                         |


---

## Linear epics (REU)


| Epic     | ID     |
| -------- | ------ |
| INFRA    | REU-28 |
| BE       | REU-29 |
| AD       | REU-30 |
| UI       | REU-31 |
| BILL     | REU-32 |
| NOTIF    | REU-33 |
| AUDIT    | REU-34 |
| PRO      | REU-35 |
| EVID     | REU-36 |
| QA       | REU-44 |
| SEC-COMP | REU-45 |


