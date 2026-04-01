Run a security review on @branch:

## Authentication & authorisation
- Are all new routes protected by session or API key middleware?
- Are plan enforcement checks applied before business logic on every premium route?
- Is there any path where an unauthenticated request reaches business logic?

## Token and credential handling
- Are OAuth tokens and API keys encrypted via packages/core/src/crypto.ts (AES-256-GCM)?
- Is process.env accessed only through packages/core/src/config.ts?
- Are API keys hashed (SHA-256) before storage? Only the hash and an 8-char prefix stored?
- Does any log statement include token values, full API keys, or payment data?

## Webhook security
- Is HMAC signature verification present on ALL inbound webhook routes?
- Is the raw request body used for HMAC verification (not a parsed body)?
- Are rejected webhooks returning 401 (not 200)?
- For Stripe: is stripe.webhooks.constructEvent() used (not custom HMAC)?

## Data privacy
- Are full product descriptions or images stored anywhere in the database? (They must not be)
- Are reviewer names and emails included in GDPR data deletion flows?
- Are there any new columns storing personal data not covered by the privacy policy?

## Input validation
- Are all user-supplied inputs validated with Zod before use?
- Is there any SQL injection risk (raw queries without parameterisation)?
- Are webhook URLs validated as HTTPS only before being stored in webhook_endpoints?

## Dependencies
- Do any new dependencies have known CVEs? (Check with: pnpm audit)
- Are dependency versions pinned (not using ^ or ~ for security-critical packages)?

## API surface
- Are any new endpoints added to the public API? Do they follow the auth + rate limit + quota middleware chain?
- Do error responses expose internal implementation details (stack traces, DB errors)?
