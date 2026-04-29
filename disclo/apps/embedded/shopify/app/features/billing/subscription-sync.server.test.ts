import { describe, expect, it, vi } from "vitest";
import { syncShopPlanFromAppSubscriptionsWebhook } from "./subscription-sync.server.js";

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

describe("syncShopPlanFromAppSubscriptionsWebhook", () => {
  it("routes ACTIVE webhook through shared billing finalization", async () => {
    const prisma = createPrismaMock();
    prisma.shop.findFirst.mockResolvedValue({ id: "shop-1" });
    prisma.plan.findUnique
      .mockResolvedValueOnce({ id: "plan-free" })
      .mockResolvedValueOnce({ id: "plan-pro", active: true });

    const result = await syncShopPlanFromAppSubscriptionsWebhook({
      prisma: prisma as never,
      redis: null,
      shopDomain: "demo.myshopify.com",
      payload: {
        app_subscription: {
          admin_graphql_api_id: "gid://shopify/AppSubscription/1",
          name: "Disclo (pro)",
          status: "ACTIVE",
        },
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
