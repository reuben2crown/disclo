import { describe, expect, it } from "vitest";
import { productGidToNumericId, toShopifyProductGid } from "./ids.js";

describe("Shopify id helpers", () => {
  it("productGidToNumericId extracts id", () => {
    expect(productGidToNumericId("gid://shopify/Product/123")).toBe("123");
  });

  it("toShopifyProductGid wraps numeric id", () => {
    expect(toShopifyProductGid("456")).toBe("gid://shopify/Product/456");
  });

  it("toShopifyProductGid passes through gid", () => {
    expect(toShopifyProductGid("gid://shopify/Product/789")).toBe(
      "gid://shopify/Product/789",
    );
  });
});
