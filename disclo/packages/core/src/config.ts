import { z } from "zod";

/**
 * Zod-validated environment for server-side services.
 * Call `loadServerEnv()` once at process startup (API, workers, Shopify server bundle).
 * Optional keys are omitted until features are wired; required keys block startup when set as required.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url().optional(),
  /** Prisma migrations when `DATABASE_URL` is a pooler URL; see `packages/db/prisma/schema.prisma`. */
  DIRECT_URL: z.string().url().optional(),
  REDIS_URL: z.string().url().optional(),
  ENCRYPTION_KEY: z
    .string()
    .min(32, "ENCRYPTION_KEY must be at least 32 bytes when using AES-256")
    .optional(),
  APP_URL: z.string().url().optional(),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  GPTZERO_API_KEY: z.string().optional(),
  HIVE_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  DODO_PAYMENTS_API_KEY: z.string().optional(),
  DODO_PAYMENTS_WEBHOOK_KEY: z.string().optional(),
  DODO_PAYMENTS_ENVIRONMENT: z.enum(["test", "live"]).optional(),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_PUBLIC_URL: z.string().url().optional(),
  SHOPIFY_API_KEY: z.string().optional(),
  SHOPIFY_API_SECRET: z.string().optional(),
  SHOPIFY_SCOPES: z.string().optional(),
  SHOPIFY_APP_URL: z.string().url().optional(),
  SESSION_SECRET: z.string().min(16).optional(),
  INTERNAL_API_SECRET: z.string().min(16).optional(),
  SUPPORT_ALERT_WEBHOOK_URL: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
  POSTHOG_API_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

export function loadServerEnv(overrides?: Record<string, string | undefined>): ServerEnv {
  const merged = { ...process.env, ...overrides } as Record<string, string | undefined>;
  const parsed = serverEnvSchema.safeParse(merged);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    throw new Error(`Invalid environment: ${JSON.stringify(msg)}`);
  }
  cached = parsed.data;
  return cached;
}

export function getServerEnv(): ServerEnv {
  if (!cached) {
    return loadServerEnv();
  }
  return cached;
}
