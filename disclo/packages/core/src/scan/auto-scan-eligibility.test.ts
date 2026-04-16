import type { PrismaClient } from "@disclo/db";
import { describe, expect, it, vi } from "vitest";
import { listShopIdsWithMonthlyAutoScanPlan } from "./auto-scan-eligibility.js";

describe("listShopIdsWithMonthlyAutoScanPlan", () => {
  it("returns shop ids where plan.monthlyAutoScan is true", async () => {
    const findMany = vi.fn().mockResolvedValue([{ id: "s1" }, { id: "s2" }]);
    const prisma = { shop: { findMany } } as unknown as PrismaClient;

    const ids = await listShopIdsWithMonthlyAutoScanPlan(prisma);

    expect(ids).toEqual(["s1", "s2"]);
    expect(findMany).toHaveBeenCalledWith({
      where: { plan: { monthlyAutoScan: true } },
      select: { id: true },
    });
  });
});
