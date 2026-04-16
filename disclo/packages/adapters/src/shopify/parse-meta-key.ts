import { AdapterError } from "@disclo/core";

/** Expects `namespace.key` (e.g. eu_ai_compliance.ai_content_disclosure). */
export function parseShopifyMetaKey(metaKey: string): { namespace: string; key: string } {
  const i = metaKey.indexOf(".");
  if (i <= 0 || i === metaKey.length - 1) {
    throw new AdapterError(
      `Invalid Shopify metafield key "${metaKey}"; expected namespace.key`,
    );
  }
  return { namespace: metaKey.slice(0, i), key: metaKey.slice(i + 1) };
}
