# Disclo — Technical Specification

**Version**: 1.0 
**Date**: 20-March-2026
**Status**: Active
**Owner**: Reuben A. Keye
**Product**: Disclo

---

## 1. Project Overview

Disclo - A specialized SaaS infrastructure designed to help ecommerce merchants and content publishers comply with the **Article 50 of EU Regulation (EU) 2024/1689 (EU AI Act)** and **FTC Green Guides**. The system automatically detects AI-generated content (text/images/videos) and unsubstantiated environmental claims, writes disclosure badges, maintains a tamper-evident audit log, and provides a rewrite engine for non-compliant copy. It targets eCommerce merchants (Shopify, WooCommerce, etc.), bloggers, and headless API consumers.

**Founding architecture principle**: one shared detection and audit engine; platform-specific code exists only in thin adapter modules.

### 1.1 Problem

EU Regulation (EU) 2024/1689, Article 50 mandates that any business presenting AI-generated content to EU consumers must visibly disclose it by **August 2, 2026**. The obligation is platform-neutral — it applies equally to Shopify merchants, WooCommerce stores, WordPress bloggers, and headless stacks. No tool exists that solves this across platforms from a single compliance infrastructure.

Parallel obligations are emerging in the US: Florida requires disclosure of AI-generated commercial content ($1,000–$10,000/violation); New York requires disclosure of synthetic performers in advertising. The FTC Green Guides require substantiation of environmental marketing claims before publication.

### 1.2 Solution

Disclo is a multi-platform SaaS that connects to any content-publishing platform via thin adapter modules and runs all content through a shared detection and audit engine. One subscription covers a merchant's compliance obligation regardless of which platform hosts their content.

### 1.3 Strategic Design Principle

> The detection engine, risk scorer, audit log, rewrite engine, report generator, and billing system are built **once** and shared across all platforms. The only platform-specific code is the adapter layer.

This means adding a new platform takes 1–3 weeks of adapter work, not months of refactoring.

### 1.4 Target Audience


| Segment                         | Platform                      | Tier         |
| ------------------------------- | ----------------------------- | ------------ |
| Small ecommerce merchants       | Shopify, WooCommerce, Wix     | Free → Basic |
| Growing ecommerce stores        | Shopify, BigCommerce, Webflow | Pro          |
| Content publishers & bloggers   | WordPress, Ghost              | Basic        |
| Digital agencies (multi-client) | All platforms                 | Agency       |
| Custom / headless builds        | API-only                      | Enterprise   |


### 1.5 Business Model


| Tier       | Price/mo | Scope                                                                          |
| ---------- | -------- | ------------------------------------------------------------------------------ |
| Free       | $0       | 50 items, text only, flag count shown                                          |
| Basic      | $29      | 500 items, text + image, fix dashboard, audit log, monthly report              |
| Pro        | $99      | 1,500 items, rewrite engine, auto-scan, PDF export                             |
| Agency     | $199     | Unlimited items, multi-store (up to 3), white-label reports, 500K API calls/mo |
| Enterprise | Custom   | API-only, unlimited, SLA, dedicated support                                    |


### 1.6 Regulatory Context


| Regulation                         | Jurisdiction                                           | Obligation                                                     | Disclo's Output                                                                       |
| ---------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| EU AI Act Article 50               | EU (applies to all businesses selling to EU consumers) | Visible disclosure of AI-generated text, images, audio, video  | Consumer-visible disclosure badge + machine-readable meta tag                         |
| Florida AI Disclosure Law          | Florida, USA                                           | Label AI-generated commercial content                          | Same badge mechanism, different regulatory citation                                   |
| New York Synthetic Performers      | New York, USA                                          | Disclose synthetic performers in ads                           | Same detection + badge                                                                |
| FTC Green Guides (16 CFR Part 260) | USA                                                    | Substantiate environmental marketing claims before publication | Merchant-facing remediation tasks only — no consumer badge for unsubstantiated claims |
| EU Green Claims Directive          | EU (in progress)                                       | Substantiate green claims                                      | Same as FTC handling                                                                  |


**Critical rule**: Unsubstantiated green claims produce **merchant-facing** remediation tasks only. Never produce a consumer-visible badge saying a claim "may be unsubstantiated" — this is commercially destructive and not what the FTC requires. A **consumer-visible green icon badge** — rendered on the storefront **only when** the claim is substantiated and evidence is verified or asserted. This badge display is subject to settings.

**Badge logic:**


| Claim state                                              | Consumer-facing output                   | Merchant-facing output        |
| -------------------------------------------------------- | ---------------------------------------- | ----------------------------- |
| AI disclosure flagged                                    | ✅ Visible AI disclosure badge            | Fix dashboard entry           |
| Green claim — substantiated (verified/asserted evidence) | ✅ Green icon badge with evidence tooltip | Evidence record in audit log  |
| Green claim — unsubstantiated (bare assertion)           | ❌ No badge                               | Remediation task in dashboard |
| Green claim — evidence pending                           | ❌ No badge yet                           | "Evidence required" task      |


The green icon badge tooltip text: *"This sustainability claim is supported by [evidence type]. Certified by [body] — verified [date]." - Editable on the settings*

### 1.7 Editorial Exemption

Content subject to genuine human editorial review is exempt from labelling — provided:

- A named human reviewer reviewed the specific version of the content
- The review was substantive (not a click-through or minor correction)
- The date and identity of the reviewer are logged
- If the content is later materially changed, the exemption must be re-established
- The platform stores a SHA-256 hash of the content at the time of review

---

## 2. System Architecture

