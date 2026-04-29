import { beforeEach, describe, expect, it, vi } from "vitest";
import { markScanItemHumanReviewed } from "./mark-human-reviewed.server.js";

const refreshMock = vi.hoisted(() => vi.fn());
vi.mock("@disclo/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@disclo/core")>();
  return {
    ...actual,
    refreshCompletedScanAggregates: refreshMock,
  };
});

describe("markScanItemHumanReviewed", () => {
  const prismaBase = {
    shop: { findFirst: vi.fn().mockResolvedValue({ id: "shop-1" }) },
    scanItem: {
      findFirst: vi.fn().mockResolvedValue({
        id: "item-1",
        contentHash: "hash-1",
        status: "classified",
      }),
      update: vi.fn().mockResolvedValue({}),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires reviewer name", async () => {
    const out = await markScanItemHumanReviewed(prismaBase as never, {
      shopDomain: "s.myshopify.com",
      scanId: "scan-1",
      itemId: "item-1",
      reviewerName: " ",
    });
    expect(out).toMatchObject({ ok: false, httpStatus: 400 });
  });

  it("writes audit row and exempts item", async () => {
    const appendSpy = vi.spyOn(await import("@disclo/core"), "appendAuditLog");
    appendSpy.mockResolvedValue({ id: "audit-1" });

    const out = await markScanItemHumanReviewed(prismaBase as never, {
      shopDomain: "s.myshopify.com",
      scanId: "scan-1",
      itemId: "item-1",
      reviewerName: "Casey",
      notes: "Reviewed by legal.",
    });
    expect(out).toEqual({ ok: true });
    expect(appendSpy).toHaveBeenCalledWith(
      prismaBase,
      expect.objectContaining({
        action: "human_reviewed",
        reviewerName: "Casey",
      }),
    );
    expect(prismaBase.scanItem.update).toHaveBeenCalledWith({
      where: { id: "item-1" },
      data: { status: "exempted" },
    });
    expect(refreshMock).toHaveBeenCalledWith(prismaBase, "scan-1");

    appendSpy.mockRestore();
  });
});
