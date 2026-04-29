import type { PrismaClient } from "@disclo/db";
import type { Plan } from "@prisma/client";
import { formatDiscloSubscriptionName } from "./subscription-payload.server.js";

/** Paid plans exposed to Shopify recurring billing (free is implicit, no subscription). */
export const SHOPIFY_BILLABLE_PLAN_SLUGS = [
  "basic",
  "pro",
  "agency",
  "enterprise",
] as const;

export type BillablePlanSlug = (typeof SHOPIFY_BILLABLE_PLAN_SLUGS)[number];

export type GraphqlExecutor = {
  graphql: (
    query: string,
    options?: { variables?: Record<string, unknown> },
  ) => Promise<Response>;
};

export function recurringLineItemsUsd(monthlyUsd: number): Array<{
  plan: {
    appRecurringPricingDetails: {
      price: { amount: number; currencyCode: string };
      interval: string;
    };
  };
}> {
  return [
    {
      plan: {
        appRecurringPricingDetails: {
          price: { amount: monthlyUsd, currencyCode: "USD" },
          interval: "EVERY_30_DAYS",
        },
      },
    },
  ];
}

const DEFAULT_ENTERPRISE_MONTHLY_USD = 499;

/**
 * Shopify line-item price for `appSubscriptionCreate`.
 * Seed may leave Enterprise monthly null; billing still needs a numeric amount.
 */
export function monthlyUsdForShopifySubscription(plan: Plan): number {
  if (plan.priceMonthlyUsd != null) {
    const n = parseFloat(String(plan.priceMonthlyUsd));
    if (!Number.isFinite(n)) {
      throw new Error(`Invalid monthly price on plan ${plan.name}`);
    }
    return n;
  }
  if (plan.name === "enterprise") {
    return DEFAULT_ENTERPRISE_MONTHLY_USD;
  }
  throw new Error(`Missing monthly price for plan ${plan.name}`);
}

const CREATE_SUBSCRIPTION = `#graphql
  mutation DiscloAppSubscriptionCreate(
    $name: String!
    $lineItems: [AppSubscriptionLineItemInput!]!
    $returnUrl: URL!
    $test: Boolean
  ) {
    appSubscriptionCreate(
      name: $name
      lineItems: $lineItems
      returnUrl: $returnUrl
      test: $test
    ) {
      confirmationUrl
      userErrors {
        field
        message
      }
    }
  }
`;

const CANCEL_SUBSCRIPTION = `#graphql
  mutation DiscloAppSubscriptionCancel($id: ID!) {
    appSubscriptionCancel(id: $id) {
      userErrors {
        field
        message
      }
    }
  }
`;

export async function cancelShopifyAppSubscription(
  admin: GraphqlExecutor,
  subscriptionGid: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await admin.graphql(CANCEL_SUBSCRIPTION, {
    variables: { id: subscriptionGid },
  });
  const json = (await res.json()) as {
    data?: {
      appSubscriptionCancel?: {
        userErrors?: Array<{ message?: string }>;
      };
    };
    errors?: Array<{ message?: string }>;
  };
  const gqlErrors = json.errors?.map((e) => e.message).filter(Boolean);
  if (gqlErrors?.length) {
    return { ok: false, message: gqlErrors.join("; ") };
  }
  const userErrors =
    json.data?.appSubscriptionCancel?.userErrors?.filter(Boolean) ?? [];
  if (userErrors.length) {
    return {
      ok: false,
      message: userErrors.map((e) => e.message ?? "").join("; "),
    };
  }
  return { ok: true };
}

export async function createShopifyAppSubscriptionCheckout(args: {
  admin: GraphqlExecutor;
  plan: Plan;
  returnUrl: string;
  /** Dev stores / Partners test mode — passes `test: true` into Shopify. */
  test: boolean;
}): Promise<
  { ok: true; confirmationUrl: string } | { ok: false; message: string }
> {
  const { admin, plan, returnUrl, test } = args;
  if (!SHOPIFY_BILLABLE_PLAN_SLUGS.includes(plan.name as BillablePlanSlug)) {
    return { ok: false, message: "This plan is not available for checkout." };
  }
  const name = formatDiscloSubscriptionName(plan.name);
  const monthlyUsd = monthlyUsdForShopifySubscription(plan);
  const lineItems = recurringLineItemsUsd(monthlyUsd);

  const res = await admin.graphql(CREATE_SUBSCRIPTION, {
    variables: {
      name,
      lineItems,
      returnUrl,
      test,
    },
  });

  const json = (await res.json()) as {
    data?: {
      appSubscriptionCreate?: {
        confirmationUrl?: string | null;
        userErrors?: Array<{ message?: string }>;
      };
    };
    errors?: Array<{ message?: string }>;
  };

  const gqlErrors = json.errors?.map((e) => e.message).filter(Boolean);
  if (gqlErrors?.length) {
    return { ok: false, message: gqlErrors.join("; ") };
  }

  const userErrors =
    json.data?.appSubscriptionCreate?.userErrors?.filter(Boolean) ?? [];
  if (userErrors.length) {
    return {
      ok: false,
      message: userErrors.map((e) => e.message ?? "").join("; "),
    };
  }

  const confirmationUrl = json.data?.appSubscriptionCreate?.confirmationUrl;
  if (!confirmationUrl) {
    return {
      ok: false,
      message: "Shopify did not return a confirmation URL for this charge.",
    };
  }

  return { ok: true, confirmationUrl };
}

/** Loads billable plan rows for the billing UI (ordered Basic → Enterprise). */
export async function loadBillablePlans(prisma: PrismaClient): Promise<Plan[]> {
  const plans = await prisma.plan.findMany({
    where: {
      active: true,
      name: { in: [...SHOPIFY_BILLABLE_PLAN_SLUGS] },
    },
  });
  const order = new Map(SHOPIFY_BILLABLE_PLAN_SLUGS.map((n, i) => [n, i]));
  return [...plans].sort(
    (a, b) => (order.get(a.name) ?? 99) - (order.get(b.name) ?? 99),
  );
}

export function shouldPassShopifyBillingTestFlag(nodeEnv: string): boolean {
  return nodeEnv !== "production";
}