### 2.1 Two-Layer Design

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1 — CORE ENGINE  (packages/core)                     │
│  Platform-agnostic. Built once. Never imports from adapters │
│                                                             │
│  scan-orchestrator → text-classifier → image-classifier     │
│                    → claims-checker  → risk-scorer          │
│                    → audit-log       → rewrite-engine       │
│                    → report-generator → billing             │
└─────────────────────────────────────────────────────────────┘
         ↑ ScanRequest[]        ↓ LabelInstruction
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2 — PLATFORM ADAPTERS  (packages/adapters)           │
│  Pure I/O. One folder per platform. Zero business logic.    │
│                                                             │
│  shopify/ · woocommerce/ · bigcommerce/ · wix/              │
│  webflow/ · wordpress/ · ghost/ · headless/                 │
└─────────────────────────────────────────────────────────────┘
```

**Inviolable rule**: `packages/core` must never import from `packages/adapters`. Violation of this rule breaks the entire extension model.

### 2.2 Canonical Data Formats

All adapters produce and consume these two types. The core engine is fully platform-unaware.

**ScanRequest** (adapter → engine):

```typescript
interface ScanRequest {
  platform:     'shopify' | 'woocommerce' | 'bigcommerce' | 'wix'
                | 'webflow' | 'wordpress' | 'ghost' | 'headless';
  shop_id:      string;           // internal UUID
  external_id:  string;           // platform's own item ID
  content_type: 'product' | 'page' | 'post' | 'image' | 'policy';
  fields: {
    title?:      string;
    body?:       string;          // plain text — HTML stripped by adapter
    image_urls?: string[];
    meta?:       Record<string, string>;
  };
  metadata: {
    source_url:   string;
    updated_at:   string;         // ISO 8601 — used for incremental scan filtering
    content_hash: string;         // SHA-256 of raw content
  };
}
```

**LabelInstruction** (engine → adapter):

```typescript
interface LabelInstruction {
  platform:          string;
  shop_id:           string;
  external_id:       string;
  action:            'add_label' | 'remove_label' | 'update_description';
  label_text:        string;
  meta_key:          string;
  meta_value:        string;
  description_html?: string;
}
```

**PlatformAdapter interface** (every adapter must implement all four methods):

```typescript
interface PlatformAdapter {
  fetchContent(shopId: string, cursor?: string): Promise<ScanRequest[]>;
  writeLabel(instruction: LabelInstruction):     Promise<void>;
  registerWebhooks(shopId: string):              Promise<void>;
  revokeAccess(shopId: string):                  Promise<void>;
}
```

### 2.3 Data Flow (platform-agnostic steps)

1. Merchant clicks **Start Scan** → `POST /api/scan/start` → new `Scan` record (`status: queued`) + `ScanJob` pushed to BullMQ
2. `scan-orchestrator` worker wakes, loads shop, instantiates correct `PlatformAdapter`, calls `adapter.fetchContent()`
3. Adapter handles platform auth + pagination internally → yields batches of `ScanRequest[]`
4. Orchestrator fans out three parallel sub-jobs: text-classifier queue, image-classifier queue, claims-checker queue
5. Text classifier → GPTZero API → AI probability score
6. Image classifier → Hive Moderation API → per-image AI score (CDN URL, no download)
7. Claims checker → keyword rules engine → optional Claude API substantiation check (Pro+)
8. Results aggregated → `ScanItem` records written → `Scan.status = 'complete'`
9. Merchant receives in-app notification + email summary via Resend

---

## 3. Directory Structure

```
disclo/                               ← monorepo root
├── apps/
│   ├── website/                    ← Product website — disclo.com
│   ├── embedded/
│   |   ├── shopify/                ← Shopify embedded app (MVP)
│   │   |   ├── app/routes/
│   │   |   ├──  auth.$.tsx
│   │   |   ├── app._index.tsx
│   │   |   ├── app.scan.$scanId.tsx
│   │   |   ├── app.fix.$itemId.tsx
│   │   |   └── app.webhooks.tsx
│   |   ├── wordpress/                ← Wordpress and woocommerce admin app
│   |   # Other platforms admin ui (According to their system)
│   ├── dashboard/                    ← Central app — app.disclo.com (Phase 4)
│   └── api/                          ← Unified public API — api.disclo.com
│       └── src/
│           ├── v1/
│           │   ├── scan.ts           ← POST /v1/scan/text|image|batch|rewrite
│           │   ├── results.ts        ← GET /results/:id
│           │   ├── audit.ts          ← GET|POST /audit, /audit/export
│           │   └── webhooks-inbound.ts
│           └── middleware/
│               ├── auth.ts           ← Bearer API key validation
│               ├── rateLimit.ts      ← Redis token bucket (100 req/sec)
│               └── quota.ts          ← Monthly call quota check + increment
│
├── packages/
│   ├── core/src/                     ← Platform-agnostic engine
│   │   ├── types.ts                  ← ScanRequest, LabelInstruction, PlatformAdapter
│   │   ├── config.ts                 ← ONLY place process.env is accessed
│   │   ├── crypto.ts                 ← AES-256-GCM encrypt/decrypt
│   │   ├── logger.ts                 ← Pino structured logger
│   │   ├── errors.ts                 ← Typed error classes
│   │   ├── scanner/                  ← Scan orchestrator, job dispatch
│   │   ├── classifiers/
│   │   │   ├── text.ts               ← GPTZero integration
│   │   │   ├── image.ts              ← Hive Moderation integration
│   │   │   └── claims.ts             ← Green claims keyword + LLM check
│   │   ├── risk/                     ← Risk scorer, compliance score aggregation
│   │   ├── audit/log.ts              ← Write-only audit log
│   │   ├── reports/generator.ts      ← Monthly compliance report
│   │   ├── plans/
│   │   │   ├── resolver.ts           ← getFeatures() with Redis cache
│   │   │   └── middleware.ts         ← requireFeature(), requireWithinLimit()
│   │   ├── rewrite/                  ← Claude API rewrite engine
│   │   ├── notifications/            ← Dispatch + email templates
│   │   ├── evidence/
│   │   │   ├── verifier.ts           ← Certification registry lookup
│   │   │   ├── suggester.ts          ← Evidence suggestion engine
│   │   │   └── registry.ts           ← certification_registry_configs interface
│   │   └── webhooks-outbound/
│   │
│   ├── db/prisma/
│   │   ├── schema.prisma             ← Source of truth for all data models
│   │   ├── migrations/
│   │   └── seed.ts                   ← Seeds Free → Enterprise plan rows
│   │
│   └── adapters/
│       ├── index.ts                  ← getAdapter(platform) factory
│       ├── shopify/                  ← auth, fetcher, labeller, webhooks, theme
│       ├── wordpress/woocommerce/              ← auth, fetcher, labeller, webhooks
│       ├── bigcommerce/              ← auth, fetcher, labeller, webhooks, scripts
│       ├── wix/                      ← auth, fetcher, labeller, webhooks, velo-badge
│       ├── webflow/                  ← auth, fetcher, labeller, webhooks, badge
│       ├── ghost/                    ← auth, fetcher, labeller, webhooks (polling)
│       └── headless/                 ← no-op fetcher and labeller
│
├── workers/
│   └── src/
│       ├── main.ts                   ← boots all BullMQ workers
│       ├── lib/worker-connection.ts
│       ├── scan/scan-orchestrator-worker.ts
│       ├── classify/               ← text-, image-, claims-*-worker.ts
│       ├── reports/report-generator-worker.ts
│       ├── evidence/evidence-verifier-worker.ts  ← re-verifies certifications on schedule
│       ├── maintenance/auto-scan-worker.ts
│       ├── smoke/bullmq-smoke.ts
│       └── (future) notification-dispatcher-worker.ts, webhook-retry-worker.ts, quota-sync-worker.ts
│
├── plugins/
│   └── wordpress/                    ← PHP plugin (bridges WP/WC to SaaS)
│
├── infra/
│   └── env.example
├── CLAUDE.md                         ← Agent memory file (auto-read by Cursor)
├── REQUIREMENTS.md                   ← This file
├── turbo.json
└── package.json
```

---

## 4. Technology Stack

### 4.1 Core Stack


| Layer           | Technology     | Version | Justification                                                                                    |
| --------------- | -------------- | ------- | ------------------------------------------------------------------------------------------------ |
| Package manager | pnpm           | 9.x     | Workspace support, speed                                                                         |
| Monorepo        | Turborepo      | 2.x     | Incremental builds, pipeline caching                                                             |
| Runtime         | Node.js        | 22 LTS  | Stable, Railway-supported                                                                        |
| Language        | TypeScript     | 5.4+    | Strict mode throughout — no `any`                                                                |
| App framework   | Remix          | Latest  | SSR, OAuth flows, session handling                                                               |
| API framework   | Hono           | Latest  | Lightweight REST, versioned at `/v1/`                                                            |
| ORM             | Prisma         | 6.x     | Type-safe DB access, migration management                                                        |
| Database        | PostgreSQL     | 16      | Railway managed, shared across all platforms                                                     |
| Object storage  | Cloudflare R2  | Latest  | Evidence document uploads (see Section 8.2). EU region for GDPR. S3-compatible API. Free egress. |
| Job queue       | BullMQ + Redis | Latest  | Async scan processing, rate limiting                                                             |
| Testing         | Vitest         | Latest  | Unit + integration tests                                                                         |
| E2E testing     | Playwright     | Latest  | Browser automation, MCP-compatible                                                               |


### 4.2 Third-Party Providers


| Provider             | Purpose                                         | Tier availability | Endpoint                                                                                  |
| -------------------- | ----------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| GPTZero              | AI text detection                               | All plans         | `api.gptzero.me/v2/predict/text` (single), `/v2/predict/files` (batch, up to 1,000 items) |
| Hive Moderation      | AI image detection                              | Basic+            | `api.thehive.ai/api/v2/task/sync` — accepts CDN URLs directly                             |
| Anthropic Claude API | Green claim LLM check (Pro+) and rewrite engine | Pro+              | `claude-sonnet-4-6` model                                                                 |
| Stripe               | Billing — all non-Shopify platforms             | All               | Subscriptions, Checkout, Customer Portal, webhooks                                        |
| Shopify Billing API  | Billing — Shopify only                          | Shopify plans     | `appSubscriptionCreate` mutation                                                          |
| Resend               | Transactional email                             | All               | Monthly reports, alerts, audit export links                                               |
| Railway              | Hosting — app + workers + managed DB + Redis    | All               | Auto-deploy from GitHub `main`                                                            |


### 4.3 GPTZero Usage Detail


| Parameter         | Value                                                                                |
| ----------------- | ------------------------------------------------------------------------------------ |
| Endpoint (single) | `POST api.gptzero.me/v2/predict/text`                                                |
| Endpoint (batch)  | `POST /v2/predict/files` — up to 1,000 items                                         |
| Input             | Plain text (HTML stripped by adapter before passing)                                 |
| Output fields     | `completely_generated_prob`, `average_generated_prob`, `sentences[{generated_prob}]` |
| Rate limit        | 10 req/sec (Growth tier, $10/mo)                                                     |
| Cost              | ~$0.0001 per 250-word text; 1,000 products ≈ $0.40/scan                              |


### 4.4 Hive Moderation Usage Detail


| Parameter | Value                                                                                  |
| --------- | -------------------------------------------------------------------------------------- |
| Input     | Image CDN URL — no download required                                                   |
| Output    | `class: 'ai_generated'`, `score: 0.0–1.0`                                              |
| Coverage  | Midjourney, DALL-E 2/3, Stable Diffusion, Firefly, Imagen                              |
| Cost      | $0.001/image; 10 images/product = $0.01/product                                        |
| Fallback  | API unavailable → queue for retry with 1h backoff. **Never mark as clean on failure.** |


### 4.5 Anthropic Claude API Usage Detail


| Use case                             | Model               | Trigger                             | Plan gate |
| ------------------------------------ | ------------------- | ----------------------------------- | --------- |
| Green claim substantiation check     | `claude-sonnet-4-6` | After keyword pass flags a claim    | Pro+      |
| Rewrite engine (product description) | `claude-sonnet-4-6` | Merchant requests rewrite           | Pro+      |
| Rewrite engine (green claim)         | `claude-sonnet-4-6` | Merchant requests qualified rewrite | Pro+      |


### 4.6 Infrastructure


| Service                    | Provider        | Config                              | Estimated cost               |
| -------------------------- | --------------- | ----------------------------------- | ---------------------------- |
| App server (Remix + Hono)  | Railway         | Node.js, auto-deploy from `main`    | ~$5/mo                       |
| Scan workers (×4)          | Railway         | Separate services per worker type   | ~$10/mo                      |
| PostgreSQL 16              | Railway managed | 5 GB sufficient for 1,000 merchants | ~$10/mo                      |
| Redis 7                    | Railway managed | BullMQ backend + plan cache         | ~$5/mo                       |
| WordPress plugin hosting   | GitHub Releases | ZIP auto-published on tag           | Free                         |
| Email                      | Resend          | Transactional                       | Free tier → ~$20/mo at scale |
| **Total at 100 merchants** |                 |                                     | **~$35–50/mo**               |


Scales linearly: each additional 100 merchants ≈ +$10–15/mo (worker instances).

### 4.7 Environment Variables

```bash
# Core
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
ENCRYPTION_KEY=          # 32-byte hex (openssl rand -hex 32) — never rotate without migration plan
APP_URL=https://your-app.up.railway.app
NODE_ENV=development

