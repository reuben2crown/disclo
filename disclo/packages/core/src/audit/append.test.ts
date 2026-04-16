import type { PrismaClient } from "@disclo/db";
import { describe, expect, it, vi } from "vitest";
import { appendAuditLog } from "./append.js";
import { ValidationError } from "../utils/errors.js";

function mockPrisma(overrides: {
  scanItem?: Record<string, unknown> | null;
  auditCreate?: { id: string };
}) {
  const auditLog = {
    create: vi.fn().mockResolvedValue(overrides.auditCreate ?? { id: "a1" }),
  };
  const scanItem = {
    findUnique: vi.fn().mockResolvedValue(overrides.scanItem ?? null),
  };
  return { auditLog, scanItem, prisma: { auditLog, scanItem } as unknown as PrismaClient };
}

describe("appendAuditLog", () => {
  it("creates audit row when scan item exists and hashes align", async () => {
    const { prisma, auditLog, scanItem } = mockPrisma({
      scanItem: {
        id: "si1",
        shopId: "sh1",
        contentHash: "abc",
      },
    });

    const out = await appendAuditLog(prisma, {
      scanItemId: "si1",
      shopId: "sh1",
      action: "labelled",
      contentHash: "abc",
    });

    expect(out.id).toBe("a1");
    expect(scanItem.findUnique).toHaveBeenCalledWith({ where: { id: "si1" } });
    expect(auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "labelled",
          contentHash: "abc",
          shopId: "sh1",
          scanItemId: "si1",
        }),
      }),
    );
  });

  it("requires reviewerName for human_reviewed", async () => {
    const { prisma } = mockPrisma({
      scanItem: { id: "si1", shopId: "sh1", contentHash: "abc" },
    });

    await expect(
      appendAuditLog(prisma, {
        scanItemId: "si1",
        shopId: "sh1",
        action: "human_reviewed",
        contentHash: "abc",
      }),
    ).rejects.toThrow(ValidationError);
  });

  it("throws when expectedScanItemContentHash does not match", async () => {
    const { prisma } = mockPrisma({
      scanItem: { id: "si1", shopId: "sh1", contentHash: "new" },
    });

    await expect(
      appendAuditLog(prisma, {
        scanItemId: "si1",
        shopId: "sh1",
        action: "labelled",
        contentHash: "new",
        expectedScanItemContentHash: "old",
      }),
    ).rejects.toThrow(ValidationError);
  });

  it("prefixes notes with regulation citations when provided", async () => {
    const { prisma, auditLog } = mockPrisma({
      scanItem: { id: "si1", shopId: "sh1", contentHash: "h" },
    });

    await appendAuditLog(prisma, {
      scanItemId: "si1",
      shopId: "sh1",
      action: "labelled",
      contentHash: "h",
      regulationCitations: ["eu_ai_act_art50"],
      notes: "Applied label",
    });

    expect(auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          notes: "Citations: eu_ai_act_art50\nApplied label",
        }),
      }),
    );
  });
});
