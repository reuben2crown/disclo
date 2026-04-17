import { useEffect } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "@remix-run/react";
import {
  Banner,
  BlockStack,
  Button,
  Card,
  InlineStack,
  Page,
  ProgressBar,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { getMerchantMessages } from "@disclo/core/i18n";
import type { AppI18nOutletContext } from "../locales/i18n-outlet-context.js";
import { localeFromRequest } from "../locales/i18n.server.js";
import prisma from "../db.server";
import { listScanItemsForTenantScan } from "../features/scans/scan-item-detail.server.js";
import { getScanProgressSnapshot } from "../features/scans/scan-progress.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const m = getMerchantMessages(localeFromRequest(request));
  const { session } = await authenticate.admin(request);
  const scanId = params.scanId;
  if (!scanId) {
    throw new Response(m.scanProgress.invalidLink, { status: 404 });
  }
  const progress = await getScanProgressSnapshot(
    prisma,
    session.shop,
    scanId,
  );
  if (!progress) {
    throw new Response(m.scanProgress.scanNotFound, { status: 404 });
  }

  const items =
    (await listScanItemsForTenantScan(prisma, session.shop, scanId)) ?? [];

  return { progress, items };
};

export default function ScanProgressPage() {
  const { m } = useOutletContext<AppI18nOutletContext>();
  const { progress, items } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  const isRunning =
    progress.status === "pending" || progress.status === "running";

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const id = setInterval(() => {
      void revalidator.revalidate();
    }, 2500);
    return () => clearInterval(id);
  }, [isRunning, revalidator]);

  const totalLabel =
    progress.totalItems != null ? String(progress.totalItems) : "—";

  const stageProgress = isRunning ? progress.progressPct : 100;

  return (
    <Page
      backAction={{
        content: m.scanProgress.backScans,
        url: "/app/scans",
      }}
    >
      <TitleBar title={m.scanProgress.titleBar} />
      <BlockStack gap="500">
        <Text as="p" variant="bodyMd" tone="subdued">
          {m.scanProgress.scanIdLine(progress.id)}
        </Text>

        {progress.status === "completed" && (
          <Banner tone="success" title={m.scanProgress.completedTitle}>
            <p>
              {m.scanProgress.completedBody(
                progress.riskScore != null ? String(progress.riskScore) : "—",
                progress.flaggedItems != null
                  ? String(progress.flaggedItems)
                  : "—",
              )}
            </p>
          </Banner>
        )}

        {isRunning && (
          <Banner tone="info" title={m.scanProgress.runningTitle}>
            <p>{m.scanProgress.runningBody}</p>
          </Banner>
        )}

        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              {m.scanProgress.overallHeading}
            </Text>
            <Text as="p" variant="bodyMd">
              {m.scanProgress.overallProcessed(
                progress.processedItems,
                totalLabel,
              )}
            </Text>
            <ProgressBar progress={progress.progressPct} tone="primary" />
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              {m.scanProgress.pipelineHeading}
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              {m.scanProgress.pipelineHelp}
            </Text>
            <BlockStack gap="300">
              <BlockStack gap="100">
                <Text as="p" variant="bodySm">
                  {m.scanProgress.stageText}
                </Text>
                <ProgressBar progress={stageProgress} tone="highlight" />
              </BlockStack>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm">
                  {m.scanProgress.stageImage}
                </Text>
                <ProgressBar progress={stageProgress} tone="highlight" />
              </BlockStack>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm">
                  {m.scanProgress.stageClaims}
                </Text>
                <ProgressBar progress={stageProgress} tone="highlight" />
              </BlockStack>
            </BlockStack>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              {m.scanItemDetail.itemsHeading}
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              {m.scanItemDetail.itemsIntro}
            </Text>
            <BlockStack gap="200">
              {items.map((row) => (
                <InlineStack
                  key={row.id}
                  align="space-between"
                  blockAlign="center"
                  wrap={false}
                >
                  <BlockStack gap="050">
                    <Text as="p" variant="bodyMd" fontWeight="semibold">
                      {m.scanItemDetail.productId(row.contentId)}
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      {m.scanItemDetail.riskLevel}: {row.riskLevel} ·{" "}
                      {m.scanItemDetail.status}: {row.status}
                    </Text>
                  </BlockStack>
                  <Button
                    url={`/app/scans/${progress.id}/items/${row.id}`}
                    variant="plain"
                  >
                    {m.scanItemDetail.viewItem}
                  </Button>
                </InlineStack>
              ))}
            </BlockStack>
          </BlockStack>
        </Card>

        <Button url="/app">{m.scanProgress.openDashboard}</Button>
      </BlockStack>
    </Page>
  );
}
