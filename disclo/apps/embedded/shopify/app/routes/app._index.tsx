import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData, useNavigate, useOutletContext, useRevalidator, } from "@remix-run/react";
import { Banner, BlockStack, Button, Card, ChoiceList, InlineGrid, List, Page, ProgressBar, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { getMerchantMessages } from "@disclo/core/i18n";
import prisma from "../db.server";
import { getDashboardShopSnapshot } from "../features/dashboard/dashboard-data.server.js";
import type { AppI18nOutletContext } from "../locales/i18n-outlet-context.js";
import { localeFromRequest } from "../locales/i18n.server.js";
import { getMerchantSupportEmail } from "../features/dashboard/merchant-support.server.js";
import { parseTargetMarketsFromForm } from "../features/dashboard/target-markets-form.server.js";
import { authenticate } from "../shopify.server";

const MARKET_CHOICES = [
  { label: "European Union", value: "EU" },
  { label: "United States (federal)", value: "US" },
  { label: "Florida (US-FL)", value: "US-FL" },
  { label: "New York (US-NY)", value: "US-NY" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const snapshot = await getDashboardShopSnapshot(prisma, session.shop);
  return {
    snapshot,
    shopDomain: session.shop,
    merchantSupportEmail: getMerchantSupportEmail(),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const m = getMerchantMessages(localeFromRequest(request));
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent !== "updateMarkets") {
    return json(
      { ok: false, error: m.dashboard.unknownAction },
      { status: 400 },
    );
  }

  const shop = await prisma.shop.findUnique({
    where: {
      platform_externalDomain: {
        platform: "shopify",
        externalDomain: session.shop,
      },
    },
  });

  if (!shop) {
    return json(
      { ok: false, error: m.dashboard.shopMissingMarkets },
      { status: 404 },
    );
  }

  const markets = parseTargetMarketsFromForm(formData.getAll("markets"));

  if (markets.length === 0) {
    return json(
      { ok: false, error: m.dashboard.marketsRequired },
      { status: 400 },
    );
  }

  await prisma.shopSettings.upsert({
    where: { shopId: shop.id },
    create: { shopId: shop.id, targetMarkets: markets },
    update: { targetMarkets: markets },
  });

  return json({ ok: true });
};

export default function Dashboard() {
  const { m } = useOutletContext<AppI18nOutletContext>();
  const { snapshot, shopDomain, merchantSupportEmail } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const scanFetcher = useFetcher<{
    ok?: boolean;
    error?: string;
    scanId?: string;
    actionUrl?: string;
    actionLabel?: string;
  }>();
  const marketsFetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const notifFetcher = useFetcher<{
    unreadCount: number;
    latest: {
      id: string;
      title: string;
      body: string | null;
      link: string | null;
      createdAt: string;
    } | null;
  }>();
  const [marketsSelected, setMarketsSelected] = useState<string[]>(
    () => snapshot?.targetMarkets ?? ["EU"],
  );

  useEffect(() => {
    if (snapshot?.targetMarkets?.length) {
      setMarketsSelected(snapshot.targetMarkets);
    }
  }, [snapshot?.targetMarkets]);

  useEffect(() => {
    if (scanFetcher.data?.ok && scanFetcher.data.scanId) {
      navigate(`/app/scans/${scanFetcher.data.scanId}`);
    }
  }, [scanFetcher.data, navigate]);

  useEffect(() => {
    if (marketsFetcher.data?.ok) {
      revalidator.revalidate();
    }
  }, [marketsFetcher.data, revalidator]);

  useEffect(() => {
    notifFetcher.load("/app/notifications");
    const t = setInterval(() => {
      notifFetcher.load("/app/notifications");
    }, 15000);
    return () => clearInterval(t);
  }, [notifFetcher]);

  const complianceLabel =
    snapshot?.displayRiskScore != null
      ? String(snapshot.displayRiskScore)
      : m.dashboard.complianceUnavailable;

  const lastScanLabel = snapshot?.lastScanAt
    ? new Date(snapshot.lastScanAt).toLocaleString()
    : m.dashboard.noScansYet;

  const rb = snapshot?.riskBreakdown;
  const pct = (n: number, d: number) =>
    d > 0 ? Math.round((n / d) * 100) : 0;

  return (
    <Page>
      <TitleBar title={m.dashboard.titleBar} />
      <BlockStack gap="500">
        {!snapshot && (
          <Banner tone="warning" title={m.dashboard.setupBannerTitle}>
            <p>{m.dashboard.setupBannerBody(shopDomain)}</p>
          </Banner>
        )}

        {snapshot && (
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                {m.dashboard.onboardingHeading}
              </Text>
              <List type="bullet">
                <List.Item>
                  {snapshot.onboarding.shopLinked
                    ? m.dashboard.onboardingLinked
                    : m.dashboard.onboardingLinkShop}
                </List.Item>
                <List.Item>
                  {snapshot.onboarding.marketsConfigured
                    ? m.dashboard.onboardingMarketsOk
                    : m.dashboard.onboardingMarketsTodo}
                </List.Item>
                <List.Item>
                  {snapshot.onboarding.firstScanComplete
                    ? m.dashboard.onboardingScanOk
                    : m.dashboard.onboardingScanTodo}
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        )}

        {snapshot?.activeScan && (
          <Banner tone="info" title={m.dashboard.activeScanTitle}>
            <p>
              {m.dashboard.activeScanBody(
                snapshot.activeScan.processedItems,
                String(snapshot.activeScan.totalItems ?? "—"),
              )}{" "}
              <Link to={`/app/scans/${snapshot.activeScan.id}`}>
                {m.dashboard.openLiveProgress}
              </Link>
            </p>
          </Banner>
        )}

        {scanFetcher.data && !scanFetcher.data.ok && scanFetcher.data.error && (
          <Banner tone="critical" title={m.dashboard.scanFailedTitle}>
            <BlockStack gap="200">
              <p>{scanFetcher.data.error}</p>
              {scanFetcher.data.actionUrl && scanFetcher.data.actionLabel ? (
                <Button
                  url={scanFetcher.data.actionUrl}
                  external
                  variant="primary"
                >
                  {scanFetcher.data.actionLabel}
                </Button>
              ) : null}
            </BlockStack>
          </Banner>
        )}

        {marketsFetcher.data && !marketsFetcher.data.ok && marketsFetcher.data.error && (
          <Banner
            tone="critical"
            title={m.dashboard.marketsFailedTitle}
          >
            <p>{marketsFetcher.data.error}</p>
          </Banner>
        )}

        {notifFetcher.data?.latest && (
          <Banner tone="info" title={notifFetcher.data.latest.title}>
            <BlockStack gap="200">
              {notifFetcher.data.latest.body ? <p>{notifFetcher.data.latest.body}</p> : null}
              {notifFetcher.data.latest.link ? (
                <Link to={notifFetcher.data.latest.link}>Open</Link>
              ) : null}
            </BlockStack>
          </Banner>
        )}

        <InlineGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="400">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                {m.dashboard.complianceHeading}
              </Text>
              <Text as="p" variant="heading2xl">
                {complianceLabel}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                {m.dashboard.complianceHelp}
              </Text>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                {m.dashboard.planHeading}
              </Text>
              <Text as="p" variant="bodyLg">
                {snapshot?.planDisplayName ?? "—"}
              </Text>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                {m.dashboard.lastScanHeading}
              </Text>
              <Text as="p" variant="bodyMd">
                {lastScanLabel}
              </Text>
              {snapshot?.lastScanStatus && (
                <Text as="p" variant="bodySm" tone="subdued">
                  {m.dashboard.lastScanStatus(snapshot.lastScanStatus)}
                </Text>
              )}
            </BlockStack>
          </Card>
        </InlineGrid>

        {rb && rb.total > 0 && (
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                {m.dashboard.riskHeading}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                {m.dashboard.riskHelp}
              </Text>
              <BlockStack gap="200">
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm">
                    {m.dashboard.riskHigh(
                      rb.high,
                      pct(rb.high, rb.total),
                    )}
                  </Text>
                  <ProgressBar progress={pct(rb.high, rb.total)} tone="critical" />
                </BlockStack>
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm">
                    {m.dashboard.riskReview(
                      rb.review,
                      pct(rb.review, rb.total),
                    )}
                  </Text>
                  <ProgressBar progress={pct(rb.review, rb.total)} tone="highlight" />
                </BlockStack>
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm">
                    {m.dashboard.riskClear(
                      rb.none,
                      pct(rb.none, rb.total),
                    )}
                  </Text>
                  <ProgressBar progress={pct(rb.none, rb.total)} tone="success" />
                </BlockStack>
              </BlockStack>
            </BlockStack>
          </Card>
        )}

        {snapshot && snapshot.applicableRegulations.length > 0 && (
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                {m.dashboard.regulationsHeading}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                {m.dashboard.regulationsHelp}
              </Text>
              <InlineGrid columns={{ xs: 1, sm: 2 }} gap="300">
                {snapshot.applicableRegulations.map((r) => (
                  <Card key={r.code} padding="400">
                    <BlockStack gap="100">
                      <Text as="span" variant="bodyMd" fontWeight="semibold">
                        {r.displayName}
                      </Text>
                      <Text as="span" variant="bodySm" tone="subdued">
                        {r.category === "ai_disclosure"
                          ? m.dashboard.regAi
                          : m.dashboard.regGreen}
                      </Text>
                    </BlockStack>
                  </Card>
                ))}
              </InlineGrid>
            </BlockStack>
          </Card>
        )}

        {snapshot && (
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                {m.dashboard.marketsHeading}
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                {m.dashboard.marketsHelp}
              </Text>
              <ChoiceList
                title={m.dashboard.choiceListTitle}
                titleHidden
                choices={MARKET_CHOICES}
                selected={marketsSelected}
                onChange={(v) => {
                  setMarketsSelected(v);
                  const fd = new FormData();
                  fd.set("intent", "updateMarkets");
                  for (const m of v) {
                    fd.append("markets", m);
                  }
                  marketsFetcher.submit(fd, { method: "post" });
                }}
                allowMultiple
              />
              {marketsFetcher.state !== "idle" && (
                <Text as="p" variant="bodySm" tone="subdued">
                  {m.dashboard.saving}
                </Text>
              )}
            </BlockStack>
          </Card>
        )}

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              {m.dashboard.quickActionsHeading}
            </Text>
            <scanFetcher.Form method="post" action="/app/scan">
              <Button
                variant="primary"
                submit
                disabled={!snapshot || scanFetcher.state !== "idle"}
                loading={scanFetcher.state !== "idle"}
              >
                {m.dashboard.startFullScan}
              </Button>
            </scanFetcher.Form>
            <Text as="p" variant="bodySm" tone="subdued">
              {m.dashboard.quickActionsHelp(merchantSupportEmail)}
            </Text>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
