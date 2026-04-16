import { describe, expect, it, vi } from "vitest";
import { finalizeScanIfComplete } from "./finalize.js";
import type { PrismaClient } from "@disclo/db";

describe("finalizeScanIfComplete", () => {
  it("excludes exempted items from compliance score and flagged count", async () => {
    const update = vi.fn();
    const findUnique = vi.fn().mockResolvedValue({
      id: "scan1",
      totalItems: 2,
      scanItems: [
        {
          status: "classified",
          riskLevel: "high",
          regulations: ["eu_ai_act_art50"],
        },
        {
          status: "exempted",
          riskLevel: "none",
          regulations: [],
        },
      ],
    });
    const prisma = {
      scan: { findUnique, update },
    } as unknown as PrismaClient;

    await finalizeScanIfComplete(prisma, "scan1");

    expect(update).toHaveBeenCalledWith({
      where: { id: "scan1" },
      data: expect.objectContaining({
        status: "completed",
        flaggedItems: 1,
      }),
    });
    const riskScore = update.mock.calls[0][0].data.riskScore as number;
    expect(riskScore).toBeGreaterThanOrEqual(0);
    expect(riskScore).toBeLessThanOrEqual(100);
  });

  it("completes with score 100 when all items are exempted", async () => {
    const update = vi.fn();
    const findUnique = vi.fn().mockResolvedValue({
      id: "scan1",
      totalItems: 1,
      scanItems: [
        {
          status: "exempted",
          riskLevel: "none",
          regulations: [],
        },
      ],
    });
    const prisma = { scan: { findUnique, update } } as unknown as PrismaClient;

    await finalizeScanIfComplete(prisma, "scan1");

    expect(update).toHaveBeenCalledWith({
      where: { id: "scan1" },
      data: {
        status: "completed",
        riskScore: 100,
        completedAt: expect.any(Date),
        flaggedItems: 0,
      },
    });
  });
});
