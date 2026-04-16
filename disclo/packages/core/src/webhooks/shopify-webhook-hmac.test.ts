import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  computeShopifyWebhookHmacBase64,
  verifyShopifyWebhookHmac,
} from "./shopify-webhook-hmac.js";

describe("Shopify webhook HMAC contract", () => {
  it("matches Shopify documented formula: base64(HMAC-SHA256(raw body, api secret))", () => {
    const secret = "shpss_test_client_secret_32chars_x";
    const rawBody = '{"id":1}';
    const expected = createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("base64");
    expect(computeShopifyWebhookHmacBase64(rawBody, secret)).toBe(expected);
  });

  it("accepts matching X-Shopify-Hmac-SHA256 header", () => {
    const secret = "shpss_abcd";
    const rawBody = "payload";
    const hmac = computeShopifyWebhookHmacBase64(rawBody, secret);
    expect(verifyShopifyWebhookHmac(rawBody, hmac, secret)).toBe(true);
  });

  it("rejects wrong secret, missing header, and tampered body", () => {
    const secret = "shpss_real";
    const rawBody = "{}";
    const hmac = computeShopifyWebhookHmacBase64(rawBody, secret);
    expect(verifyShopifyWebhookHmac(rawBody, hmac, "other_secret")).toBe(false);
    expect(verifyShopifyWebhookHmac(rawBody, "", secret)).toBe(false);
    expect(verifyShopifyWebhookHmac(rawBody, null, secret)).toBe(false);
    expect(verifyShopifyWebhookHmac('{"id":2}', hmac, secret)).toBe(false);
  });

  it("compares digests in constant time for same-length base64 strings", () => {
    const secret = "x".repeat(20);
    const body = "same-length-attempt";
    const good = computeShopifyWebhookHmacBase64(body, secret);
    const bad = good.slice(0, -1) + (good.endsWith("A") ? "B" : "A");
    expect(verifyShopifyWebhookHmac(body, bad, secret)).toBe(false);
  });
});
