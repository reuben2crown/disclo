import { describe, expect, it, vi } from "vitest";
import { loadShopScansForList } from "./scans-list.server.js";

describe("loadShopScansForList", () => {
  it("returns empty when findMany returns nothing", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const prisma = { scan: { findMany } } as never;
    await expect(
      loadShopScansForList(prisma, "x.myshopify.com"),
    ).resolves.toEqual([]);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          shop: { platform: "shopify", externalDomain: "x.myshopify.com" },
        }),
        orderBy: { createdAt: "desc" },
      }),
    );
  });

  it("adds scanItems filter when regulation is set", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const prisma = { scan: { findMany } } as never;
    await loadShopScansForList(prisma, "x.myshopify.com", {
      regulationFilter: "ftc_green",
    });
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          scanItems: { some: { regulations: { has: "ftc_green" } } },
        }),
      }),
    );
  });

  it("maps rows to ISO strings", async () => {
    const d = new Date("2026-03-01T10:00:00.000Z");
    const findMany = vi.fn().mockResolvedValue([
      {
        id: "scan-1",
        createdAt: d,
        scanType: "full",
        status: "completed",
        totalItems: 5,
        flaggedItems: 1,
        riskScore: 33,
      },
    ]);
    const prisma = { scan: { findMany } } as never;
    const rows = await loadShopScansForList(prisma, "x.myshopify.com");
    expect(rows[0]).toMatchObject({
      id: "scan-1",
      createdAt: "2026-03-01T10:00:00.000Z",
      scanType: "full",
      status: "completed",
      totalItems: 5,
      flaggedItems: 1,
      riskScore: 33,
    });
  });
});
