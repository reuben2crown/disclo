import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Shopify HTTPS webhook signing: base64(HMAC-SHA256(raw body, API client secret)).
 * @see https://shopify.dev/docs/apps/build/webhooks/subscribe/https
 */
export function computeShopifyWebhookHmacBase64(
  rawBody: string | Buffer,
  apiSecret: string,
): string {
  const buf = typeof rawBody === "string" ? Buffer.from(rawBody, "utf8") : rawBody;
  return createHmac("sha256", apiSecret).update(buf).digest("base64");
}

/**
 * Verifies `X-Shopify-Hmac-SHA256` (or equivalent) against the raw request body.
 * Remix / shopify-app-remix performs this at the framework boundary; this helper
 * documents the contract and supports non-Remix servers or extra checks.
 */
export function verifyShopifyWebhookHmac(
  rawBody: string | Buffer,
  hmacHeader: string | null | undefined,
  apiSecret: string,
): boolean {
  if (!hmacHeader || !apiSecret) {
    return false;
  }
  const expected = computeShopifyWebhookHmacBase64(rawBody, apiSecret);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(hmacHeader.trim(), "utf8");
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}
