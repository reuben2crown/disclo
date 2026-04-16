# Phase 1 sprints (checklist location)

The Phase 1 sprint checklist is a **Cursor plan file** (checkboxes + sprint structure):

**[`.cursor/plans/disclo_phase1_sprints.plan.md`](../.cursor/plans/disclo_phase1_sprints.plan.md)**

**Maintainers:** Each checklist row has a matching YAML todo (`id` in parentheses on the line). When work is done, set `status: completed` in frontmatter **and** the body line to `- [x] ~~…~~`. **INFRA-*** rows require verified integration (DB, Redis/BullMQ, deploy, CI on `main`), not files-only; see the plan’s **Maintainer policy** and `docs/AGENT_OPERATIONS.md`.

**Sprint 1 split (2026-04-04):** The plan body defines **Sprint 1A** (engine + adapter + shell) vs **Sprint 1B** (integration closure: **INT-01** `w23-int-scan-01`, Linear **REU-158**, then **FE-03** / **BE-19**) so Sprint 2 (PDF, evidence, billing depth) is not a prerequisite for the first dev-store scan loop. See **Practical sprint boundaries** and **Sprint 1B — closure record** in that file (**closed in repo**; dev-store pass → Linear **REU-158** / **REU-101** / **REU-78**).
