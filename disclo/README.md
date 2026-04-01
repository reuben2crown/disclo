# Disclo

EU AI Act / multi-regulation compliance scanner — monorepo (Phase 1: Shopify).

## Git

Work on **`dev`**. The **`main`** branch at the repo root is reserved for production promotion (PR from `dev` only). CI runs on **`dev`**.

## Prerequisites

- Node.js 22+
- pnpm 9 (`corepack enable pnpm`)

## Setup

```bash
# If you do not already have .env (gitignored), create it from the template:
cp infra/env.example .env
# Fill DATABASE_URL, REDIS_URL, ENCRYPTION_KEY (64 hex chars), API keys, Shopify vars, etc.

# Shopify app (from repo root paths):
# cp apps/embedded/shopify/.env.example apps/embedded/shopify/.env

pnpm install
pnpm --filter @disclo/db exec prisma migrate deploy
pnpm db:seed
```

## Scripts

| Command            | Description                |
| ------------------ | -------------------------- |
| `pnpm dev`         | Turbo dev (all packages)   |
| `pnpm build`       | Production build           |
| `pnpm test`        | Vitest across workspaces   |
| `pnpm lint`        | ESLint                     |
| `pnpm typecheck`   | TypeScript                 |
| `pnpm db:migrate`  | Prisma migrate (dev)       |
| `pnpm db:seed`     | Seed plans + registries    |

## Layout

- `apps/embedded/shopify` — Remix embedded app (`@shopify/shopify-app-remix`, Polaris)
- `packages/core` — Classifiers, regulations, risk, plans, audit, email, R2 (`@disclo/core/server` for server-only)
- `packages/db` — Prisma schema + migrations
- `packages/adapters` — Platform adapters (Shopify stub)
- `workers` — BullMQ workers (scan, classifiers, reports, evidence, auto-scan)
- `infra` — `env.example`, Railway config

## Shopify

Configure `shopify.app.toml` and Partner Dashboard URLs. Theme extension: `apps/embedded/shopify/extensions/disclosure-badge`.

Memory session storage is dev-only; use `@shopify/shopify-app-session-storage-prisma` for production.
