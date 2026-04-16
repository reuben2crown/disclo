import { describe, expect, it, vi } from "vitest";
import type { PlanFeatures, PlanRowSnapshot } from "./plan-features.js";
import { createGetFeatures, type PlanCache } from "./plan-resolver.js";

const samplePlan: PlanRowSnapshot = {
  id: "plan-pro",
  name: "pro",
  displayName: "Pro",
  maxItemsPerScan: 1500,
  textDetection: true,
  imageDetection: true,
  fixDashboard: true,
  auditLog: true,
  auditLogPdfExport: true,
  monthlyAutoScan: true,
  rewriteEngine: true,
  maxShops: 3,
  whiteLabelReports: false,
  apiAccess: true,
  apiMonthlyCalls: null,
  teamMembers: 3,
  slaSupport: "email",
};

function memoryCache(): PlanCache & { entries: Map<string, string> } {
  const entries = new Map<string, string>();
  return {
    entries,
    async get(key: string) {
      return entries.get(key) ?? null;
    },
    async set(key: string, value: string, _ttlSeconds: number) {
      entries.set(key, value);
    },
  };
}

describe("createGetFeatures", () => {
  it("returns null when fetchRow returns null", async () => {
    const cache = memoryCache();
    const fetchRow = vi.fn().mockResolvedValue(null);
    const getFeatures = createGetFeatures({
      cache,
      fetchRow,
      ttlSeconds: 300,
      cacheKeyPrefix: "test:plan:",
    });
    await expect(getFeatures("shop-1")).resolves.toBeNull();
    expect(fetchRow).toHaveBeenCalledTimes(1);
    expect(fetchRow).toHaveBeenCalledWith("shop-1");
    expect(cache.entries.size).toBe(0);
  });

  it("loads from fetchRow on cache miss and stores JSON in cache", async () => {
    const cache = memoryCache();
    const fetchRow = vi.fn().mockResolvedValue({
      plan: samplePlan,
      planOverride: null,
    });
    const getFeatures = createGetFeatures({
      cache,
      fetchRow,
      ttlSeconds: 300,
      cacheKeyPrefix: "test:plan:",
    });
    const first = await getFeatures("shop-a");
    expect(first).not.toBeNull();
    expect(first?.name).toBe("pro");
    expect(fetchRow).toHaveBeenCalledTimes(1);

    const raw = cache.entries.get("test:plan:shop-a");
    expect(raw).toBeDefined();
    const parsed = JSON.parse(raw!) as PlanFeatures;
    expect(parsed.id).toBe("plan-pro");

    fetchRow.mockClear();
    const second = await getFeatures("shop-a");
    expect(second).toEqual(first);
    expect(fetchRow).not.toHaveBeenCalled();
  });

  it("bypasses cache when skipCache is true", async () => {
    const cache = memoryCache();
    const fetchRow = vi
      .fn()
      .mockResolvedValueOnce({
        plan: samplePlan,
        planOverride: null,
      })
      .mockResolvedValueOnce({
        plan: { ...samplePlan, maxItemsPerScan: 10 },
        planOverride: null,
      });
    const getFeatures = createGetFeatures({
      cache,
      fetchRow,
      ttlSeconds: 300,
      cacheKeyPrefix: "test:plan:",
    });
    await getFeatures("shop-b");
    await getFeatures("shop-b", { skipCache: true });
    expect(fetchRow).toHaveBeenCalledTimes(2);
  });
});

describe("createGetFeatures merge", () => {
  it("applies override from fetchRow", async () => {
    const cache = memoryCache();
    const freeLike: PlanRowSnapshot = {
      ...samplePlan,
      id: "free-id",
      name: "free",
      imageDetection: false,
      rewriteEngine: false,
    };
    const fetchRow = vi.fn().mockResolvedValue({
      plan: freeLike,
      planOverride: {
        overrides: { imageDetection: true },
        expiresAt: null,
      },
    });
    const getFeatures = createGetFeatures({
      cache,
      fetchRow,
      ttlSeconds: 300,
      cacheKeyPrefix: "pfx:",
    });
    const f = await getFeatures("s1");
    expect(f?.imageDetection).toBe(true);
    expect(f?.rewriteEngine).toBe(false);
  });
});