# Detection APIs
GPTZERO_API_KEY=
HIVE_API_KEY=
ANTHROPIC_API_KEY=

# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=compliance@disclo.com

# Billing
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Shopify
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
SHOPIFY_SCOPES=read_products,write_products,read_content,read_themes,write_themes
SHOPIFY_APP_URL=https://your-app.up.railway.app

# Session
SESSION_SECRET=          # min 32 bytes
INTERNAL_API_SECRET=     # worker-to-app auth
LOG_LEVEL=info
```

All env access goes through `packages/core/src/config.ts` (Zod-validated schema). The app throws on startup if any required variable is missing or malformed.

---

## 5. Data Schema

### 5.1 users


| Column              | Type        | Constraints     | Notes                                                                         |
| ------------------- | ----------- | --------------- | ----------------------------------------------------------------------------- |
| id                  | UUID        | PK              | Internal identifier                                                           |
| email               | TEXT        | UNIQUE NOT NULL | Primary identity key; used for de-duplication across all login methods        |
| email_verified      | BOOLEAN     | DEFAULT false   | OAuth logins set true immediately; email+password requires verification click |
| display_name        | TEXT        | NULL            | Editable; populated from platform profile on federation                       |
| avatar_url          | TEXT        | NULL            | Optional                                                                      |
| billing_customer_id | TEXT        | NULL            | Stripe Customer ID                                                            |
| agency_account      | BOOLEAN     | DEFAULT false   | Enables multi-client workspace in central dashboard                           |
| mfa_enabled         | BOOLEAN     | DEFAULT false   | TOTP two-factor                                                               |
| mfa_secret          | TEXT        | NULL            | AES-256-GCM encrypted TOTP secret                                             |
| created_at          | TIMESTAMPTZ | DEFAULT now()   |                                                                               |
| last_login_at       | TIMESTAMPTZ | NULL            | Updated on every successful auth                                              |


### 5.2 auth_pass


| Column              | Type        | Constraints     | Notes                                             |
| ------------------- | ----------- | --------------- | ------------------------------------------------- |
| id                  | UUID        | PK              |                                                   |
| email               | TEXT        | UNIQUE NOT NULL |                                                   |
| password_hash       | TEXT        | NULL            | bcrypt, cost factor 12; NULL for OAuth-only users |
| failure_trial_count | INTEGER     | DEFAULT 0       | Max 3 before lockout                              |
| reset_token         | TEXT        | NULL            | Reset to null after use                           |
| token_expired_at    | TIMESTAMPTZ |                 |                                                   |
| created_at          | TIMESTAMPTZ | DEFAULT now()   |                                                   |
| last_login_at       | TIMESTAMPTZ |                 | Updated on successful password auth               |


### 5.3 auth_identities


| Column              | Type        | Constraints                      | Notes                                    |
| ------------------- | ----------- | -------------------------------- | ---------------------------------------- |
| id                  | UUID        | PK                               |                                          |
| user_id             | UUID        | FK → users(id) ON DELETE CASCADE |                                          |
| provider            | TEXT        | NOT NULL                         | `shopify`                                |
| provider_account_id | TEXT        | NOT NULL                         | Platform-specific user identifier        |
| provider_email      | TEXT        | NULL                             | Used for de-duplication on federation    |
| encrypted_token     | TEXT        | NULL                             | AES-256-GCM encrypted OAuth access token |
| token_expires_at    | TIMESTAMPTZ | NULL                             | NULL for non-expiring tokens             |
| refresh_token       | TEXT        | NULL                             | AES-256-GCM encrypted                    |
| created_at          | TIMESTAMPTZ | DEFAULT now()                    |                                          |
|                     | UNIQUE      | (provider, provider_account_id)  | Prevents duplicate identity records      |


### 5.4 shops


| Column           | Type        | Constraints                  | Notes                                                   |
| ---------------- | ----------- | ---------------------------- | ------------------------------------------------------- |
| id               | UUID        | PK                           |                                                         |
| owner_user_id    | UUID        | FK → users(id)               | Set during OAuth install                                |
| platform         | TEXT        | NOT NULL                     | `shopify`                                               |
| external_domain  | TEXT        | NOT NULL                     | UNIQUE on (platform, external_domain)                   |
| access_token     | TEXT        | NULL                         | AES-256-GCM encrypted OAuth token or API key            |
| display_name     | TEXT        | NULL                         | Populated from platform API on connection               |
| plan_id          | UUID        | FK → plans(id)               | Active plan — never stored as string                    |
| plan_override_id | UUID        | FK → plan_overrides(id) NULL | Override takes precedence when non-null and not expired |
| billing_provider | TEXT        | DEFAULT 'stripe'             | `stripe`                                                |
| billing_id       | TEXT        | NULL                         | Stripe subscription ID or Shopify billing ID            |
| last_scan_at     | TIMESTAMPTZ | NULL                         | Most recent completed scan timestamp                    |
| created_at       | TIMESTAMPTZ | DEFAULT now()                |                                                         |


### 5.5 plans


| Column               | Type         | Constraints           | Notes                                                      |
| -------------------- | ------------ | --------------------- | ---------------------------------------------------------- |
| id                   | UUID         | PK                    |                                                            |
| name                 | TEXT         | UNIQUE NOT NULL       | `free`                                                     |
| display_name         | TEXT         | NOT NULL              | Human-readable label shown in UI                           |
| price_monthly_usd    | NUMERIC(8,2) | NULL                  | NULL for custom enterprise pricing                         |
| max_items_per_scan   | INTEGER      | NULL                  | NULL = unlimited                                           |
| text_detection       | BOOLEAN      | NOT NULL              | True on all plans                                          |
| image_detection      | BOOLEAN      | NOT NULL              | False on Free                                              |
| fix_dashboard        | BOOLEAN      | NOT NULL              | False on Free                                              |
| audit_log            | BOOLEAN      | NOT NULL              | False on Free                                              |
| audit_log_pdf_export | BOOLEAN      | NOT NULL              | False on Free                                              |
| monthly_auto_scan    | BOOLEAN      | NOT NULL              | False on Free                                              |
| rewrite_engine       | BOOLEAN      | NOT NULL              | False on Free and Basic                                    |
| max_shops            | INTEGER      | NULL                  | NULL = unlimited                                           |
| white_label_reports  | BOOLEAN      | NOT NULL              | Agency and Enterprise only                                 |
| api_access           | BOOLEAN      | NOT NULL              |                                                            |
| api_monthly_calls    | INTEGER      | NULL                  | NULL = unlimited                                           |
| team_members         | INTEGER      | NOT NULL DEFAULT 1    | 99 = unlimited                                             |
| sla_support          | TEXT         | NOT NULL              | `community`                                                |
| active               | BOOLEAN      | NOT NULL DEFAULT true | Inactive = not selectable; existing subscribers unaffected |
| created_at           | TIMESTAMPTZ  | DEFAULT now()         |                                                            |
| updated_at           | TIMESTAMPTZ  | @updatedAt            | Cache invalidated on any write                             |


**Seeded values:**


| Feature              | Free      | Basic ($29) | Pro ($99) | Agency ($199) | Enterprise |
| -------------------- | --------- | ----------- | --------- | ------------- | ---------- |
| max_items_per_scan   | 50        | 500         | 1,500     | Unlimited     | Unlimited  |
| text_detection       | ✓         | ✓           | ✓         | ✓             | ✓          |
| image_detection      | ✗         | ✓           | ✓         | ✓             | ✓          |
| fix_dashboard        | ✗         | ✓           | ✓         | ✓             | ✓          |
| audit_log            | ✗         | ✓           | ✓         | ✓             | ✓          |
| audit_log_pdf_export | ✗         | ✓           | ✓         | ✓             | ✓          |
| monthly_auto_scan    | ✗         | ✓           | ✓         | ✓             | ✓          |
| rewrite_engine       | ✗         | ✗           | ✓         | ✓             | ✓          |
| max_shops            | 1         | 1           | 3         | Unlimited     | Unlimited  |
| white_label_reports  | ✗         | ✗           | ✗         | ✓             | ✓          |
| api_access           | ✗         | ✗           | ✓         | ✓             | ✓          |
| api_monthly_calls    | —         | —           | —         | 500,000       | Unlimited  |
| team_members         | 1         | 1           | 3         | 10            | Unlimited  |
| sla_support          | Community | Email       | Email     | Priority      | Dedicated  |


### 5.6 plan_overrides


| Column              | Type        | Constraints                      | Notes                                                         |
| ------------------- | ----------- | -------------------------------- | ------------------------------------------------------------- |
| id                  | UUID        | PK                               |                                                               |
| user_id             | UUID        | FK → users(id) ON DELETE CASCADE |                                                               |
| description         | TEXT        | NOT NULL                         | Internal note — required, no silent overrides                 |
| overrides           | JSONB       | NOT NULL                         | Partial feature object; only listed fields override base plan |
| expires_at          | TIMESTAMPTZ | NULL                             | NULL = permanent; expired rows ignored by feature resolver    |
| created_by_admin_id | UUID        | FK → users(id)                   | Staff member who created the override                         |
| created_at          | TIMESTAMPTZ | DEFAULT now()                    |                                                               |


### 5.7 scans


| Column        | Type                | Notes                    |
| ------------- | ------------------- | ------------------------ |
| id            | UUID PK             |                          |
| shop_id       | UUID FK → shops(id) |                          |
| scan_type     | TEXT                | `full`                   |
| status        | TEXT                | `queued`                 |
| total_items   | INTEGER             | Set on completion        |
| flagged_items | INTEGER             | Set on completion        |
| risk_score    | INTEGER             | 0–100, set on completion |
| triggered_by  | TEXT                | `manual`                 |
| started_at    | TIMESTAMPTZ         |                          |
| completed_at  | TIMESTAMPTZ         |                          |


### 5.8 scan_items


| Column         | Type                | Notes                                             |
| -------------- | ------------------- | ------------------------------------------------- |
| id             | UUID PK             |                                                   |
| scan_id        | UUID FK → scans(id) |                                                   |
| shop_id        | UUID FK → shops(id) | Denormalised for fast per-shop queries            |
| platform       | TEXT                | Denormalised from shops                           |
| content_id     | TEXT                | Platform's own ID                                 |
| content_type   | TEXT                | `product`                                         |
| field          | TEXT                | `body_html`                                       |
| content_hash   | TEXT                | SHA-256 — used for change detection between scans |
| ai_probability | NUMERIC(5,4)        | 0.0000–1.0000                                     |
| risk_level     | TEXT                | `none`                                            |
| status         | TEXT                | `open`                                            |
| regulation     | TEXT                | `EU AI Act Article 50`                            |
| flagged_claims | TEXT[]              | Array of flagged green claim phrases              |


**Indexes required:**

```sql
CREATE INDEX ON scan_items (shop_id, risk_level);
CREATE INDEX ON scan_items (shop_id, status);
CREATE INDEX ON scan_items (content_hash);
CREATE INDEX ON scan_items (scan_id);
```

### 5.9 audit_log


| Column             | Type                              | Notes                                                                       |
| ------------------ | --------------------------------- | --------------------------------------------------------------------------- |
| id                 | UUID PK                           |                                                                             |
| scan_item_id       | UUID FK → scan_items(id)          |                                                                             |
| shop_id            | UUID FK                           | Denormalised for fast per-shop export                                       |
| action             | TEXT                              | `human_reviewed`                                                            |
| reviewer_name      | TEXT                              | Required for `human_reviewed`                                               |
| reviewer_email     | TEXT                              | Documentation purposes                                                      |
| reviewed_at        | TIMESTAMPTZ                       | DEFAULT now()                                                               |
| content_hash       | TEXT                              | Hash of content at time of review — ties entry to specific reviewed version |
| notes              | TEXT                              | Optional reviewer notes                                                     |
| created_by_user_id | UUID FK → users(id) NULL          | NULL for API-triggered actions                                              |
| evidence_item_id   | UUID FK → evidence_items(id) NULL | Set when action = `claim_substantiated`; ON DELETE SET NULL                 |


**Index:** `CREATE INDEX ON audit_log (shop_id, created_at);`

### 5.10 api_keys


| Column           | Type                                  | Notes                                                      |
| ---------------- | ------------------------------------- | ---------------------------------------------------------- |
| id               | UUID PK                               |                                                            |
| shop_id          | UUID FK → shops(id)                   |                                                            |
| user_id          | UUID FK → users(id) ON DELETE CASCADE |                                                            |
| key_hash         | TEXT                                  | SHA-256 of key — never store plaintext                     |
| key_prefix       | TEXT                                  | First 8 chars shown in UI (e.g. `sk_live_ab12...`)         |
| name             | TEXT                                  | Human label                                                |
| scopes           | TEXT[]                                | `['scan:text', 'scan:image', 'audit:read', 'audit:write']` |
| monthly_limit    | INTEGER                               | NULL = unlimited                                           |
| calls_this_month | INTEGER                               | Rolling count (Redis primary, nightly Postgres sync)       |
| created_at       | TIMESTAMPTZ                           | DEFAULT now()                                              |
| last_used_at     | TIMESTAMPTZ                           |                                                            |


### 5.11 notifications


| Column     | Type                                  | Notes                                   |
| ---------- | ------------------------------------- | --------------------------------------- |
| id         | UUID PK                               |                                         |
| user_id    | UUID FK → users(id) ON DELETE CASCADE |                                         |
| type       | TEXT                                  | `scan_complete`                         |
| title      | TEXT NOT NULL                         | Short title shown in inbox list         |
| body       | TEXT                                  | Expanded description                    |
| link       | TEXT                                  | Internal URL (e.g. `/issues?risk=high`) |
| read_at    | TIMESTAMPTZ NULL                      | NULL = unread                           |
| shop_id    | UUID FK NULL                          | NULL for account-level notifications    |
| created_at | TIMESTAMPTZ                           | DEFAULT now()                           |


### 5.12 webhook_endpoints


| Column      | Type                                  | Notes                                                       |
| ----------- | ------------------------------------- | ----------------------------------------------------------- |
| id          | UUID PK                               |                                                             |
| user_id     | UUID FK → users(id) ON DELETE CASCADE |                                                             |
| url         | TEXT NOT NULL                         | HTTPS only — HTTP rejected at creation                      |
| secret_hash | TEXT NOT NULL                         | SHA-256 of signing secret; plaintext shown once on creation |
| events      | TEXT[]                                | `scan.completed`                                            |
| active      | BOOLEAN                               | DEFAULT true                                                |
| created_at  | TIMESTAMPTZ                           | DEFAULT now()                                               |


### 5.13 webhook_deliveries


| Column           | Type                                              | Notes                                                                     |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| id               | UUID PK                                           |                                                                           |
| endpoint_id      | UUID FK → webhook_endpoints(id) ON DELETE CASCADE |                                                                           |
| event_type       | TEXT NOT NULL                                     |                                                                           |
| payload          | JSONB NOT NULL                                    | Exact payload sent                                                        |
| http_status      | INTEGER NULL                                      | NULL if timeout/connection failure                                        |
| response_body    | TEXT NULL                                         | First 1,000 chars                                                         |
| response_time_ms | INTEGER NULL                                      |                                                                           |
| attempt_number   | INTEGER                                           | DEFAULT 1                                                                 |
| succeeded        | BOOLEAN NOT NULL                                  | True if status 2xx                                                        |
| attempted_at     | TIMESTAMPTZ                                       | DEFAULT now()                                                             |
| next_retry_at    | TIMESTAMPTZ NULL                                  | Exponential backoff: 5 min → 30 min → 2 hr → 8 hr. NULL after 4 failures. |


Retention: rows purged after 7 days by webhook-retry worker nightly cleanup.

### 5.14 evidence_items


| Column                    | Type                                  | Notes                                                                          |
| ------------------------- | ------------------------------------- | ------------------------------------------------------------------------------ |
| id                        | UUID PK                               |                                                                                |
| user_id                   | UUID FK → users(id) ON DELETE CASCADE | Account-owned — not tied to a specific shop                                    |
| evidence_type             | TEXT NOT NULL                         | `certification_api_verified`                                                   |
| title                     | TEXT NOT NULL                         | Merchant-assigned label                                                        |
| certification_body        | TEXT NULL                             | Registry code — references `certification_registry_configs.code`               |
| certificate_number        | TEXT NULL                             | Used for registry lookup                                                       |
| verification_status       | TEXT                                  | DEFAULT `pending`; `pending`                                                   |
| quality_tier              | TEXT NOT NULL                         | `verified`                                                                     |
| verified_at               | TIMESTAMPTZ NULL                      | Last successful registry verification                                          |
| next_verification_at      | TIMESTAMPTZ NULL                      | Scheduled re-check date                                                        |
| reference_url             | TEXT NULL                             | URL to certificate on public registry                                          |
| page_snapshot             | TEXT NULL                             | Stored snapshot of referenced page at time of linking                          |
| document_url              | TEXT NULL                             | Object storage URL for uploaded document                                       |
| document_hash             | TEXT NULL                             | SHA-256 of uploaded document — tampering detection                             |
| assertion_data            | JSONB NULL                            | `{ attribute, value, unit, measurement_method, auditor?, auditor_reference? }` |
| scope                     | TEXT                                  | DEFAULT `account`; `account`                                                   |
| scope_shop_id             | UUID FK → shops(id) NULL              | Set when scope = `shop`                                                        |
| scope_external_product_id | TEXT NULL                             | Platform product ID when scope = `product`                                     |
| notes                     | TEXT NULL                             |                                                                                |
| created_at                | TIMESTAMPTZ                           | DEFAULT now()                                                                  |
| updated_at                | TIMESTAMPTZ                           | @updatedAt                                                                     |


### 5.15 claim_evidence (join table)


| Column            | Type                                            | Notes                                                                |
| ----------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| id                | UUID PK                                         |                                                                      |
| scan_item_id      | UUID FK → scan_items(id) ON DELETE CASCADE      | The flagged claim                                                    |
| evidence_item_id  | UUID FK → evidence_items(id) ON DELETE RESTRICT | RESTRICT prevents deleting evidence still supporting an active claim |
| linked_by_user_id | UUID FK → users(id)                             | Recorded for audit                                                   |
| linked_at         | TIMESTAMPTZ                                     | DEFAULT now()                                                        |
|                   | UNIQUE                                          | (scan_item_id, evidence_item_id)                                     |


### 5.16 certification_registry_configs


| Column               | Type          | Notes                                                                                              |
| -------------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| id                   | UUID PK       |                                                                                                    |
| code                 | TEXT          | UNIQUE NOT NULL; e.g. `bcorp`, `fsc`, `carbon_trust`, `gots`, `rainforest_alliance`, `energy_star` |
| display_name         | TEXT NOT NULL |                                                                                                    |
| issuing_body         | TEXT NOT NULL |                                                                                                    |
| lookup_method        | TEXT NOT NULL | `api`                                                                                              |
| api_endpoint         | TEXT NULL     | Base URL of lookup API                                                                             |
| api_auth_type        | TEXT NULL     | `none`                                                                                             |
| url_pattern          | TEXT NULL     | URL template with `{cert_number}` placeholder                                                      |
| check_frequency_days | INTEGER       | DEFAULT 30                                                                                         |
| active               | BOOLEAN       | DEFAULT true                                                                                       |
| notes                | TEXT NULL     |                                                                                                    |


---

## 6. Platform Adapters

### 6.1 Platform Coverage & Launch Phases


| Platform               | Type             | Phase        | Adapter complexity | Distribution                                            |
| ---------------------- | ---------------- | ------------ | ------------------ | ------------------------------------------------------- |
| Shopify                | Ecommerce        | 1 — MVP      | Low                | Shopify App Store                                       |
| WooCommerce            | Ecommerce + Blog | 2            | Low                | WordPress Plugin Directory                              |
| WordPress (editorial)  | Blog/CMS         | 2            | Very low           | WordPress Plugin Directory (same plugin as WooCommerce) |
| Headless / Custom      | API tier         | 2 (parallel) | None               | Developer outreach                                      |
| BigCommerce            | Ecommerce        | 4            | Low                | BigCommerce App Marketplace                             |
| Wix eCommerce          | Ecommerce        | 4            | Medium             | Wix App Market                                          |
| Webflow                | CMS/Ecommerce    | 4            | Medium             | Webflow Apps Marketplace                                |
| Ghost                  | Blog/Newsletter  | 5            | Medium             | Direct / Ghost marketplace                              |
| Magento/Adobe Commerce | Ecommerce        | 5            | High               | Adobe marketplace                                       |


### 6.2 Adapter Specifications

#### Shopify


| Property        | Value                                                                                |
| --------------- | ------------------------------------------------------------------------------------ |
| Auth            | OAuth 2.0 via Shopify Partners App — offline access token                            |
| API version     | 2026-01 (GraphQL Admin API only — mandatory from April 2025)                         |
| Scopes          | `read_products`, `write_products`, `read_content`, `read_themes`, `write_themes`     |
| Label mechanism | `metafieldsSet` mutation — namespace `eu_ai_compliance`, key `ai_content_disclosure` |
| Front-end badge | Theme App Extension (Liquid block) — reads metafield                                 |
| Webhooks        | `PRODUCTS_CREATE`, `PRODUCTS_UPDATE`, `APP_UNINSTALLED`, `APP_SUBSCRIPTIONS_UPDATE`  |
| Billing         | Shopify Billing API (`appSubscriptionCreate`)                                        |
| Batch size      | 50 products/request (GraphQL cost: ~51 units; limit: 1,000/sec)                      |


#### WooCommerce / WordPress


| Property        | Value                                                                               |
| --------------- | ----------------------------------------------------------------------------------- |
| Auth            | API key + secret (Consumer Key + Consumer Secret) stored encrypted                  |
| API             | WooCommerce REST API v3 (`/wp-json/wc/v3/`) + WordPress REST API v2                 |
| Distribution    | WordPress plugin — merchant installs, enters credentials                            |
| Label mechanism | `PUT /wc/v3/products/{id}` with `meta_data: [{key: 'ai_disclosure', value: '...'}]` |
| Post labelling  | `POST /wp/v2/posts/{id}` with `meta: {ai_disclosure: '...'}`                        |
| Front-end badge | WordPress shortcode `[ai_disclosure_badge]` or Gutenberg block                      |
| Webhooks        | `product.created`, `product.updated` — registered on plugin install                 |
| Billing         | Stripe                                                                              |


#### BigCommerce


| Property        | Value                                                                      |
| --------------- | -------------------------------------------------------------------------- |
| Auth            | OAuth 2.0 via BigCommerce App Partner program                              |
| API             | BigCommerce REST Catalog API v3                                            |
| Label mechanism | `POST /v3/catalog/products/{id}/metafields` — namespace `eu_ai_compliance` |
| Front-end badge | Script Manager API — injects badge JS                                      |
| Webhooks        | `store/product/created`, `store/product/updated`                           |
| Note            | Catalyst stores require manual install (no Script Manager)                 |


#### Wix


| Property        | Value                                                            |
| --------------- | ---------------------------------------------------------------- |
| Auth            | OAuth 2.0 via Wix app installation flow                          |
| API             | Wix REST API — Stores Catalog (`queryProducts`)                  |
| Label mechanism | `updateProduct` endpoint                                         |
| Front-end badge | Velo (Wix JS framework) site code injection                      |
| Webhooks        | `wix.stores.v1.product.created`, `wix.stores.v1.product.updated` |


#### Webflow


| Property        | Value                                                                           |
| --------------- | ------------------------------------------------------------------------------- |
| Auth            | OAuth 2.0 via Webflow Apps framework                                            |
| API             | Webflow Data API v2 — CMS Collections                                           |
| Label mechanism | `PATCH /v2/collections/{id}/items/{item_id}` — writes `ai_disclosure` CMS field |
| Front-end badge | Custom code embed injected into CMS item templates                              |
| Webhooks        | `collection_item_created`, `collection_item_changed`                            |
| Scope           | Covers both ecommerce products AND editorial/blog collections                   |


#### Ghost


| Property        | Value                                                                      |
| --------------- | -------------------------------------------------------------------------- |
| Auth            | Ghost Admin API — staff access token (JWT-signed)                          |
| API             | Ghost Admin API v3                                                         |
| Label mechanism | `PUT /ghost/api/admin/posts/{id}` — injects disclosure HTML into post body |
| Webhooks        | **None** — uses polling (hourly cron via BullMQ repeat jobs)               |


#### Headless / Custom


| Property          | Value                                                            |
| ----------------- | ---------------------------------------------------------------- |
| Integration model | Merchant calls Disclo REST API — no adapter needed               |
| Auth              | API key per merchant — Bearer token                              |
| Billing           | Stripe — Enterprise API plans                                    |
| SLA               | P95 < 2s text scans; P95 < 5s image scans                        |
| Result delivery   | Synchronous (small payloads) or webhook callback (large batches) |
| White-label       | Agency accounts can rebrand dashboard and PDF reports            |


### 6.3 Webhook Signature Verification


| Platform    | Header                   | Algorithm                                          |
| ----------- | ------------------------ | -------------------------------------------------- |
| Shopify     | `X-Shopify-Hmac-Sha256`  | HMAC-SHA256 of raw body using `SHOPIFY_API_SECRET` |
| WooCommerce | `X-WC-Webhook-Signature` | Base64-encoded HMAC-SHA256                         |
| BigCommerce | `X-Webhook-Signature`    | HMAC-SHA256                                        |
| Wix         | No header                | Validate via Wix app secret in JWT                 |
| Stripe      | `Stripe-Signature`       | `stripe.webhooks.constructEvent()`                 |


All unverified webhooks return 401 before any processing.

---

## 7. Core Engine Modules

### 7.1 Text Classifier (`packages/core/src/classifiers/text.ts`)

```
Input:  plain text string (HTML stripped upstream)
Output: { aiProbability: number, riskLevel: 'none'|'review'|'high', sentenceBreakdown?, provider, classifiedAt }
```


| Risk threshold | Range     | Action                                             |
| -------------- | --------- | -------------------------------------------------- |
| none           | 0.00–0.49 | No action required                                 |
| review         | 0.50–0.74 | Merchant prompted to review; labelling recommended |
| high           | 0.75–1.00 | Label required under EU AI Act Article 50          |


Error handling: `ClassifierError('gptzero', cause)` on API failure. Retry once after 5s on 429.

### 7.2 Image Classifier (`packages/core/src/classifiers/image.ts`)

```
Input:  CDN image URL (string)
Output: { aiProbability, riskLevel, modelDetected?, imageUrl, provider, classifiedAt }
```

Same risk thresholds as text. On API failure: queue for retry with 1h backoff — **never mark as clean**.

**Incremental scan cost control**: Only scan images where `updated_at > last_scan_at`. Full scans on first install + once per quarter only.

### 7.3 Green Claims Checker (`packages/core/src/classifiers/claims.ts`)

**Pass 1 — Keyword rules engine** (all plans):


| Category                    | Flagged terms                                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| Environmental               | `eco-friendly`, `sustainable`, `green`, `planet-friendly`, `nature-safe`, `environmentally friendly`  |
| Carbon                      | `carbon neutral`, `carbon-neutral`, `carbon free`, `net zero`, `net-zero`, `climate positive`         |
| Materials                   | `biodegradable`, `compostable`, `recycled`, `upcycled`, `zero-waste`, `plastic-free`, `ocean plastic` |
| Certifications (unverified) | `certified organic`, `B-corp`, `fair trade` (when no certification URL present)                       |


**Pass 2 — LLM substantiation** (Pro+ only): Send flagged description to Claude with structured prompt. Returns `SUBSTANTIATED` or `BARE_ASSERTION` per claim.

**Output rule**: All green claims output is **merchant-facing only**. No consumer badge for unsubstantiated claims. The three outputs for any flagged claim are: (1) private remediation task in dashboard, (2) evidence record in audit log, (3) qualified rewrite suggestion (Pro+).

### 7.4 Risk Scorer (`packages/core/src/risk/`)

```typescript
const weightedPenalty = items.reduce((sum, item) => {
  if (item.risk_level === 'high')   return sum + 3;
  if (item.risk_level === 'review') return sum + 1;
  return sum;
}, 0);
const score = Math.round(100 - (weightedPenalty / (items.length * 3)) * 100);
// 100 = fully compliant, 0 = every item is high-risk
```

### 7.5 Audit Log (`packages/core/src/audit/append.ts`, `exemption.ts`)

Write-only at MVP. Records every compliance action with: action type, reviewer name (required for `human_reviewed`), SHA-256 content hash, timestamp, user ID.

**Editorial Exemption logic**: If `content_hash` on next scan differs from the hash stored in the most recent `human_reviewed` audit entry, the item reverts to `status: 'open'` and `exemption_expired` is logged.

**PDF export**: Phase 3. Includes SHA-256 integrity hash of entire log contents for regulatory submission.

### 7.6 Rewrite Engine (`packages/core/src/rewrite/`)

Plan gate: `rewrite_engine` (Pro+). Model: `claude-sonnet-4-6`.

Inputs: content string, content type, tone (`professional` | `casual` | `luxury` | `technical`), `preserve_seo` boolean.

Outputs: rewritten content, list of changes made, editorial note reminding merchant to review before publishing.

**Constraint**: Preserve all factual product specifications exactly. Do not hallucinate features or dimensions. Creates an `audit_log` entry when merchant applies the rewrite.

### 7.7 Plan Resolver (`packages/core/src/plans/resolver.ts`)

```
getFeatures(shopId) →
  1. Read Redis cache (key: plan:{plan_id}, TTL: 5 min)
  2. Cache miss → Postgres lookup
  3. If plan_override_id exists and not expired → merge override JSONB on top of base plan
  4. Return resolved feature set
