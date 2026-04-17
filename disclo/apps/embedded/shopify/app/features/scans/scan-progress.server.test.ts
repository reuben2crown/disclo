import { describe, expect, it, vi } from "vitest";
import { getScanProgressSnapshot } from "./scan-progress.server.js";

describe("getScanProgressSnapshot", () => {
  it("returns null when scan is missing or wrong shop", async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    const prisma = { scan: { findFirst } } as never;
    await expect(
      getScanProgressSnapshot(prisma, "s.myshopify.com", "scan-1"),
    ).resolves.toBeNull();
  });

  it("computes progress from groupBy", async () => {
    const findFirst = vi.fn().mockResolvedValue({
      id: "scan-1",
      status: "running",
      totalItems: 4,
      riskScore: null,
      completedAt: null,
      flaggedItems: null,
    });
    const groupBy = vi.fn().mockResolvedValue([
      { status: "classified", _count: { _all: 2 } },
      { status: "pending", _count: { _all: 2 } },
    ]);
    const prisma = { scan: { findFirst }, scanItem: { groupBy } } as never;
    const row = await getScanProgressSnapshot(
      prisma,
      "s.myshopify.com",
      "scan-1",
    );
    expect(row).toEqual({
      id: "scan-1",
      status: "running",
      totalItems: 4,
      processedItems: 2,
      progressPct: 50,
      riskScore: null,
      completedAt: null,
      flaggedItems: null,
    });
  });
});
