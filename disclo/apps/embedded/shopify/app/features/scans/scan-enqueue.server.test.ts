import { describe, expect, it, vi, beforeEach } from "vitest";

const getFeaturesMock = vi.hoisted(() => vi.fn());

vi.mock("ioredis", () => ({
  Redis: class MockRedis {
    quit = vi.fn().mockResolvedValue(undefined);
  },
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
    createScanOrchestratorQueue: vi.fn(() => ({
      close: vi.fn().mockResolvedValue(undefined),
    })),
    enqueueScanOrchestratorJob: vi.fn().mockResolvedValue(undefined),
    requireFeature: vi.fn(),
    listShopIdsWithMonthlyAutoScanPlan: vi.fn().mockResolvedValue([]),
  };
});

import { PlanError, requireFeature } from "@disclo/core";
import { enqueueFullShopScan, enqueueProductIncrementalScan } from "./scan-enqueue.server";

describe("enqueueFullShopScan", () => {
  const shopDomain = "s.myshopify.com";
  const scanCreate = vi.fn();
  const prisma = {
    shop: {
      findUnique: vi.fn().mockResolvedValue({
        id: "shop-1",
        platform: "shopify",
        externalDomain: shopDomain,
      }),
    },
    scan: { create: scanCreate },
  } as never;

  beforeEach(() => {
    vi.clearAllMocks();
    getFeaturesMock.mockReset();
  });

  it("returns 400 when plan features are missing", async () => {
    getFeaturesMock.mockResolvedValue(null);
    const result = await enqueueFullShopScan(prisma, shopDomain, "merchant");
    expect(result).toMatchObject({
      ok: false,
      error: expect.stringContaining("plan has not synced"),
      httpStatus: 400,
      actionUrl: "https://s.myshopify.com/admin/settings/apps",
      actionLabel: "Open Apps and sales channels",
    });
    expect(scanCreate).not.toHaveBeenCalled();
  });

  it("returns 403 with apps CTA when plan blocks a feature", async () => {
    getFeaturesMock.mockResolvedValue({ textDetection: true } as never);
    vi.mocked(requireFeature).mockImplementationOnce(() => {
      throw new PlanError("Not on your plan");
    });
    const result = await enqueueFullShopScan(prisma, shopDomain, "merchant");
    expect(result).toMatchObject({
      ok: false,
      error: "Not on your plan",
      httpStatus: 403,
      actionUrl: "https://s.myshopify.com/admin/settings/apps",
      actionLabel: "Open Apps and sales channels",
    });
    expect(scanCreate).not.toHaveBeenCalled();
  });
});

describe("enqueueProductIncrementalScan", () => {
  const shopDomain = "s.myshopify.com";
  const scanCreate = vi.fn();
  const prisma = {
    shop: {
      findUnique: vi.fn().mockResolvedValue({
        id: "shop-1",
        platform: "shopify",
        externalDomain: shopDomain,
      }),
    },
    scan: { create: scanCreate },
  } as never;

  beforeEach(() => {
    vi.clearAllMocks();
    getFeaturesMock.mockReset();
  });

  it("returns 400 when plan features are missing", async () => {
    getFeaturesMock.mockResolvedValue(null);
    const result = await enqueueProductIncrementalScan(
      prisma,
      shopDomain,
      "123",
    );
    expect(result).toMatchObject({
      ok: false,
      error: expect.stringContaining("plan has not synced"),
      httpStatus: 400,
      actionUrl: "https://s.myshopify.com/admin/settings/apps",
      actionLabel: "Open Apps and sales channels",
    });
    expect(scanCreate).not.toHaveBeenCalled();
  });
});
