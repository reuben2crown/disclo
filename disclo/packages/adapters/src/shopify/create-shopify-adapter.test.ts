import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { encryptString } from "@disclo/core";
import type { PrismaClient } from "@disclo/db";
import { createShopifyAdapter } from "./index.js";

const TEST_KEY = "01234567890123456789012345678901";

describe("createShopifyAdapter", () => {
  const findUnique = vi.fn();
  const updateMany = vi.fn();

  const prisma = {
    shop: {
      findUnique,
      updateMany,
    },
  } as unknown as PrismaClient;

  const adapter = createShopifyAdapter({
    prisma,
    encryptionKey: TEST_KEY,
    apiVersion: "2026-01",
  });

  beforeEach(() => {
    findUnique.mockReset();
    updateMany.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetchContent maps a product page from GraphQL", async () => {
    findUnique.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      platform: "shopify",
      externalDomain: "test.myshopify.com",
      accessToken: encryptString("shpat_test", TEST_KEY),
    });

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          data: {
            products: {
              pageInfo: { hasNextPage: false, endCursor: null },
              edges: [
                {
                  node: {
                    id: "gid://shopify/Product/123",
                    title: "Mug",
                    descriptionHtml: "<p>Nice</p>",
                    updatedAt: "2025-01-01T00:00:00Z",
                    featuredImage: { url: "https://cdn.example/m.jpg" },
                    images: { edges: [] },
                  },
                },
              ],
            },
          },
        }),
      })) as unknown as typeof fetch,
    );

    const rows = await adapter.fetchContent("550e8400-e29b-41d4-a716-446655440000");
    expect(rows).toHaveLength(1);
    expect(rows[0]!.external_id).toBe("123");
    expect(rows[0]!.fields.title).toBe("Mug");
    expect(rows[0]!.fields.body).toBe("Nice");
    expect(rows[0]!.fields.image_urls).toEqual(["https://cdn.example/m.jpg"]);
  });

  it("writeLabel calls metafieldsSet", async () => {
    findUnique.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      platform: "shopify",
      externalDomain: "test.myshopify.com",
      accessToken: encryptString("shpat_test", TEST_KEY),
    });

    const fetchMock = vi.fn(
      async (_input: string | URL, _init?: RequestInit) => ({
        ok: true,
        json: async () => ({
          data: {
            metafieldsSet: {
              metafields: [{ id: "1" }],
              userErrors: [],
            },
          },
        }),
      }),
    );
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    await adapter.writeLabel({
      platform: "shopify",
      shop_id: "550e8400-e29b-41d4-a716-446655440000",
      external_id: "123",
      action: "add_label",
      label_text: "AI Content Compliance",
      meta_key: "eu_ai_compliance.ai_content_disclosure",
      meta_value: "",
    });

    expect(fetchMock).toHaveBeenCalled();
    const firstCall = fetchMock.mock.calls[0] as [string | URL, RequestInit];
    const body = JSON.parse(String(firstCall[1].body));
    expect(body.variables.metafields[0].ownerId).toBe("gid://shopify/Product/123");
  });

  it("fetchProductByNumericId returns one ScanRequest", async () => {
    findUnique.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      platform: "shopify",
      externalDomain: "test.myshopify.com",
      accessToken: encryptString("shpat_test", TEST_KEY),
    });

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          data: {
            product: {
              id: "gid://shopify/Product/7",
              title: "Socks",
              descriptionHtml: null,
              updatedAt: "2026-01-02T00:00:00Z",
              featuredImage: null,
              images: { edges: [] },
            },
          },
        }),
      })) as unknown as typeof fetch,
    );

    const row = await adapter.fetchProductByNumericId(
      "550e8400-e29b-41d4-a716-446655440000",
      "7",
    );
    expect(row?.external_id).toBe("7");
    expect(row?.fields.title).toBe("Socks");
  });

  it("revokeAccess clears the token", async () => {
    updateMany.mockResolvedValue({ count: 1 });
    await adapter.revokeAccess("550e8400-e29b-41d4-a716-446655440000");
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: "550e8400-e29b-41d4-a716-446655440000", platform: "shopify" },
      data: { accessToken: null },
    });
  });
});
