# Agent operations (how we run the plan)

This matches **Phase 8** and the **agent roster** in `.cursor/plans/disclo_authoritative_execution.plan.md`. It is a **way to split ownership and gates**, not a mandate to run seven separate AI instances.

## Decision (best practice)

- **One human or one chat can wear multiple hats** as long as you respect **scope** (e.g. no adapter imports in `packages/core`) and **gates** (Security + QA awareness on webhooks, auth, billing, delete/export).
- **Parallel work** is easiest when you use **separate Cursor chats** (or teammates) for **different epics**, with shared contracts (`PlatformAdapter`, config, Prisma schema).
- **Cursor “agents”** here means: **prompt + rules + commands** that put the model into a consistent role. Linear remains the **system of record** for what to do next.

### Sprint 1 parallel deployment (five chats at once)

Open **five Composer/Agent chats** at the same time. In each chat, run **one** slash command, then paste the **Linear issue id** and **allowed paths** so edits never collide:

| Chat | Command | Owns (do not edit outside this) |
| --- | --- | --- |
| 1 | `/agent-backend` | `disclo/packages/core`, `disclo/workers` (core + workers only) |
| 2 | `/agent-api-integrations` + `/agent-shopify-ui` | `disclo/packages/adapters`, `disclo/apps/embedded/shopify` |
| 3 | `/agent-sec-comp` | `docs/security/*`, webhook/auth threat alignment; call `/security-review` when scope grows |
| 4 | `/agent-qa` | `docs/QA_TRACEABILITY.md`, test IDs, E2E notes |
| 5 | `/agent-infra` | CI, Railway, Supabase/Redis wiring, `disclo/infra`, workflows |

**Rules:** one **active** Linear issue per chat until merged (or hand off in `docs/SESSION.md`). Same branch `dev`; small PRs per epic. Full playbook also lives in `c:\Users\samue\.cursor\plans\sprint_1_agent_deployment_cf27b189.plan.md`.

A **single** chat can still ship a **large batch** of core tickets in one pass (e.g. BE-06 through BE-09) when you explicitly ask for that scope; throughput is a prompt/scope choice, not a one-ticket-at-a-time rule.

## Roles (maps to Linear epics)


| Role                          | Scope                                  | Cursor trigger                         |
| ----------------------------- | -------------------------------------- | -------------------------------------- |
| Planning / product            | Backlog order, DoR/DoD, dependencies   | `/agent-planning`                      |
| Platform / infra              | CI, Railway, Supabase, Redis, env      | `/agent-infra`                         |
| Backend / core                | `packages/core`, workers, Prisma usage | `/agent-backend`                       |
| Shopify UX                    | `disclo/apps/embedded/shopify`         | `/agent-shopify-ui`                    |
| API / integrations (Phase 2+) | `disclo/apps/api`, adapters            | `/agent-api-integrations`              |
| Security & compliance         | SEC/COMP issues, reviews               | `/agent-sec-comp` + `/security-review` |
| QA                            | Traceability, E2E, release report      | `/agent-qa`                            |


## How to trigger a specific agent anytime

1. **Slash command (preferred)**
  In Cursor chat, type `/` and choose:
  - `agent-backend`, `agent-shopify-ui`, `agent-qa`, `agent-planning`, `agent-infra`, `agent-api-integrations`, `agent-sec-comp`  
   Then add your task (e.g. “Implement BE-05 tests first, then classifier”).
2. **New chat + command**
  Open a **new Composer/Agent chat**, run the same `/agent-`* command, then paste the **Linear issue id** (e.g. REU-62) so context stays focused.
3. **Rules in scope**
  For deep work, `@`-mention files under `.cursor/rules/` (e.g. `core-engine.mdc`, `shopify.mdc`, `security.mdc`) in addition to the command.
4. **Humans / handoff**
  Update `docs/SESSION.md` when switching streams so the next session knows active branch, blockers, and which Linear epic is in progress.

## Sprint order (from plan)

1. Security / authenticity foundations
2. Scan + regulation core path
3. Remediation / evidence
4. Billing + notifications
5. Release hardening

## Artifacts (Sprint 0+)

- Threat model: `docs/security/threat-model.md`  
- Secrets: `docs/security/secrets-runbook.md`  
- Incident response: `docs/security/incident-response.md`  
- QA matrix: `docs/QA_TRACEABILITY.md`  
- Phase 1 sprint checklist (Cursor plan): `.cursor/plans/disclo_phase1_sprints.plan.md` (stub link: `docs/SPRINT_PLANS.md`)

## Git branches

- **`dev`** — Default for implementation; CI on **every push**; also runs on **PRs to `main`** (release path). No staging server — run `pnpm lint` / `typecheck` / `test` / `build` from `disclo/` locally before push.
- **`main`** — Minimal until production release; merges only via PR from **`dev`**. Production deploy (e.g. Railway) should track **`main`** when you promote. Details: `docs/GITHUB_BRANCHES.md`, `CLAUDE.md`.

## Sprint 0 task routing (agents)

Full table (validate-before-create, CLI/MCP proof where noted): **`.cursor/plans/disclo_phase1_sprints.plan.md` → section “Sprint 0 — agent routing.”** Short map:

| Area | Command |
| --- | --- |
| CI on `dev`, SEC-06 audit job, Railway/Supabase/Redis/keep-alive, INFRA-01–11 | `/agent-infra` |
| Threat ingress, secrets parity, incident doc, Linear SEC/COMP | `/agent-sec-comp` |
| QA traceability rows (first E2E paths) | `/agent-qa` |
| Webhook contract + workers (with sec-comp) | `/agent-backend` |  

## Sprint plan upkeep (agents, not manual human ticks)

- **`.cursor/plans/disclo_phase1_sprints.plan.md`** lists **one YAML todo per checklist row**; that is what fills the Cursor Plan **To-dos** panel (markdown task lists alone are not enough). Todos must stay **nested** under `todos:` with `  - id:` / `    content:` / `    status:` — if Cursor prepends a stub block (`name: ""`, `todos: []`) or flattens the list, fix the file or the panel stays empty and the ids can render as plain text above the title in preview.
- When a row is **done** (Linear AC met, merged): set **`status: completed`** on the matching YAML `id` **and** update the body line to `- [x] ~~task text~~ (`id`)`.
- **INFRA-*** issues: do **not** mark complete for “we added files.” Use the sprint plan **Maintainer policy → INFRA done criteria** (real DB migrate path, Redis/BullMQ proof, Railway deploy green, CI on **`dev` + PRs to `main`**, keep-alive run succeeded, etc.).
- Set the **Linear** issue **Done** in the same delivery window.
- Humans should not be expected to maintain todos; they may fix mistakes if Plan, body, and Linear disagree.

## Tooling (agent behavior)

Before reporting “environment broken,” verify common tooling:

- **`pnpm: command not found`** — On Windows, run `where pnpm`. If missing, install (`npm install -g pnpm` or enable Corepack per Node docs). Retry `pnpm typecheck` from `disclo/`.
- **`turbo` cannot find package manager** — Usually means `pnpm` is not on `PATH` for the shell Turbo spawned; fix `pnpm` first.
- **`node` missing** — Stop and tell the user to install Node LTS; do not assume simulated environments.

Same checks apply to `pnpm db:generate`, `pnpm db:migrate`, and CI parity.

