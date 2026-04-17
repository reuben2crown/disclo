import { describe, expect, it, vi, beforeEach } from "vitest";

const getFeaturesMock = vi.hoisted(() => vi.fn());
const writeLabelMock = vi.hoisted(() => vi.fn());
const refreshMock = vi.hoisted(() => vi.fn());

vi.mock("ioredis", () => ({
  Redis: class MockRedis {
    quit = vi.fn().mockResolvedValue(undefined);
  },
}));

vi.mock("@disclo/adapters", () => ({
  createShopifyAdapter: vi.fn(() => ({
    writeLabel: writeLabelMock,
  })),
}));

vi.mock("@disclo/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@disclo/core")>();
  return {
    ...actual,
    loadServerEnv: vi.fn(() => ({
      NODE_ENV: "test" as const,
      LOG_LEVEL: "silent" as const,
      REDIS_URL: "redis://127.0.0.1:6379",
      ENCRYPTION_KEY: "01234567890123456789012345678901",
    })),
    createPlanFeatureService: vi.fn(() => ({
      getFeatures: getFeaturesMock,
    })),
    refreshCompletedScanAggregates: refreshMock,
  };
});

import { applyAiDisclosureLabel, buildAiDisclosureLabelText } from "./apply-label.server";

describe("buildAiDisclosureLabelText", () => {
  it("includes citations for AI disclosure regulations only", () => {
    const { labelText, aiRegulationCodes } = buildAiDisclosureLabelText(
      ["eu_ai_act_art50", "ftc_green"],
      "Custom badge line.",
    );
    expect(aiRegulationCodes).toEqual(["eu_ai_act_art50"]);
    expect(labelText).toContain("Custom badge line.");
    expect(labelText).toContain("•");
    expect(labelText).not.toContain("Green Guides");
  });
});

describe("applyAiDisclosureLabel", () => {
  const shopDomain = "s.myshopify.com";

  const prismaBase = {
    shop: {
      findFirst: vi.fn().mockResolvedValue({ id: "shop-1" }),
    },
    shopSettings: {
      findUnique: vi.fn().mockResolvedValue({ badgeTextShort: "AI assisted." }),
    },
    scanItem: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    getFeaturesMock.mockReset();
    getFeaturesMock.mockResolvedValue({
      fixDashboard: true,
      textDetection: true,
    });
    writeLabelMock.mockResolvedValue(undefined);
    refreshMock.mockResolvedValue(undefined);
    prismaBase.scanItem.findFirst.mockResolvedValue({
      id: "item-1",
      shopId: "shop-1",
      scanId: "scan-1",
      contentId: "99",
      contentHash: "hash1",
      regulations: ["eu_ai_act_art50"],
      status: "classified",
      scan: { id: "scan-1", status: "completed" },
    });
  });

  it("returns 400 when plan row missing", async () => {
    getFeaturesMock.mockResolvedValue(null);
    const prisma = { ...prismaBase } as never;
    const r = await applyAiDisclosureLabel(
      prisma,
      shopDomain,
      "scan-1",
      "item-1",
      "en",
    );
    expect(r).toMatchObject({
      ok: false,
      httpStatus: 400,
      actionUrl: expect.stringContaining("admin/settings/apps"),
    });
    expect(writeLabelMock).not.toHaveBeenCalled();
  });

  it("returns 403 when fixDashboard is off", async () => {
    getFeaturesMock.mockResolvedValue({
      fixDashboard: false,
      textDetection: true,
    });
    const prisma = { ...prismaBase } as never;
    const r = await applyAiDisclosureLabel(
      prisma,
      shopDomain,
      "scan-1",
      "item-1",
      "en",
    );
    expect(r).toMatchObject({ ok: false, httpStatus: 403 });
    expect(writeLabelMock).not.toHaveBeenCalled();
  });

  it("returns 400 when no AI regulations apply", async () => {
    prismaBase.scanItem.findFirst.mockResolvedValue({
      id: "item-1",
      shopId: "shop-1",
      scanId: "scan-1",
      contentId: "99",
      contentHash: "hash1",
      regulations: ["ftc_green"],
      status: "classified",
      scan: { id: "scan-1", status: "completed" },
    });
    const prisma = { ...prismaBase } as never;
    const r = await applyAiDisclosureLabel(
      prisma,
      shopDomain,
      "scan-1",
      "item-1",
      "en",
    );
    expect(r).toMatchObject({ ok: false, httpStatus: 400 });
    expect(writeLabelMock).not.toHaveBeenCalled();
  });

  it("writes label, updates status, refreshes aggregates", async () => {
    const appendSpy = vi.spyOn(await import("@disclo/core"), "appendAuditLog");
    appendSpy.mockResolvedValue({ id: "audit-1" });

    const prisma = {
      ...prismaBase,
      scanItem: {
        ...prismaBase.scanItem,
        update: vi.fn().mockResolvedValue({}),
      },
    } as never;

    const r = await applyAiDisclosureLabel(
      prisma,
      shopDomain,
      "scan-1",
      "item-1",
      "en",
    );

    expect(r).toEqual({ ok: true });
    expect(writeLabelMock).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: "shopify",
        shop_id: "shop-1",
        external_id: "99",
        action: "add_label",
        meta_key: "eu_ai_compliance.ai_content_disclosure",
      }),
    );
    expect(appendSpy).toHaveBeenCalledWith(
      prisma,
      expect.objectContaining({
        action: "labelled",
        scanItemId: "item-1",
        regulationCitations: ["eu_ai_act_art50"],
      }),
    );
    expect(prisma.scanItem.update).toHaveBeenCalledWith({
      where: { id: "item-1" },
      data: { status: "labelled" },
    });
    expect(refreshMock).toHaveBeenCalledWith(prisma, "scan-1");

    appendSpy.mockRestore();
  });
});
