import { describe, expect, it, vi } from "vitest";
import { finalizeBillingSubscriptionChange } from "@disclo/core";

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

describe("finalizeBillingSubscriptionChange (from core)", () => {
  it("ends subscription into free plan", async () => {
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
    expect(prisma.shop.update).toHaveBeenCalled();
  });
});
