# Incident response (Disclo)

**Status:** Sprint 0 baseline (SEC-07). **Owner:** Engineering + security. Expand after first production traffic.

## Severity (initial)

| Level | Examples | Response time target |
| --- | --- | --- |
| P1 | Active data breach, auth bypass, payment integrity | Page on-call; contain within 1h |
| P2 | Webhook forgery risk, tenant data leak path | Same business day |
| P3 | Dependency CVE with no exploit path in our deployment | Next sprint window |

## First steps (any severity)

1. **Contain:** Disable affected integration, rotate suspected credentials, or block route at edge — smallest change that stops harm.
2. **Preserve evidence:** Export relevant logs (no full bodies for credential routes). Note UTC time range and request ids.
3. **Notify:** Internal channel per your org; customers/regulators only when required by law or contract.

## Roles

- **Incident lead:** coordinates timeline and comms draft.
- **Engineering:** patch, deploy, validation.
- **Security/compliance:** scope, GDPR angle, audit trail (COMP issues).

## Technical playbooks (stubs)

- **Suspected leaked `ENCRYPTION_KEY` or DB credential:** Rotate in provider; deploy apps/workers; invalidate sessions if needed; document in Linear + `docs/SESSION.md`.
- **Forged webhooks:** Confirm HMAC verification on raw body; check for logging of secrets; add regression test under `packages/core` or app integration tests.
- **Dependency CVE:** Run `pnpm audit` from `disclo/`; upgrade or override; re-run CI.

## Post-incident

- Short **timeline** (detection → containment → fix).
- **Root cause** and **follow-ups** (tests, monitoring, runbook update).
- Link related Linear issues (SEC/COMP).

## References

- Threat model: `docs/security/threat-model.md`
- Secrets: `docs/security/secrets-runbook.md`
- Session handoff: `docs/SESSION.md`