```

Cache invalidated immediately on subscription update webhook.

### 7.8 Evidence System (`packages/core/src/evidence/`)

Six evidence types ordered by quality:

1. **API-verified certification** — live query against certification registry (B Corp, FSC, Carbon Trust, GOTS, Rainforest Alliance, ENERGY STAR)
2. **URL reference to public registry** — link to merchant's registry entry; periodically re-checked
3. **Structured quantified assertion** — specific measurable claim with measurement method
4. **Audit report reference** — third-party testing body (SGS, Bureau Veritas, Intertek, UL)
5. **Product page cross-reference** — snapshot of existing content page as evidence
6. **Document upload** — PDF/image; lowest quality tier; SHA-256 hash stored for tamper detection


| Quality tier | Evidence types                                             | FTC defensibility              |
| ------------ | ---------------------------------------------------------- | ------------------------------ |
| Verified     | API-verified, URL registry                                 | Strong — externally verifiable |
| Asserted     | Structured assertion (third-party audited), audit report   | Moderate                       |
| Declared     | Structured assertion (self-declared), page cross-reference | Weaker                         |
| On file      | Document upload                                            | Minimal — dated record only    |


Evidence suggestion engine: when a new claim is flagged, query the merchant's evidence library and surface relevant items based on certification body, claim category, product category, and scope.

One-to-many architecture: one evidence item supports many claims. A B Corp certification needs to be uploaded once, then applied to all products with sustainability claims with a single click each.

Document uploads are stored in Cloudflare R2, EU region, for GDPR compliance. R2 is S3-compatible with zero egress fees. A SHA-256 hash is computed at upload time. The object URL is stored in `evidence_items.document_url`. The hash is stored in `evidence_items.document_hash`. 

Required environment variables: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`.

