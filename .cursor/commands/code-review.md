Review the changes on @branch:

- Think through how data flows in the app. Explain new patterns if they exist and why.
- Were there any changes that could affect infrastructure?
- Consider empty, loading, error, and offline states.
- Review frontend changes for a11y (keyboard navigation, focus management, ARIA roles, color contrast).
- If public APIs have changed, ensure backwards compat (or increment API version).
- Did we add any unnecessary dependencies? If there's a heavy dependency, could we inline a more minimal version?
- Did we add quality tests? Prefer fewer, high quality tests. Prefer integration tests for user flows.
- Were there schema changes which could require a database migration?
- Changes to auth flows or permissions? Run /security-review.
- If feature flags are set up, does this change require adding a new one?
- Are there places we should use caching?
- Are we missing critical o11y or logging on backend changes?

## Disclo-specific checks

- Is `packages/core` free of imports from `packages/adapters`?
- Do all new adapter files implement only the `PlatformAdapter` interface methods?
- Is plan enforcement middleware applied before business logic on all new premium routes?
- Are OAuth tokens and API keys encrypted via `packages/core/src/crypto.ts`?
- Are all inbound webhook signatures verified before processing?
- Does `process.env` appear only in `packages/core/src/config.ts`?
- Are all external API calls (GPTZero, Hive, Anthropic, Stripe) wrapped in typed error classes?
- Are tests written before implementation (TDD)? Check commit history.
- Are there any `test.skip` or `it.skip` in the new test files?
- Does the audit log record all new compliance actions?
- For Green Claims changes: is there a consumer-visible badge, or is it correctly merchant-facing only?
