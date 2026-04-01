# Phase 1 sprints (checklist location)

The Phase 1 sprint checklist is a **Cursor plan file** (checkboxes + sprint structure):

**[`.cursor/plans/disclo_phase1_sprints.plan.md`](../.cursor/plans/disclo_phase1_sprints.plan.md)**

**Maintainers:** Each checklist row has a matching YAML todo (`id` in parentheses on the line). When work is done, set `status: completed` in frontmatter **and** the body line to `- [x] ~~…~~`. **INFRA-*** rows require verified integration (DB, Redis/BullMQ, deploy, CI on `main`), not files-only; see the plan’s **Maintainer policy** and `docs/AGENT_OPERATIONS.md`.