---

## 8. API Specification

**Base URL**: `https://api.disclo.com/v1/`
**Auth**: `Authorization: Bearer sk_live_xxxxxxxxxxxxxxxxxxxxxxxx`
**Format**: JSON, UTF-8

### Middleware chain (applied in order to all routes)

```
Request → auth.ts (API key SHA-256 verify) → rateLimit.ts (100 req/sec burst, Redis token bucket) → quota.ts (monthly call quota check + increment) → route handler
```

### Endpoints


| Method | Path                   | Description                              | Plan gate |
| ------ | ---------------------- | ---------------------------------------- | --------- |
| POST   | `/v1/scan/text`        | Scan a single text item                  | All       |
| POST   | `/v1/scan/image`       | Scan a single image                      | All       |
| POST   | `/v1/scan/batch`       | Scan multiple items async (202 + job_id) | All       |
| POST   | `/v1/scan/rewrite`     | Request compliant rewrite                | Pro+      |
| GET    | `/v1/results/:scan_id` | Retrieve scan result                     | All       |
| POST   | `/v1/audit`            | Log a compliance action                  | All       |
| GET    | `/v1/audit/export`     | Download audit log (JSON or PDF)         | Basic+    |


### Rate limiting vs quota


| Mechanism             | Controls                                                       | Storage                               | Response                             |
| --------------------- | -------------------------------------------------------------- | ------------------------------------- | ------------------------------------ |
| Plan enforcement      | Feature availability (boolean) or hard scan/shop cap (numeric) | plans table + Redis 5-min cache       | 403 `PLAN_FEATURE_UNAVAILABLE`       |
| Per-second rate limit | Burst rate per user                                            | Redis token bucket (volatile)         | 429 with `Retry-After` header        |
| Monthly API quota     | Cumulative API calls per billing period                        | Redis counter + nightly Postgres sync | 429 `QUOTA_EXCEEDED` with `resetsAt` |


