import { z } from "zod";

const platformSchema = z.enum([
  "shopify",
  "woocommerce",
  "wordpress",
  "headless",
  "bigcommerce",
  "wix",
  "webflow",
  "ghost",
]);

const contentTypeSchema = z.enum([
  "product",
  "page",
  "post",
  "image",
  "policy",
]);

export const scanRequestSchema = z.object({
  platform: platformSchema,
  shop_id: z.string().min(1),
  external_id: z.string().min(1),
  content_type: contentTypeSchema,
  fields: z.object({
    title: z.string().optional(),
    body: z.string().optional(),
    image_urls: z.array(z.string().min(1)).optional(),
    meta: z.record(z.string()).optional(),
  }),
  metadata: z.object({
    source_url: z.string(),
    updated_at: z.string(),
    content_hash: z.string(),
  }),
});

export type ScanRequestPayload = z.infer<typeof scanRequestSchema>;

/** Queued on `scan` — fan-out to per-item jobs. */
export const scanOrchestratorJobSchema = z.object({
  scanId: z.string().uuid(),
  shopId: z.string().uuid(),
  requests: z.array(scanRequestSchema).min(1),
});

export type ScanOrchestratorJob = z.infer<typeof scanOrchestratorJobSchema>;

/** Single item pipeline (text + image + claims in one worker for MVP). */
export const scanItemClassifyJobSchema = z.object({
  scanId: z.string().uuid(),
  shopId: z.string().uuid(),
  scanItemId: z.string().uuid(),
  request: scanRequestSchema,
  /** When false, skip Anthropic substantiation (plan gate). */
  planAllowsLlm: z.boolean().optional(),
});

export type ScanItemClassifyJob = z.infer<typeof scanItemClassifyJobSchema>;

/** Queued on `report` — dashboard notification / export hooks (BE-20). */
export const reportGeneratorJobSchema = z.object({
  shopId: z.string().uuid(),
  kind: z.enum(["monthly_summary", "scan_complete"]).default("monthly_summary"),
  scanId: z.string().uuid().optional(),
});

export type ReportGeneratorJob = z.infer<typeof reportGeneratorJobSchema>;

/** Queued on `notification-dispatch` — creates in-app row and optional email. */
export const notificationDispatchJobSchema = z.object({
  userId: z.string().uuid(),
  shopId: z.string().uuid().optional(),
  shopDomain: z.string().min(1).optional(),
  kind: z.enum([
    "report_monthly_summary",
    "report_scan_complete",
    "high_risk_alert",
    "evidence_expiry",
  ]),
  link: z.string().min(1).optional(),
});

export type NotificationDispatchJob = z.infer<typeof notificationDispatchJobSchema>;

/** Queued on `evidence-verify` — periodic checks against evidence registry/source. */
export const evidenceVerifyJobSchema = z.object({
  source: z.enum(["daily-tick"]).default("daily-tick"),
  limit: z.number().int().positive().max(500).optional(),
});

export type EvidenceVerifyJob = z.infer<typeof evidenceVerifyJobSchema>;
