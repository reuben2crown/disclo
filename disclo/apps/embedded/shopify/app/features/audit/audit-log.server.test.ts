import { describe, expect, it, vi } from "vitest";
import {
  auditListRowsToPdfInput,
  loadAuditLogsForShop,
} from "./audit-log.server";

describe("loadAuditLogsForShop", () => {
  it("returns null when shop missing", async () => {
    const prisma = {
      shop: { findFirst: vi.fn().mockResolvedValue(null) },
    } as never;
    const r = await loadAuditLogsForShop(prisma, "x.myshopify.com", {
      regulationFilter: null,
    });
    expect(r).toBeNull();
  });

  it("maps prisma rows including scan item", async () => {
    const reviewedAt = new Date("2026-04-01T10:00:00Z");
    const prisma = {
      shop: {
        findFirst: vi.fn().mockResolvedValue({ id: "shop-1" }),
      },
      auditLog: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "a1",
            action: "labelled",
            reviewedAt,
            contentHash: "h1",
            notes: "n1",
            scanItemId: "si1",
            scanItem: {
              id: "si1",
              contentId: "42",
              regulations: ["eu_ai_act_art50"],
            },
          },
        ]),
      },
    } as never;

    const r = await loadAuditLogsForShop(prisma, "s.myshopify.com", {
      regulationFilter: null,
    });

    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ shopId: "shop-1" }),
        take: 500,
      }),
    );
    expect(r?.[0]?.productContentId).toBe("42");
    expect(r?.[0]?.reviewedAt).toBe(reviewedAt.toISOString());
  });

  it("filters by regulation on scan item", async () => {
    const prisma = {
      shop: {
        findFirst: vi.fn().mockResolvedValue({ id: "shop-1" }),
      },
      auditLog: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    } as never;

    await loadAuditLogsForShop(prisma, "s.myshopify.com", {
      regulationFilter: "eu_ai_act_art50",
    });

    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          shopId: "shop-1",
          scanItem: { regulations: { has: "eu_ai_act_art50" } },
        },
      }),
    );
  });
});

describe("auditListRowsToPdfInput", () => {
  it("preserves fields for digest", () => {
    const rows = [
      {
        id: "1",
        action: "labelled",
        reviewedAt: "2026-01-01T00:00:00.000Z",
        contentHash: "c",
        notes: null,
        scanItemId: "s",
        productContentId: "9",
        regulations: ["eu_ai_act_art50"],
      },
    ];
    expect(auditListRowsToPdfInput(rows)).toEqual(rows);
  });
});
