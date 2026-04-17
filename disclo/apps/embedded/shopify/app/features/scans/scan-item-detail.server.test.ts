import { describe, expect, it, vi } from "vitest";

const fetchProductByNumericId = vi.hoisted(() => vi.fn());

vi.mock("@disclo/adapters", () => ({
  createShopifyAdapter: vi.fn(() => ({
    fetchProductByNumericId,
  })),
}));

import { createShopifyAdapter } from "@disclo/adapters";
import {
  listScanItemsForTenantScan,
  loadScanItemDetail,
} from "./scan-item-detail.server";

describe("listScanItemsForTenantScan", () => {
  it("returns null when scan is not in tenant", async () => {
    const prisma = {
      scan: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    } as never;

    const r = await listScanItemsForTenantScan(prisma, "s.myshopify.com", "scan-1");
    expect(r).toBeNull();
  });

  it("returns ordered items for a tenant scan", async () => {
    const prisma = {
      scan: {
        findFirst: vi.fn().mockResolvedValue({ id: "scan-1" }),
      },
      scanItem: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "i1",
            contentId: "99",
            contentType: "product",
            riskLevel: "review",
            status: "classified",
            aiProbability: { toString: () => "0.75" },
          },
        ]),
      },
    } as never;

    const r = await listScanItemsForTenantScan(prisma, "s.myshopify.com", "scan-1");
    expect(r).toEqual([
      {
        id: "i1",
        contentId: "99",
        contentType: "product",
        riskLevel: "review",
        status: "classified",
        aiProbability: "0.75",
      },
    ]);
  });
});

describe("loadScanItemDetail", () => {
  it("returns null when item missing", async () => {
    const prisma = {
      scanItem: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    } as never;

    const r = await loadScanItemDetail(
      prisma,
      "s.myshopify.com",
      "scan-1",
      "item-1",
    );
    expect(r).toBeNull();
  });

  it("maps item, audits, and regulations", async () => {
    const reviewedAt = new Date("2026-01-01T12:00:00Z");
    const prisma = {
      scanItem: {
        findFirst: vi.fn().mockResolvedValue({
          id: "item-1",
          shopId: "shop-1",
          platform: "shopify",
          scanId: "scan-1",
          contentId: "42",
          contentType: "product",
          field: "body",
          riskLevel: "high",
          status: "classified",
          regulations: ["eu_ai_act_art50"],
          flaggedClaims: ["kw:eco:green"],
          aiProbability: { toString: () => "0.9" },
          contentHash: "abc",
          scan: {
            id: "scan-1",
            status: "completed",
            completedAt: reviewedAt,
          },
          auditLogs: [
            {
              id: "a1",
              action: "labelled",
              reviewedAt,
              notes: "Citations: eu_ai_act_art50",
            },
          ],
        }),
      },
    } as never;

    const r = await loadScanItemDetail(
      prisma,
      "s.myshopify.com",
      "scan-1",
      "item-1",
    );

    expect(r?.item.contentId).toBe("42");
    expect(r?.regulationLabels[0]?.code).toBe("eu_ai_act_art50");
    expect(r?.audits[0]?.action).toBe("labelled");
    expect(r?.productPreview).toBeNull();
    expect(createShopifyAdapter).not.toHaveBeenCalled();
  });

  it("loads product preview when encryption key is provided", async () => {
    fetchProductByNumericId.mockResolvedValue({
      fields: { title: "Tea", body: "Organic" },
    });
    const prisma = {
      scanItem: {
        findFirst: vi.fn().mockResolvedValue({
          id: "item-1",
          shopId: "shop-1",
          platform: "shopify",
          scanId: "scan-1",
          contentId: "42",
          contentType: "product",
          field: "body",
          riskLevel: "none",
          status: "classified",
          regulations: ["eu_ai_act_art50"],
          flaggedClaims: [],
          aiProbability: null,
          contentHash: "abc",
          scan: {
            id: "scan-1",
            status: "completed",
            completedAt: null,
          },
          auditLogs: [],
        }),
      },
    } as never;

    const r = await loadScanItemDetail(
      prisma,
      "s.myshopify.com",
      "scan-1",
      "item-1",
      { encryptionKey: "01234567890123456789012345678901" },
    );

    expect(fetchProductByNumericId).toHaveBeenCalledWith("shop-1", "42");
    expect(r?.productPreview?.title).toBe("Tea");
    expect(r?.productPreview?.bodyExcerpt).toContain("Organic");
  });
});
