# Secrets runbook

**Status:** Sprint 0 template — fill rotation windows as ops mature. **Linked Linear:** SEC-02.

## Principles

- Secrets live only in Railway, GitHub Actions, Shopify Partner dashboard, and other host secret stores — never in git.
- Required vars are validated at startup via `packages/core/src/config.ts` (Zod).

## Inventory (maintain with code changes)

**Parity:** Every key in `disclo/infra/env.example` must appear below (or be explicitly marked deprecated). CI-only secrets are listed separately.

### `disclo/infra/env.example` (monorepo runtime)

| Variable | Purpose | Where stored | Rotation trigger |
| --- | --- | --- | --- |
| `DATABASE_URL` | Postgres (Supabase); Prisma | Railway, local `.env` | Pooler/direct URL change; credential rotation |
| `REDIS_URL` | BullMQ, cache (Upstash) | Railway, local `.env` | Provider rotation |
| `ENCRYPTION_KEY` | AES-256-GCM (`packages/core` crypto) | Railway, local `.env` | Compromise suspicion; annual review |
| `APP_URL` | Public app base URL | Railway, local `.env` | Domain change |
| `NODE_ENV` | Runtime mode | Railway, local | N/A |
| `GPTZERO_API_KEY` | Text detection | Railway, local `.env` | Vendor rotation |
| `HIVE_API_KEY` | Image detection | Railway, local `.env` | Vendor rotation |
| `ANTHROPIC_API_KEY` | LLM (claims / rewrite) | Railway, local `.env` | Vendor rotation |
| `RESEND_API_KEY` | Transactional email | Railway, local `.env` | Vendor rotation |
| `RESEND_FROM_EMAIL` | From address | Railway, local `.env` | Brand/domain change |
| `DODO_PAYMENTS_API_KEY` | Non-Shopify billing | Railway, local `.env` | Vendor rotation |
| `DODO_PAYMENTS_WEBHOOK_KEY` | Dodo webhook verification | Railway, local `.env` | Vendor rotation |
| `DODO_PAYMENTS_ENVIRONMENT` | test / live | Railway, local `.env` | Go-live |
| `R2_ACCOUNT_ID` | Cloudflare R2 | Railway, local `.env` | Account change |
| `R2_ACCESS_KEY_ID` | R2 S3-compatible key | Railway, local `.env` | Key rotation |
| `R2_SECRET_ACCESS_KEY` | R2 secret | Railway, local `.env` | Key rotation |
| `R2_BUCKET_NAME` | Evidence bucket | Railway, local `.env` | Bucket migration |
| `R2_PUBLIC_URL` | Public asset base | Railway, local `.env` | CDN change |
| `SHOPIFY_API_KEY` | OAuth (embedded app) | Partner dashboard, Railway, Shopify app `.env` | Partner rotation |
| `SHOPIFY_API_SECRET` | OAuth + webhook HMAC | Partner dashboard, Railway, Shopify app `.env` | Partner rotation |
| `SHOPIFY_SCOPES` | Install scopes | Partner / `shopify.app.toml` | Scope change |
| `SHOPIFY_APP_URL` | OAuth callbacks | Railway, Shopify app `.env` | Domain change |
| `SESSION_SECRET` | Remix / session signing | Railway, Shopify app `.env` | Leak or staff change |
| `INTERNAL_API_SECRET` | App-to-API (if used) | Railway, local `.env` | Leak or staff change |
| `LOG_LEVEL` | Pino verbosity | Railway, local `.env` | Ops tuning |
| `SUPPORT_ALERT_WEBHOOK_URL` | Optional ops webhook | Railway, local `.env` | Endpoint change |
| `SENTRY_DSN` | Error tracking | Railway, local `.env` | Project rotation |
| `POSTHOG_API_KEY` | Product analytics | Railway, local `.env` | Project rotation |

### CI / GitHub Actions only

| Variable | Purpose | Where stored | Notes |
| --- | --- | --- | --- |
| `SUPABASE_DATABASE_URL` | Postgres ping for keep-alive | GitHub Actions secrets | See `.github/workflows/supabase-keep-alive.yml`; not in `env.example` by design |

## Rotation procedure (generic)

1. Generate new secret in provider UI or crypto-safe generator (`ENCRYPTION_KEY`: 32-byte compatible format per `crypto.ts` docs).
2. Add new secret alongside old in deployment (dual-read window) where the system supports it; otherwise schedule brief maintenance.
3. Deploy apps and workers that consume the secret.
4. Revoke old secret at source.
5. Record date and ticket in Linear.

## Rollback

- Keep previous Railway revision deployable for 24–48h after risky rotation.
- Document breaking rotations in `docs/SESSION.md`.
