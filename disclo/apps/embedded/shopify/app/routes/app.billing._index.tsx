import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Banner,
  BlockStack,
  Button,
  Card,
  FormLayout,
  InlineStack,
  Page,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { invalidateShopPlanFeaturesCache, loadServerEnv } from "@disclo/core";
import type { Plan } from "@prisma/client";
import { Redis } from "ioredis";
import {
  Form,
  useActionData,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import prisma from "../db.server.js";
import type { AppI18nOutletContext } from "../locales/i18n-outlet-context.js";
import {
  cancelShopifyAppSubscription,
  createShopifyAppSubscriptionCheckout,
  loadBillablePlans,
  type BillablePlanSlug,
  shouldPassShopifyBillingTestFlag,
  SHOPIFY_BILLABLE_PLAN_SLUGS,
} from "../features/billing/shopify-billing.server.js";
import { authenticate } from "../shopify.server.js";

function isBillableSlug(s: string): s is BillablePlanSlug {
  return (SHOPIFY_BILLABLE_PLAN_SLUGS as readonly string[]).includes(s);
}

function highlightFor(
  planName: string,
  m: AppI18nOutletContext["m"],
): string {
  switch (planName) {
    case "basic":
      return m.billing.highlightsBasic;
    case "pro":
      return m.billing.highlightsPro;
    case "agency":
      return m.billing.highlightsAgency;
    case "enterprise":
      return m.billing.highlightsEnterprise;
    default:
      return "";
  }
}

function formatMonthlyPrice(plan: Plan): string {
  if (plan.priceMonthlyUsd == null && plan.name === "enterprise") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(499);
  }
  if (plan.priceMonthlyUsd == null) {
    return "—";
  }
  const n = parseFloat(String(plan.priceMonthlyUsd));
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function formatItemLimit(plan: Plan, m: AppI18nOutletContext["m"]): string {
  if (plan.maxItemsPerScan == null) {
    return m.billing.unlimited;
  }
  return String(plan.maxItemsPerScan);
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const flash =
    url.searchParams.get("downgraded") === "1"
      ? "downgrade" as const
      : url.searchParams.get("checkout") === "1"
        ? "checkout" as const
        : null;
  const shop = await prisma.shop.findFirst({
    where: { platform: "shopify", externalDomain: session.shop },
    include: { plan: true },
  });
  const billablePlans = await loadBillablePlans(prisma);
  return json({ shop, billablePlans, flash });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const env = loadServerEnv();
  const nodeEnv = env.NODE_ENV ?? "development";

  const shop = await prisma.shop.findFirst({
    where: { platform: "shopify", externalDomain: session.shop },
    include: { plan: true },
  });
  if (!shop) {
    return json({ error: "Shop not found." }, { status: 404 });
  }

  const connectRedis = async (): Promise<Redis | null> => {
    const redisUrl = env.REDIS_URL;
    if (!redisUrl) {
      return null;
    }
    return new Redis(redisUrl, { maxRetriesPerRequest: null });
  };

  if (intent === "downgrade") {
    if (!shop.billingId) {
      return json({
        error:
          "No Shopify subscription is on file for this shop. Pick a paid plan first.",
      });
    }
    const canceled = await cancelShopifyAppSubscription(admin, shop.billingId);
    if (!canceled.ok) {
      return json({ error: canceled.message });
    }
    const freePlan = await prisma.plan.findUnique({ where: { name: "free" } });
    if (!freePlan) {
      return json({ error: "Server misconfiguration (missing free plan)." });
    }
    await prisma.shop.update({
      where: { id: shop.id },
      data: { planId: freePlan.id, billingId: null },
    });
    const redis = await connectRedis();
    if (redis) {
      try {
        await invalidateShopPlanFeaturesCache(redis, shop.id);
      } finally {
        await redis.quit();
      }
    }
    return redirect("/app/billing?downgraded=1");
  }

  if (intent === "subscribe") {
    const planName = formData.get("plan");
    if (typeof planName !== "string" || !isBillableSlug(planName)) {
      return json({ error: "That plan is not available." });
    }
    const billPlan = await prisma.plan.findUnique({
      where: { name: planName },
    });
    if (!billPlan) {
      return json({ error: "Plan not found." });
    }

    if (shop.billingId && shop.plan.name !== "free") {
      const cancelFirst = await cancelShopifyAppSubscription(
        admin,
        shop.billingId,
      );
      if (!cancelFirst.ok) {
        return json({
          error: `We could not cancel the existing charge before starting a new one: ${cancelFirst.message}`,
        });
      }
    }

    const base = new URL(request.url).origin;
    const returnUrl = `${base}/app/billing?checkout=1`;

    const result = await createShopifyAppSubscriptionCheckout({
      admin,
      plan: billPlan,
      returnUrl,
      test: shouldPassShopifyBillingTestFlag(nodeEnv),
    });
    if (!result.ok) {
      return json({ error: result.message });
    }
    throw redirect(result.confirmationUrl);
  }

  return json({ error: "Unknown action." }, { status: 400 });
};

export default function BillingPage() {
  const { m } = useOutletContext<AppI18nOutletContext>();
  const { shop, billablePlans, flash } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  if (!shop) {
    return (
      <Page title={m.billing.pageTitle} backAction={{ url: "/app" }}>
        <TitleBar title={m.billing.titleBar} />
        <Text as="p" variant="bodyMd">
          {m.scan.shopMissing}
        </Text>
      </Page>
    );
  }

  const currentName = shop.plan.name;

  return (
    <Page title={m.billing.pageTitle} backAction={{ url: "/app" }}>
      <TitleBar title={m.billing.titleBar} />
      <BlockStack gap="500">
        {flash === "checkout" && (
          <Banner tone="success">{m.billing.checkoutReturn}</Banner>
        )}
        {flash === "downgrade" && (
          <Banner tone="info">{m.billing.downgradeReturn}</Banner>
        )}
        {actionData && "error" in actionData && actionData.error && (
          <Banner tone="critical">{actionData.error}</Banner>
        )}

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              {m.billing.currentPlanHeading}
            </Text>
            <Text as="p" variant="bodyMd">
              <strong>{shop.plan.displayName}</strong>
              {" · "}
              {formatMonthlyPrice(shop.plan)}
              {shop.plan.priceMonthlyUsd != null || shop.plan.name === "enterprise"
                ? m.billing.perMonth
                : ""}
            </Text>
          </BlockStack>
        </Card>

        <Text as="p" variant="bodyMd" tone="subdued">
          {m.billing.intro}
        </Text>

        <BlockStack gap="400">
          {billablePlans.map((plan) => {
            const isCurrent = currentName === plan.name;
            return (
              <Card key={plan.name}>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h3" variant="headingMd">
                      {plan.displayName}
                    </Text>
                    {isCurrent && (
                      <Text as="span" variant="bodySm" tone="success">
                        {m.billing.currentBadge}
                      </Text>
                    )}
                  </InlineStack>
                  <FormLayout>
                    <Text as="p" variant="bodyMd">
                      {formatMonthlyPrice(plan)}
                      {plan.priceMonthlyUsd != null || plan.name === "enterprise"
                        ? `${m.billing.perMonth} · `
                        : ""}
                      {m.billing.maxItemsLabel}: {formatItemLimit(plan, m)}
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      {highlightFor(plan.name, m)}
                    </Text>
                    {plan.name === "enterprise" && (
                      <Text as="p" variant="bodySm" tone="subdued">
                        {m.billing.enterpriseBlurb}
                      </Text>
                    )}
                  </FormLayout>
                  {!isCurrent && (
                    <Form method="post">
                      <input type="hidden" name="intent" value="subscribe" />
                      <input type="hidden" name="plan" value={plan.name} />
                      <Button variant="primary" submit>
                        {currentName === "free"
                          ? m.billing.subscribe
                          : m.billing.switchPlan}
                      </Button>
                    </Form>
                  )}
                </BlockStack>
              </Card>
            );
          })}
        </BlockStack>

        {currentName !== "free" && shop.billingId && (
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                {m.billing.downgrade}
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                {m.billing.downgradeHelp}
              </Text>
              <Form method="post">
                <input type="hidden" name="intent" value="downgrade" />
                <Button tone="critical" submit>
                  {m.billing.downgrade}
                </Button>
              </Form>
            </BlockStack>
          </Card>
        )}
      </BlockStack>
    </Page>
  );
}
