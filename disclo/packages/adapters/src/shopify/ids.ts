import { AdapterError } from "@disclo/core";

export function productGidToNumericId(gid: string): string {
  const m = /^gid:\/\/shopify\/Product\/(\d+)$/.exec(gid);
  if (!m) {
    throw new AdapterError(`Unexpected Shopify product id: ${gid}`);
  }
  return m[1]!;
}

export function toShopifyProductGid(externalId: string): string {
  if (externalId.startsWith("gid://shopify/Product/")) {
    return externalId;
  }
  return `gid://shopify/Product/${externalId}`;
}