### Outbound webhook events


| Event             | Trigger                                |
| ----------------- | -------------------------------------- |
| `scan.completed`  | Single scan finishes                   |
| `batch.completed` | All items in batch processed           |
| `alert.high_risk` | New high-risk item on incremental scan |
| `audit.logged`    | Compliance action recorded             |


Delivery: HMAC-SHA256 signed payloads. Retry: 5 min → 30 min → 2 hr → 8 hr → abandoned after 4 failures.

---

## 9. Billing & Plan Enforcement

### 9.1 Billing providers


| Platform       | Provider            | Mechanism                                                    |
| -------------- | ------------------- | ------------------------------------------------------------ |
| Shopify        | Shopify Billing API | `appSubscriptionCreate` mutation; billed inside Shopify      |
| All others     | Stripe              | Recurring subscription via Stripe Checkout / Customer Portal |
| Enterprise API | Stripe              | Volume-based or committed spend; invoiced monthly            |


### 9.2 Shopify plan name mapping

```
'Disclo Free'    → 'free'
'Disclo Basic'   → 'basic'
'Disclo Pro'     → 'pro'
'Disclo Agency'  → 'agency'
```

### 9.3 Enforcement pattern

```typescript
// Applied BEFORE business logic on every premium route
await requireFeature(shopId, 'rewrite_engine');      // boolean gate → 403 if false
await requireWithinLimit(shopId, 'max_items_per_scan', currentUsage);  // numeric gate → 403 if exceeded
```

Never implement inline feature checks. All enforcement goes through `requireFeature()` and `requireWithinLimit()`.

---

## 10. Functional Requirements & Logic

### 10.1 Scanning

**Full scan**: Runs on first install and once per quarter. Fetches all items via adapter, fans out to all three classifiers, aggregates results.

**Incremental scan**: All other scheduled and webhook-triggered scans. Only items where `updated_at > last_scan_at` are re-classified. Dramatically reduces cost — a 1,000-product store adding 50 new products/month costs ~$0.50/mo in image classification vs $10 for a full re-scan.

**Manual scan**: Merchant-triggered from dashboard at any time. Counts against Free tier item limit.

**Webhook-triggered scan**: Single item scan triggered by `PRODUCTS_CREATE` or `PRODUCTS_UPDATE` webhooks.

### 10.2 Risk scoring matrix


| AI Probability | Risk Level | Required Action                           |
| -------------- | ---------- | ----------------------------------------- |
| 0.00–0.49      | `none`     | No action; item marked clean              |
| 0.50–0.74      | `review`   | Merchant prompted; labelling recommended  |
| 0.75–1.00      | `high`     | Label required under EU AI Act Article 50 |


### 10.3 Disclosure badge

**Canonical text options:**

- Short: `"This content was created with AI assistance."`
- Long: `"Some or all of this content (including images) was generated or significantly edited using artificial intelligence tools, in accordance with EU Regulation 2024/1689 (EU AI Act), Article 50."`

Merchant may customise wording provided it clearly communicates AI involvement. Disclosure must be **visible without user interaction** — cannot require a click-through.

**Machine-readable meta tag** (injected into `<head>` on all platforms):

```html
<meta name="ai-content-policy"
      content="ai-generated=true; generation-tool=user-declared; disclosure-standard=EU-AI-Act-Article-50" />
```

### 10.4 Editorial Exemption

Conditions for valid exemption:

1. A named human reviewer reviewed the specific version of the content
2. Review was substantive — not a click-through (minor typo fix is insufficient)
3. Date and identity of reviewer are logged
4. If content is later materially changed, the exemption must be re-established
5. Platform stores SHA-256 hash of content at time of review

When the merchant clicks "Mark as Human-Reviewed":

1. `reviewer_name` is required — throws `ValidationError` if absent
2. Audit log entry created with action `human_reviewed`, content hash, timestamp
3. `scan_item.status` → `'exempted'`
4. Item excluded from compliance score

