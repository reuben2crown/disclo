import { useCallback, useMemo } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  BlockStack,
  Button,
  Card,
  EmptySearchResult,
  IndexTable,
  InlineStack,
  Page,
  Select,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { REGULATION_CONFIGS } from "@disclo/core/regulations";
import { createPlanFeatureService, loadServerEnv } from "@disclo/core";
import { Redis } from "ioredis";
import { useLoaderData, useOutletContext, useSearchParams } from "@remix-run/react";
import { loadAuditLogsForShop } from "../features/audit/audit-log.server.js";
import type { AppI18nOutletContext } from "../locales/i18n-outlet-context.js";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const regulation = url.searchParams.get("regulation")?.trim() || null;

  const shop = await prisma.shop.findFirst({
    where: { platform: "shopify", externalDomain: session.shop },
    select: { id: true },
  });

  let auditAllowed = false;
  let pdfAllowed = false;

  const env = loadServerEnv();
  const redisUrl = env.REDIS_URL;
  if (shop && redisUrl) {
    const redis = new Redis(redisUrl, { maxRetriesPerRequest: null });
    try {
      const { getFeatures } = createPlanFeatureService(prisma, redis);
      const features = await getFeatures(shop.id);
      if (features) {
        auditAllowed = features.auditLog === true;
        pdfAllowed = features.auditLogPdfExport === true;
      }
    } finally {
      await redis.quit();
    }
  }

  const rows =
    auditAllowed && shop
      ? (await loadAuditLogsForShop(prisma, session.shop, {
          regulationFilter: regulation,
        })) ?? []
      : [];

  const regulationOptions = REGULATION_CONFIGS.map((c) => ({
    code: c.code,
    label: `${c.displayName} (${c.code})`,
  }));

  return json({
    rows,
    regulation,
    auditAllowed,
    pdfAllowed,
    regulationOptions,
  });
};

export default function AuditLogPage() {
  const { m } = useOutletContext<AppI18nOutletContext>();
  const { rows, regulation, auditAllowed, pdfAllowed, regulationOptions } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const exportHref = useMemo(() => {
    const u = new URLSearchParams();
    if (regulation) {
      u.set("regulation", regulation);
    }
    const q = u.toString();
    return q ? `/app/audit/export?${q}` : "/app/audit/export";
  }, [regulation]);

  const onRegulationChange = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams);
      if (value === "__all__") {
        next.delete("regulation");
      } else {
        next.set("regulation", value);
      }
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const selectOptions = useMemo(
    () => [
      { label: m.auditLog.allRegulations, value: "__all__" },
      ...regulationOptions.map((o) => ({ label: o.label, value: o.code })),
    ],
    [m.auditLog.allRegulations, regulationOptions],
  );

  const selectValue = regulation ?? "__all__";

  const rowMarkup = rows.map((row, index) => (
    <IndexTable.Row id={row.id} key={row.id} position={index}>
      <IndexTable.Cell>
        {new Date(row.reviewedAt).toLocaleString()}
      </IndexTable.Cell>
      <IndexTable.Cell>{row.action}</IndexTable.Cell>
      <IndexTable.Cell>{row.productContentId}</IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" variant="bodySm" tone="subdued">
          {row.notes ?? "—"}
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page>
      <TitleBar title={m.auditLog.titleBar} />
      <BlockStack gap="500">
        <Text as="p" variant="bodyMd" tone="subdued">
          {m.auditLog.intro}
        </Text>

        {!auditAllowed ? (
          <Card>
            <BlockStack gap="200">
              <Text as="p" variant="headingMd">
                {m.auditLog.upgradeTitle}
              </Text>
              <Text as="p" variant="bodyMd">
                {m.auditLog.upgradeBody}
              </Text>
            </BlockStack>
          </Card>
        ) : null}

        {auditAllowed ? (
          <Card>
            <BlockStack gap="400">
              <InlineStack gap="300" blockAlign="end" wrap>
                <div style={{ minWidth: 240 }}>
                  <Select
                    label={m.auditLog.filterLabel}
                    options={selectOptions}
                    value={selectValue}
                    onChange={onRegulationChange}
                  />
                </div>
                <Button disabled={!pdfAllowed} url={exportHref}>
                  {m.auditLog.exportPdf}
                </Button>
              </InlineStack>
              <Text as="p" variant="bodySm" tone="subdued">
                {m.auditLog.exportPdfHelp}
              </Text>

              {rows.length === 0 ? (
                <EmptySearchResult
                  title={
                    regulation
                      ? m.auditLog.emptyFilter
                      : m.auditLog.emptyTitle
                  }
                  description={
                    regulation ? undefined : m.auditLog.emptyDescription
                  }
                  withIllustration
                />
              ) : (
                <IndexTable
                  resourceName={{ singular: "entry", plural: "entries" }}
                  itemCount={rows.length}
                  selectable={false}
                  headings={[
                    { title: m.auditLog.tableWhen },
                    { title: m.auditLog.tableAction },
                    { title: m.auditLog.tableProduct },
                    { title: m.auditLog.tableNotes },
                  ]}
                >
                  {rowMarkup}
                </IndexTable>
              )}
            </BlockStack>
          </Card>
        ) : null}
      </BlockStack>
    </Page>
  );
}
