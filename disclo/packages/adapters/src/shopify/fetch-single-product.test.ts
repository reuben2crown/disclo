import { describe, expect, it, vi, afterEach } from "vitest";
import { fetchShopifyProductByNumericId } from "./fetch-single-product.js";

describe("fetchShopifyProductByNumericId", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null when product is missing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ data: { product: null } }),
      })) as unknown as typeof fetch,
    );

    const r = await fetchShopifyProductByNumericId({
      shopDomain: "test.myshopify.com",
      accessToken: "tok",
      apiVersion: "2026-01",
      shopUuid: "550e8400-e29b-41d4-a716-446655440000",
      numericProductId: "999",
    });
    expect(r).toBeNull();
  });

  it("maps a product node to ScanRequest", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          data: {
            product: {
              id: "gid://shopify/Product/42",
              title: "Hat",
              descriptionHtml: "<p>Red</p>",
              updatedAt: "2026-02-01T00:00:00Z",
              featuredImage: null,
              images: { edges: [{ node: { url: "https://cdn.example/i.png" } }] },
            },
          },
        }),
      })) as unknown as typeof fetch,
    );

    const r = await fetchShopifyProductByNumericId({
      shopDomain: "test.myshopify.com",
      accessToken: "tok",
      apiVersion: "2026-01",
      shopUuid: "550e8400-e29b-41d4-a716-446655440000",
      numericProductId: "42",
    });

    expect(r).not.toBeNull();
    expect(r!.external_id).toBe("42");
    expect(r!.fields.title).toBe("Hat");
    expect(r!.fields.body).toBe("Red");
    expect(r!.fields.image_urls).toEqual(["https://cdn.example/i.png"]);
  });
});
