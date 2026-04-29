import { describe, expect, it, vi } from "vitest";
import { finalizeBillingSubscriptionChange } from "./finalize-subscription-change.server.js";

function createPrismaMock() {
  return {
    shop: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    plan: {
      findUnique: vi.fn(),
    },
  };
}

describe("finalizeBillingSubscriptionChange", () => {
  it("moves shop to free plan on ended lifecycle", async () => {
    const prisma = createPrismaMock();
    prisma.shop.findFirst.mockResolvedValue({ id: "shop-1" });
    prisma.plan.findUnique.mockResolvedValueOnce({ id: "plan-free" });
    const redis = { del: vi.fn().mockResolvedValue(1) };

    const result = await finalizeBillingSubscriptionChange({
      prisma: prisma as never,
      redis: redis as never,
      input: {
        shopDomain: "demo.myshopify.com",
        providerSubscriptionId: null,
        providerPlanSlug: null,
        lifecycleStatus: "ended",
      },
    });

    expect(result).toEqual({ ok: true });
    expect(prisma.shop.update).toHaveBeenCalledWith({
      where: { id: "shop-1" },
      data: { planId: "plan-free", billingId: null },
    });
    expect(redis.del).toHaveBeenCalledTimes(1);
  });

  it("applies provider plan on live lifecycle", async () => {
    const prisma = createPrismaMock();
    prisma.shop.findFirst.mockResolvedValue({ id: "shop-1" });
    prisma.plan.findUnique
      .mockResolvedValueOnce({ id: "plan-free" })
      .mockResolvedValueOnce({ id: "plan-pro", active: true });

    const result = await finalizeBillingSubscriptionChange({
      prisma: prisma as never,
      redis: null,
      input: {
        shopDomain: "demo.myshopify.com",
        providerSubscriptionId: "gid://shopify/AppSubscription/1",
        providerPlanSlug: "pro",
        lifecycleStatus: "live",
      },
    });

    expect(result).toEqual({ ok: true });
    expect(prisma.shop.update).toHaveBeenCalledWith({
      where: { id: "shop-1" },
      data: {
        planId: "plan-pro",
        billingId: "gid://shopify/AppSubscription/1",
      },
    });
  });
});
