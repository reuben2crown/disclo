/**
 * Vitest loads `@disclo/core` from source; the default storage provider reads R2 env on first use.
 * CI and local unit tests may omit R2; set safe placeholders so imports do not throw.
 */
process.env.R2_ACCOUNT_ID ??= "00000000000000000000000000000000";
process.env.R2_ACCESS_KEY_ID ??= "test-access-key";
process.env.R2_SECRET_ACCESS_KEY ??= "test-secret-key";
process.env.R2_BUCKET_NAME ??= "test-bucket";
