import { describe, expect, it, vi } from "vitest";
import type { PrismaClient } from "@disclo/db";
import { refreshCompletedScanAggregates } from "./finalize.js";

describe("refreshCompletedScanAggregates", () => {
  it("no-ops when scan is not completed", async () => {
    const update = vi.fn();
    const prisma = {
      scan: {
        findUnique: vi.fn().mockResolvedValue({
          id: "s1",
          status: "running",
          scanItems: [],
        }),
        update,
      },
    } as unknown as PrismaClient;

    await refreshCompletedScanAggregates(prisma, "s1");

    expect(update).not.toHaveBeenCalled();
  });

  it("updates risk and flagged counts for a completed scan", async () => {
    const update = vi.fn();
    const prisma = {
      scan: {
        findUnique: vi.fn().mockResolvedValue({
          id: "s1",
          status: "completed",
          scanItems: [
            {
              status: "classified",
              riskLevel: "high",
              regulations: ["eu_ai_act_art50"],
            },
            {
              status: "classified",
              riskLevel: "none",
              regulations: ["eu_ai_act_art50"],
            },
          ],
        }),
        update,
      },
    } as unknown as PrismaClient;

    await refreshCompletedScanAggregates(prisma, "s1");

    expect(update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: expect.objectContaining({
        flaggedItems: 1,
        riskScore: expect.any(Number),
      }),
    });
  });
});
