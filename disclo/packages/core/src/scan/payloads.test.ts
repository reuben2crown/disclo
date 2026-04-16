import { describe, expect, it } from "vitest";
import {
  reportGeneratorJobSchema,
  scanOrchestratorJobSchema,
  scanRequestSchema,
} from "./payloads.js";

const minimalRequest = {
  platform: "shopify" as const,
  shop_id: "shop-uuid",
  external_id: "p1",
  content_type: "product" as const,
  fields: { body: "hello world ".repeat(20) },
  metadata: {
    source_url: "https://x.com/p",
    updated_at: "2026-01-01T00:00:00Z",
    content_hash: "abc",
  },
};

describe("scanOrchestratorJobSchema", () => {
  it("parses valid job", () => {
    const j = scanOrchestratorJobSchema.parse({
      scanId: "550e8400-e29b-41d4-a716-446655440000",
      shopId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      requests: [minimalRequest],
    });
    expect(j.requests).toHaveLength(1);
  });
});

describe("reportGeneratorJobSchema", () => {
  it("parses minimal job", () => {
    const j = reportGeneratorJobSchema.parse({
      shopId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(j.kind).toBe("monthly_summary");
  });
});

describe("scanRequestSchema", () => {
  it("accepts CDN strings", () => {
    const r = scanRequestSchema.parse({
      ...minimalRequest,
      fields: { image_urls: ["//cdn.shopify.com/s/files/1/1.jpg"] },
    });
    expect(r.fields.image_urls?.[0]).toContain("cdn.shopify");
  });
});
