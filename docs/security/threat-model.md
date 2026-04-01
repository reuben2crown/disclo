# Disclo threat model (draft)

**Status:** Sprint 0 draft — expand as architecture changes. **Owner:** Security / engineering. **Linked Linear:** SEC-01.

## Trust boundaries

| Zone | Components | Trust level |
| --- | --- | --- |
| Merchant browser | Shopify Admin embedded app (Remix) | Untrusted input; session via Shopify |
| Public internet | Shopify webhooks, future Dodo webhooks, future Hono API | Untrusted; must verify every request |
| Application | `disclo/apps/embedded/shopify`, `disclo/apps/api`, `disclo/workers` | Trusted code; validate all inputs at boundary |
| Data | Supabase Postgres, Upstash Redis, R2, Resend | Credentials via env; least privilege |

## Data classification

| Class | Examples | Handling |
| --- | --- | --- |
| Public | Marketing copy, regulation summaries on website | No special controls |
| Internal | Shop IDs, scan metadata, non-PII analytics keys | Access by authenticated tenant context only |
| Confidential | OAuth tokens, API key material, webhook secrets | Encrypt at rest (AES-256-GCM); never log values |
| Sensitive | Merchant email, reviewer name, payment-adjacent ids | Minimize retention; include in export/delete scope (COMP-02) |

## Assets

- Shopify access tokens and session data
- Future API keys (hashed + prefix only in DB)
- Job payloads in Redis / BullMQ (no raw product body storage per governance rules)
- Evidence documents in R2 (hashes in DB)
- Audit log append-only trail

## Threats and mitigations (summary)

| ID | Threat | Mitigation | Verification |
| --- | --- | --- | --- |
| T1 | Forged Shopify webhook | HMAC-SHA256 on raw body; reject with 401 | SEC-03 tests |
| T2 | Forged Dodo webhook | SDK unwrap + idempotency key | SEC-03 tests |
| T3 | Token theft from DB | AES-256-GCM; server-only decrypt | SEC-04 tests |
| T4 | Cross-tenant API access | Session / API key scoped to shop or tenant; integration tests | SEC-05 |
| T5 | Replay of webhooks | Event id dedupe + timestamp window | SEC-03 |
| T6 | Queue poisoning (SSRF, huge payloads) | Validate URLs; size limits; worker timeouts | Ongoing review |
| T7 | Privilege escalation | Plan enforcement middleware; no inline checks | Code review + tests |
| T8 | Secret in repo or logs | CI secret scan; logging rules | SEC-06 |

## Ingress map (update when routes change)

**Audited against repo (Sprint 0):** Remix file-based routes under `disclo/apps/embedded/shopify/app/routes/` and `shopify.app.toml` webhook subscriptions.

| Entry | Path / surface | Auth / verification |
| --- | --- | --- |
| Shopify Admin embedded UI | Remix app (default `app._index`, `app.*`) | `shopify.authenticate.admin` (session token / OAuth per Shopify Remix template) |
| App-specific webhooks (toml) | `POST /webhooks/app/uninstalled`, `POST /webhooks/app/scopes_update` | `authenticate.webhook` (`@shopify/shopify-app-remix`); HMAC on raw body |
| Generic webhook dispatcher | `POST` via `app/routes/webhooks.tsx` | Same; topics registered in toml or Admin API |
| Future unified API (stub) | `disclo/apps/api` — e.g. `POST /v1/webhooks-inbound` | Must add signature verification before any handler work (Phase 2) |

- Shopify OAuth: Shopify platform only; state/nonce as per Shopify docs
- Shopify webhooks: HMAC mandatory before handler (see `verifyShopifyWebhookHmac` contract in `@disclo/core` for the raw-body formula)
- Future `apps/api` v1: API key or internal secret; rate limit; quota; plan middleware

## Review cadence

- Update this document when adding a new external integration or auth method
- Re-read before Phase 1 release candidate
