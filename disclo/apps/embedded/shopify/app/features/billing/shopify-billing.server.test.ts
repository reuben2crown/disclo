import { Prisma } from "@prisma/client";
import { describe, expect, it } from "vitest";
import type { Plan } from "@prisma/client";
import {
  monthlyUsdForShopifySubscription,
  recurringLineItemsUsd,
  shouldPassShopifyBillingTestFlag,
} from "./shopify-billing.server.js";

describe("recurringLineItemsUsd", () => {
  it("builds a single USD every-30-days line item", () => {
    const items = recurringLineItemsUsd(29);
    expect(items).toHaveLength(1);
    expect(items[0]?.plan.appRecurringPricingDetails.price.amount).toBe(29);
    expect(items[0]?.plan.appRecurringPricingDetails.price.currencyCode).toBe(
      "USD",
    );
    expect(items[0]?.plan.appRecurringPricingDetails.interval).toBe(
      "EVERY_30_DAYS",
    );
  });
});

describe("monthlyUsdForShopifySubscription", () => {
  it("uses plan.priceMonthlyUsd when set", () => {
    const p = {
      name: "basic",
      priceMonthlyUsd: new Prisma.Decimal("29.00"),
    } as Plan;
    expect(monthlyUsdForShopifySubscription(p)).toBe(29);
  });
  it("falls back for enterprise when price is null", () => {
    const p = {
      name: "enterprise",
      priceMonthlyUsd: null,
    } as Plan;
    expect(monthlyUsdForShopifySubscription(p)).toBe(499);
  });
});

describe("shouldPassShopifyBillingTestFlag", () => {
  it("enables test charges outside production", () => {
    expect(shouldPassShopifyBillingTestFlag("development")).toBe(true);
    expect(shouldPassShopifyBillingTestFlag("test")).toBe(true);
    expect(shouldPassShopifyBillingTestFlag("production")).toBe(false);
  });
});