On next scan: if `content_hash` ≠ stored audit hash → `scan_item.status` → `'open'` + `exemption_expired` audit entry.

### 10.5 Green claims workflow

When a claim is flagged:

1. Private remediation task created in merchant's dashboard (internal only — never consumer-facing)
2. Three action options shown: attach evidence, rewrite the claim, or remove it
3. Merchant attaches evidence → `claim_evidence` join table populated → audit log entry `claim_substantiated`
4. On Pro+: rewrite engine suggests a qualified version; applying it creates an audit entry

### 10.6 Evidence verification (background worker)

`workers/src/evidence/evidence-verifier-worker.ts` runs daily. For each `evidence_items` row where `next_verification_at <= now()`:

1. Load `certification_registry_configs` for the item's `certification_body`
2. Execute lookup (API call or URL check)
3. If verified → update `verification_status = 'verified'`, set `next_verification_at`
4. If not found or expired → update `verification_status = 'expired'` → re-open all linked `scan_items` → create notification

---

## 11. User Stories & Acceptance Criteria

### US-01: Shopify App Installation

**As a** Shopify merchant,
**I want to** install Disclo from the Shopify App Store,
**So that** I can start scanning my products for EU AI Act compliance.

**Done when:**

- OAuth flow completes without error on a Shopify development store
- Shop record created in `shops` table with encrypted access token
- Webhooks registered: `PRODUCTS_CREATE`, `PRODUCTS_UPDATE`, `APP_UNINSTALLED`
- Merchant redirected to dashboard after install

### US-02: Full Store Scan

**As an** authenticated merchant,
**I want to** scan all my products in one click,
**So that** I know which ones need AI disclosure labels.

**Done when:**

- "Start Scan" creates a `Scan` record (`status: queued`) and pushes BullMQ job
- All products fetched via GraphQL (paginated, all pages retrieved)
- Each product classified for text (GPTZero) and images (Hive) in parallel
- Scan completes with `risk_score` calculated and dashboard updated
- Merchant receives in-app notification and email summary

### US-03: Free Tier Limit Enforcement

**As a** Free plan merchant,
**I want to** see how many items are flagged,
**So that** I can decide whether to upgrade.

**Done when:**

- Scan stops after 50 items
- Dashboard shows flag count only (no fix actions)
- Upgrade prompt shown when merchant attempts to apply a label
- Prompt links to billing page

### US-04: Apply AI Disclosure Label

**As a** Basic+ merchant,
**I want to** apply an AI disclosure label to a flagged product,
**So that** my store is compliant with EU AI Act Article 50.

**Done when:**

- "Apply Label" writes `eu_ai_compliance.ai_content_disclosure` metafield to Shopify product
- Audit log entry created: action `labelled`, content hash, user ID, timestamp
- `scan_item.status` → `'labelled'`
- Compliance score recalculated in dashboard without page reload
- Theme App Extension renders disclosure badge on product page

### US-05: Editorial Exemption

**As a** Basic+ merchant who has substantively rewritten AI content,
**I want to** mark it as human-reviewed,
**So that** I have documentation of the Editorial Exemption.

**Done when:**

- "Mark as Human-Reviewed" requires reviewer name (form validation)
- Audit log entry created: action `human_reviewed`, reviewer name, content hash, timestamp
- `scan_item.status` → `'exempted'`
- Item excluded from compliance score
- If content changes on next scan (hash mismatch), item reverts to `'open'` and merchant is notified

### US-06: Pro Tier Rewrite

**As a** Pro merchant,
**I want to** request an AI-assisted rewrite of a flagged product description,
**So that** the content sounds human-written and reduces my compliance risk.

**Done when:**

- Plan gate enforced — 403 for Free/Basic merchants
- Rewrite engine returns content with `changesMade` list and `editorialNote`
- Rewritten content displayed for merchant review before applying
- Applying the rewrite creates an audit log entry
- Content is not automatically published — merchant reviews and applies

### US-07: Green Claim Remediation

**As a** merchant with products that use sustainability language,
**I want to** see which claims are flagged and substantiate them,
**So that** I comply with FTC Green Guides.

**Done when:**

- Green claims checker flags terms (e.g. "eco-friendly", "carbon neutral")
- Flagged claims appear in merchant dashboard as **internal** compliance tasks (not consumer-visible)
- Merchant can attach evidence from their evidence library
- Evidence suggestion engine shows relevant existing evidence items
- Audit log records the substantiation with evidence item reference
- No consumer-facing badge is ever shown for unsubstantiated claims

### US-08: Audit Log Export

**As a** Basic+ merchant,
**I want to** export my full audit log as a PDF,
**So that** I can present documentation to a regulator if investigated.

**Done when:**

- Export generates a signed PDF with all compliance actions
- PDF includes: shop domain, export date, line-by-line entries with content hashes, reviewer names, dates
- SHA-256 integrity hash of entire log included — post-export tampering is detectable
- Export declaration: `"This log was generated by Disclo and accurately represents compliance actions taken..."`

### US-09: Headless API Integration

**As a** developer with a custom headless store,
**I want to** call Disclo's REST API to scan content,
**So that** I can integrate compliance scanning into my own build pipeline.

**Done when:**

- API key generated on account creation
- `POST /v1/scan/text` returns risk level and AI probability synchronously
- `POST /v1/scan/batch` accepts up to 1,000 items, returns 202 + job_id
- Webhook callback fires when batch is complete
- Rate limit (100 req/sec) and monthly quota enforced
- API key hashed in storage — full key shown once at creation only

### US-10: Multi-Store Agency

**As an** agency managing multiple client stores,
**I want to** manage compliance for all clients from one dashboard,
**So that** I can deliver compliance as a service.

**Done when:**

- Agency plan allows connecting up to 3 stores under one account (unlimited for Enterprise)
- White-label PDF reports show agency branding
- Each store has independent compliance score and audit log
- One subscription covers all connected stores

---

## 12. Cost Analysis

### 12.1 Infrastructure costs (at 100 merchants)


| Service          | Provider        | Tier                    | Monthly cost     |
| ---------------- | --------------- | ----------------------- | ---------------- |
| App server       | Railway         | Starter                 | ~$5              |
| 4 × scan workers | Railway         | Starter × 4             | ~$20             |
| PostgreSQL 16    | Railway managed | 5 GB                    | ~$10             |
| Redis 7          | Railway managed | Shared                  | ~$5              |
| Email            | Resend          | Free (3,000/mo)         | $0               |
| Domain           | Namecheap       | disclo.com + thesiv.com | ~$2/mo amortised |
| **Total**        |                 |                         | **~$42/mo**      |


### 12.2 Detection API costs (per scan)


| API                        | Unit cost          | 1,000 products (text) | 1,000 products (images)                 |
| -------------------------- | ------------------ | --------------------- | --------------------------------------- |
| GPTZero Growth tier        | ~$0.0001/250 words | ~$0.40                | —                                       |
| Hive Moderation            | $0.001/image       | —                     | ~$10 (full scan) / ~$0.50 (incremental) |
| Anthropic Claude (rewrite) | ~$0.003/1K tokens  | —                     | —                                       |


**Revenue breakeven**: Basic plan ($29/mo) covers ~72 full text scans or ~3 full image scans before margin erosion. Incremental scanning is the primary cost control mechanism — full re-scans are quarterly only.

### 12.3 Free and open-source first


| Need           | Free option                      | Paid when                   |
| -------------- | -------------------------------- | --------------------------- |
| Monorepo       | Turborepo (OSS)                  | Never                       |
| ORM            | Prisma (OSS)                     | Never                       |
| Job queue      | BullMQ (OSS)                     | Never                       |
| Testing        | Vitest + Playwright (OSS)        | Never                       |
| Error tracking | Sentry (free tier: 5K errors/mo) | >5K errors/mo (~$26/mo)     |
| Email          | Resend (free: 3K/mo)             | >3K sends/mo (~$20/mo)      |
| CI/CD          | GitHub Actions (free tier)       | >2,000 min/mo               |
| Hosting        | Railway Dev plan                 | Scale past free tier limits |


---

## 13. Non-Functional Requirements

### 13.1 Performance


| Target                                      | Requirement              |
| ------------------------------------------- | ------------------------ |
| API response (text scan)                    | P95 < 2 seconds          |
| API response (image scan)                   | P95 < 5 seconds          |
| Dashboard load                              | < 1.5 seconds            |
| Scan completion (1,000 products, text only) | < 10 minutes             |
| Notification delivery after scan            | < 30 seconds             |
| Plan feature resolution                     | < 50ms (Redis cache hit) |


BullMQ concurrency settings:

- Text classifier worker: 10 concurrent jobs (matches GPTZero 10 req/sec limit)
- Image classifier worker: 5 concurrent jobs (cost management)

### 13.2 Availability


| Target           | Requirement                                     |
| ---------------- | ----------------------------------------------- |
| Uptime           | 99.5% (Railway SLA)                             |
| Scan queue       | Persistent — jobs survive worker restarts       |
| Database         | Railway managed Postgres with automatic backups |
| Failed jobs      | Retained in BullMQ failed queue for 7 days      |
| Webhook delivery | Retried up to 4 times with exponential backoff  |


### 13.3 Security


