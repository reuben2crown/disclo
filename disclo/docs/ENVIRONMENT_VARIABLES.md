# Environment variables (disclo monorepo)

**Local file:** `disclo/.env` (gitignored). Copy from your password manager or team vault. Do not commit secrets.

**Validation:** Server-side keys used by `loadServerEnv()` are defined in `packages/core/src/config.ts` (Zod). Other tools (Shopify CLI, Prisma, Vite) read `process.env` directly where noted below.

## Core runtime (`loadServerEnv`)

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | `development` \| `production` \| `test` |
| `DEFAULT_LOCALE` | UI default when no `disclo_locale` cookie and `Accept-Language` is missing or unsupported |
| `DATABASE_URL` | Postgres URL (pooler recommended for app runtime) |
| `DIRECT_URL` | Direct/session DB URL for Prisma migrations when `DATABASE_URL` uses PgBouncer transaction mode |
| `REDIS_URL` | BullMQ / plan cache (e.g. Upstash `rediss://…`) |
| `ENCRYPTION_KEY` | AES-256-GCM encrypt token at rest (minimum 32 chars) |
| `APP_URL` | Public app base (some services) |
| `LOG_LEVEL` | Pino level |
| `GPTZERO_API_KEY` | Text AI detection |
| `HIVE_API_KEY` | Image detection |
| `ANTHROPIC_API_KEY` | Claims / future rewrite |
| `RESEND_API_KEY` | Transactional email |
| `RESEND_FROM_EMAIL` | From address |
| `DODO_PAYMENTS_API_KEY` | Non-Shopify billing |
| `DODO_PAYMENTS_WEBHOOK_KEY` | Dodo webhook signing |
| `DODO_PAYMENTS_ENVIRONMENT` | `test` \| `live` |
| `R2_*` | Cloudflare R2 evidence uploads |
| `SHOPIFY_API_KEY` | Embedded app OAuth |
| `SHOPIFY_API_SECRET` | OAuth + webhooks |
| `SHOPIFY_APP_URL` | OAuth redirect base |
| `SESSION_SECRET` | Remix session signing |
| `INTERNAL_API_SECRET` | `POST /internal/monthly-scan` and similar |
| `SUPPORT_ALERT_WEBHOOK_URL` | Optional ops webhook |
| `SENTRY_DSN` | Error tracking |
| `POSTHOG_API_KEY` | Product analytics |
| `MERCHANT_SUPPORT_EMAIL` | Optional support line for merchant-facing errors |

## Shopify embedded app (Remix)

These are typically duplicated or symlinked in `apps/embedded/shopify/.env` if you run the app from that directory; otherwise `pnpm dev` from `disclo/` loads monorepo `.env`.

| Variable | Purpose |
| --- | --- |
| `SHOPIFY_API_KEY` | App API key |
| `SHOPIFY_API_SECRET` | App secret |
| `SCOPES` or `SHOPIFY_SCOPES` | Comma-separated OAuth scopes (`shopify.server.ts` prefers `SCOPES`, falls back to `SHOPIFY_SCOPES`) |
| `SHOPIFY_APP_URL` | Must match Partner Dashboard URLs |
| `SESSION_SECRET` | Session encryption |
| `SHOP_CUSTOM_DOMAIN` | Optional custom shop domain list |

## Local Shopify CLI (`scripts/dev-app.mjs`)

| Variable | Purpose |
| --- | --- |
| `SHOPIFY_DEV_LOCALHOST_PORT` | Optional `--localhost-port` |
| `SHOPIFY_DEV_THEME_APP_EXTENSION_PORT` | Optional theme extension port (e.g. `9294`) |
| `SHOPIFY_VITE_HMR_PORT` or `VITE_HMR_PORT` | Vite HMR websocket port |

## CI-only (not in local `.env` usually)

| Variable | Purpose |
| --- | --- |
| `SUPABASE_DATABASE_URL` | Keep-alive workflow; see `.github/workflows/supabase-keep-alive.yml` |

## Team-specific keys

If your team adds keys (extra LLM providers, etc.), document them here or in `docs/SESSION.md` so secrets parity reviews stay complete.
