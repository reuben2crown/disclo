# CLAUDE.md

## Project
Disclo is a compliance SaaS for AI-content disclosures and green-claims substantiation across ecommerce and publishing platforms.

## Workspace vs Monorepo Root
- Workspace root: `c:/Dev/disclo-apps`
- Monorepo root: `c:/Dev/disclo-apps/disclo`

## Key Directories
- `disclo/apps/embedded/shopify` Shopify embedded app
- `disclo/apps/api` Unified Hono API
- `disclo/packages/core` Platform-agnostic compliance engine
- `disclo/packages/adapters` Platform adapters only
- `disclo/packages/db` Prisma schema and migrations
- `disclo/workers` BullMQ workers
- `docs/SESSION.md` Session handoff file (must update each meaningful session)
- `disclo/.env` Local secrets (gitignored); copy from `disclo/infra/env.example` on a new machine
- `disclo/apps/embedded/shopify/.env` Shopify app env (gitignored); copy from `.env.example` there

## Non-Negotiable Architecture Rules
1. `packages/core` must never import from `packages/adapters`.
2. No cross-adapter imports.
3. No raw SQL in app code (migrations only).
4. No secrets in code, logs, or client bundles.
5. Shopify billing for Shopify; Dodo Payments for non-Shopify.

## Runtime Stack
- App/API/Workers: Railway
- Postgres: Supabase (free tier for POC + keep-alive workflow)
- Redis: Upstash
- Storage: Cloudflare R2
- Email: Resend
- Error tracking: Sentry
- Product analytics: PostHog

## Commands (run in `disclo/`)
- `pnpm install`
- `pnpm build`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:seed`

## Session Handoff Protocol
- Read `docs/SESSION.md` at session start.
- Update `docs/SESSION.md` before ending after meaningful work.
- Include status, completed tasks, decisions, blockers, and exact next steps.