| Requirement          | Implementation                                                                    |
| -------------------- | --------------------------------------------------------------------------------- |
| Token encryption     | AES-256-GCM, 32-byte key in environment only — never in DB or Git                 |
| API key storage      | SHA-256 hash only — plaintext never stored after generation                       |
| Webhook verification | HMAC-SHA256 per platform; unverified requests return 401                          |
| Session security     | Min 32-byte session secret, validated at startup                                  |
| Data minimisation    | Full product content never stored — only AI probability, risk level, content hash |
| SQL injection        | Prisma parameterised queries throughout; raw SQL only in migrations               |
| HTTPS only           | Webhook endpoint URLs validated as HTTPS at creation; HTTP rejected               |
| Password hashing     | bcrypt, cost factor 12                                                            |
| MFA                  | TOTP available; secret encrypted at rest                                          |
| Stripe webhook       | `stripe.webhooks.constructEvent()` — no custom HMAC implementation                |


### 13.4 Privacy & Compliance


| Requirement                   | Implementation                                                                |
| ----------------------------- | ----------------------------------------------------------------------------- |
| GDPR data minimisation        | Product content never stored — only hashes and scores                         |
| GDPR deletion (merchant)      | Cascade delete all shop data within 48h of uninstall or account cancellation  |
| GDPR deletion (personal data) | Reviewer names/emails in audit log included in data export and deletion flows |
| Legal basis                   | Legitimate interest — compliance documentation                                |
| Retention                     | Audit log retained per merchant's compliance documentation needs              |
| CCPA                          | Same deletion flow covers CCPA deletion requests                              |


> On APP_UNINSTALLED (Shopify) or account deletion: cascade delete all rows for the shop within 48 hours, in a Prisma transaction covering audit_log, scan_items, scans, api_keys, notifications, shops, and users related tables. Reviewer names and emails in audit_log are merchant-controlled personal data — included in data export and deletion flows.

### 13.5 Scalability

The two-layer architecture means scaling follows a predictable pattern:

- New platform → new adapter (1–3 weeks) → zero core changes
- More merchants → more Railway worker instances → cost scales linearly at ~$10–15/100 merchants
- New regulation → update classifier or claims rules → zero adapter changes

---

## 14. Implementation Roadmap

### Phase 1 — Core + Shopify MVP

**Goal**: Chargeable product. Shopify App Store submission.


| Feature                                                     | Module                                  |
| ----------------------------------------------------------- | --------------------------------------- |
| Turborepo monorepo scaffold                                 | All packages                            |
| PostgreSQL schema + Prisma                                  | `packages/db`                           |
| Core types (ScanRequest, LabelInstruction, PlatformAdapter) | `packages/core/src/types.ts`            |
| GPTZero text classifier                                     | `packages/core/src/classifiers/text-classifier.ts` |
| Risk scorer                                                 | `packages/core/src/risk/`               |
| Audit log (write-only)                                      | `packages/core/src/audit/`              |
| Plan resolver + enforcement middleware                      | `packages/core/src/plans/`              |
| Scan orchestrator (BullMQ)                                  | `workers/src/scan/scan-orchestrator-worker.ts` |
| Shopify adapter (auth, fetcher, labeller, webhooks)         | `packages/adapters/shopify/`            |
| Shopify embedded dashboard (MVP screens)                    | `apps/embedded/shopify/`                |
| Notification system (in-app + basic email)                  | `packages/core/src/notifications/`      |
| Free + Basic plan seed                                      | `packages/db/prisma/seed.ts`            |
| Railway deployment + GitHub Actions CI                      | `infra/`, `.github/`                    |


**Deliverable**: App installs on Shopify dev store. Merchant can scan products and see risk results. Basic tier paywall functional.

### Phase 2 — WooCommerce + Headless API


| Feature                                  | Module                                                           |
| ---------------------------------------- | ---------------------------------------------------------------- |
| Hive Moderation image classifier         | `packages/core/src/classifiers/image.ts`                         |
| Green claims checker (keyword pass)      | `packages/core/src/classifiers/claims.ts`                        |
| WooCommerce + WordPress adapter          | `packages/adapters/woocommerce/`, `packages/adapters/wordpress/` |
| PHP WordPress plugin                     | `plugins/wordpress/`                                             |
| Unified Public API (Hono, all endpoints) | `apps/api/`                                                      |
| Headless adapter (no-op)                 | `packages/adapters/headless/`                                    |
| Stripe billing integration               | `packages/core/src/billing/`                                     |
| Evidence system (basic)                  | `packages/core/src/evidence/`                                    |


### Phase 3 — Pro Tier + Rewrite Engine


| Feature                                      | Module                                             |
| -------------------------------------------- | -------------------------------------------------- |
| Rewrite engine (Claude API)                  | `packages/core/src/rewrite/`                       |
| Green claims LLM substantiation (Claude API) | `packages/core/src/classifiers/claims.ts` (Pass 2) |
| Monthly auto-scan (BullMQ repeat jobs)       | `workers/src/maintenance/auto-scan-worker.ts`     |
| Audit log PDF export                         | `packages/core/src/audit/`                         |
| Compliance score trending                    | `apps/embedded/shopify/`                           |
| Pro + Agency plan activation                 | `packages/db/prisma/seed.ts`                       |
| Evidence verifier worker                     | `workers/src/evidence/evidence-verifier-worker.ts` |


### Phase 4 — BigCommerce + Wix + Webflow

One week per adapter. Marketplace submission per platform. Multi-store dashboard for Agency tier.

### Phase 5 — Ghost + Scale (Weeks 21+)

Ghost adapter (polling-based). Central dashboard (`app.disclo.com`). Multi-language support. Affiliate/partner programme. Magento enterprise adapter.

---

## 15. Constraints & Risks


| Risk                                           | Likelihood | Impact   | Mitigation                                                                                                      |
| ---------------------------------------------- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| GPTZero accuracy on hybrid content             | Medium     | Medium   | Conservative 0.75 threshold; `review` band at 0.50–0.74 keeps merchant in control                               |
| Hive API cost overrun on Basic plan            | Medium     | High     | Incremental scanning enforced; full scans quarterly only; cost warning before first full image scan             |
| Shopify App Store review rejection             | Low–Medium | High     | Follow Shopify's review checklist strictly; test on dev store before submission; allow 5–10 business day buffer |
| EU AI Act enforcement date slippage            | Low        | Low      | All other obligations (FTC, Florida, New York) remain active                                                    |
| API breaking changes (Shopify 2026-04 version) | Medium     | Medium   | Version-lock adapter to `2026-01`; Evolutionist agent monitors quarterly Shopify releases                       |
| ENCRYPTION_KEY rotation                        | Low        | Critical | Document rotation procedure; never rotate without a migration plan for existing tokens                          |
| BullMQ job loss on Redis restart               | Low        | Medium   | Railway managed Redis has persistence; BullMQ jobs also checkpointed to Postgres scan record                    |
| Rewrite engine hallucinating product specs     | Medium     | High     | System prompt explicitly instructs Claude to preserve all factual specs; Executor tests this                    |
| WordPress plugin PHP compatibility             | Medium     | Low      | Target PHP 8.1+; test on common hosting environments                                                            |
| Ghost polling latency                          | Medium     | Low      | Ghost lacks webhooks; hourly polling is the accepted trade-off for Phase 5 platform                             |


---

## 16. Guardrails

These rules prevent over-engineering. Agents must not violate them without explicit approval from Reuben.

### Architecture guardrails

- **No microservices** — the architecture is a modular monolith in a monorepo. Do not split packages/core into separate deployed services.
- **No GraphQL** — the public API uses REST (Hono). GraphQL adds complexity with no benefit for this use case.
- **No event sourcing** — the audit log is an append-only table, not an event bus. Do not introduce Kafka, RabbitMQ, or similar.
- **No custom auth framework** — use Shopify's built-in session handler for Shopify. Use Lucia or NextAuth for direct login. Do not build a custom session/JWT system.
- **No separate caching service** — Redis is already provisioned for BullMQ. Use the same Redis instance for plan caching, rate limiting, and quota counters.

### Database guardrails

- **No raw SQL in application code** — Prisma throughout. Raw SQL only in migration files.
- **No schema changes without migration files** — never use `prisma db push` in staging or production.
- **No multi-tenant row-level security in Postgres** — shop isolation is enforced at the application layer via `shop_id` on all queries. RLS adds complexity without benefit at current scale.

### Complexity guardrails

- **No abstract factory patterns in adapters** — each adapter is a plain TypeScript object implementing the four-method interface. No class hierarchies, no base classes.
- **No feature flags system** — feature gates use the `plans` table. Do not introduce LaunchDarkly or a custom flags table.
- **No message bus** — BullMQ queues are the only async communication mechanism. Do not add a pub/sub layer.
- **No pre-optimisation** — do not add caching, indexing, or partitioning before measuring a real performance problem. The exceptions are the indexes in Section 5.8, which are known requirements.

### Scope guardrails

- **No content storage** — product descriptions and images are processed in memory and discarded. Only scores and hashes are persisted. This is non-negotiable (GDPR + cost).
- **No legal advice** — Disclo is compliance infrastructure, not a legal guarantee. In-app copy must not claim to guarantee compliance or provide legal advice.
- **Green claims output is always merchant-facing** — the system must never render a consumer-visible badge or label that characterises a claim as "unsubstantiated" or "potentially false".
- **No cross-adapter imports** — `packages/adapters/shopify` must not import from `packages/adapters/woocommerce` or any other adapter. Ever.

---

*End of REQUIREMENTS.md — v1.0 — March 2026*