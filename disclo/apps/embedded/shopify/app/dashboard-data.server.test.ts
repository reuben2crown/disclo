import { describe, expect, it, vi } from "vitest";
import { getDashboardShopSnapshot } from "./dashboard-data.server.js";

describe("getDashboardShopSnapshot", () => {
  it("returns null when shop row is missing", async () => {
    const findUnique = vi.fn().mockResolvedValue(null);
    const prisma = { shop: { findUnique } } as never;
    await expect(
      getDashboardShopSnapshot(prisma, "x.myshopify.com"),
    ).resolves.toBeNull();
  });

  it("maps regulations, breakdown, and display score from completed scan", async () => {
    const completed = new Date("2026-01-15T12:00:00.000Z");
    const findUnique = vi.fn().mockResolvedValue({
      id: "shop-uuid",
      displayName: "Test Shop",
      externalDomain: "t.myshopify.com",
      plan: { displayName: "Free" },
      shopSettings: { targetMarkets: ["EU", "US"] },
    });

    const findFirstScan = vi.fn(
      (args: { where?: { status?: string } }) => {
        if (args.where?.status === "completed") {
          return Promise.resolve({
            id: "done-1",
            riskScore: 42,
            completedAt: completed,
            scanItems: [
              { riskLevel: "none" },
              { riskLevel: "review" },
              { riskLevel: "high" },
            ],
          });
        }
        return Promise.resolve({
          id: "done-1",
          status: "completed",
          startedAt: null,
          completedAt: completed,
          riskScore: 42,
          totalItems: 3,
        });
      },
    );

    const groupBy = vi.fn().mockResolvedValue([]);

    const prisma = {
      shop: { findUnique },
      scan: { findFirst: findFirstScan },
      scanItem: { groupBy },
    } as never;

    const row = await getDashboardShopSnapshot(prisma, "t.myshopify.com");
    expect(row?.shopId).toBe("shop-uuid");
    expect(row?.targetMarkets).toEqual(["EU", "US"]);
    expect(row?.displayRiskScore).toBe(42);
    expect(row?.riskBreakdown).toEqual({
      total: 3,
      none: 1,
      review: 1,
      high: 1,
    });
    expect(row?.applicableRegulations.map((r) => r.code).sort()).toEqual(
      ["eu_ai_act_art50", "eu_green_claims", "ftc_green"].sort(),
    );
    expect(row?.onboarding.firstScanComplete).toBe(true);
    expect(row?.activeScan).toBeNull();
  });
});
