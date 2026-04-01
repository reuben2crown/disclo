export type Platform =
  | "shopify"
  | "woocommerce"
  | "wordpress"
  | "headless"
  | "bigcommerce"
  | "wix"
  | "webflow"
  | "ghost";

export type ContentType = "product" | "page" | "post" | "image" | "policy";

/** Stored in `evidence_items.evidenceType` (six library types). */
export type EvidenceType =
  | "third_party_certification"
  | "environmental_label"
  | "test_report"
  | "supplier_attestation"
  | "regulatory_filing"
  | "other";

/** Scan / item severity band (dashboard + evidence `qualityTier`). */
export type QualityTier = "none" | "review" | "high";

export type RegulationCode =
  | "eu_ai_act_art50"
  | "florida_ai"
  | "ny_synthetic"
  | "ftc_green"
  | "eu_green_claims";

/** Application constants for multi-regulation compliance (see `regulations/`). */
export interface RegulationConfig {
  code: RegulationCode;
  displayName: string;
  jurisdiction: string;
  category: "ai_disclosure" | "green_claims";
  appliesTo: ("text" | "image")[];
  badgeType: "consumer_visible" | "merchant_only";
  defaultBadgeText: string;
  citationText: string;
}

export interface ScanRequest {
  platform: Platform;
  shop_id: string;
  external_id: string;
  content_type: ContentType;
  fields: {
    title?: string;
    body?: string;
    image_urls?: string[];
    meta?: Record<string, string>;
  };
  metadata: {
    source_url: string;
    updated_at: string;
    content_hash: string;
  };
}

export interface LabelInstruction {
  platform: string;
  shop_id: string;
  external_id: string;
  action: "add_label" | "remove_label" | "update_description";
  label_text: string;
  meta_key: string;
  meta_value: string;
  description_html?: string;
}

export interface PlatformAdapter {
  fetchContent(shopId: string, cursor?: string): Promise<ScanRequest[]>;
  writeLabel(instruction: LabelInstruction): Promise<void>;
  registerWebhooks(shopId: string): Promise<void>;
  revokeAccess(shopId: string): Promise<void>;
}

export const QUEUE_NAMES = {
  scan: "scan",
  textClassify: "text-classify",
  imageClassify: "image-classify",
  claimsCheck: "claims-check",
  autoScan: "auto-scan",
  report: "report",
  evidenceVerify: "evidence-verify",
} as const;
