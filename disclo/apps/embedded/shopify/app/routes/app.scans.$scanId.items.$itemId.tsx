import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import {
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  InlineStack,
  List,
  Page,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { getMerchantMessages, loadServerEnv } from "@disclo/core";
import { getRegulationByCode } from "@disclo/core/regulations";
import type { AppI18nOutletContext } from "../locales/i18n-outlet-context.js";
import { localeFromRequest } from "../locales/i18n.server.js";
import prisma from "../db.server";
import { applyAiDisclosureLabel } from "../features/scans/apply-label.server.js";
import { markScanItemHumanReviewed } from "../features/scans/mark-human-reviewed.server.js";
import { loadScanItemDetail } from "../features/scans/scan-item-detail.server.js";
import { authenticate } from "../shopify.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const m = getMerchantMessages(localeFromRequest(request));
  const { session } = await authenticate.admin(request);
  const scanId = params.scanId;
  const itemId = params.itemId;
  if (!scanId || !itemId) {
    throw new Response(m.scanItemDetail.itemNotFound, { status: 404 });
  }

  const env = loadServerEnv();
  const encryptionKey =
    env.ENCRYPTION_KEY && env.ENCRYPTION_KEY.length >= 32
      ? env.ENCRYPTION_KEY
      : undefined;

  const detail = await loadScanItemDetail(
    prisma,
    session.shop,
    scanId,
    itemId,
    { encryptionKey },
  );

  if (!detail) {
    throw new Response(m.scanItemDetail.itemNotFound, { status: 404 });
  }

  const labelled =
    new URL(request.url).searchParams.get("labelled") === "1";
  const reviewed =
    new URL(request.url).searchParams.get("reviewed") === "1";

  return json({ detail, labelled, reviewed });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const locale = localeFromRequest(request);
  const m = getMerchantMessages(locale);
  const { session } = await authenticate.admin(request);
  const scanId = params.scanId;
  const itemId = params.itemId;
  if (!scanId || !itemId) {
    return json(
      { ok: false as const, error: m.scanItemDetail.itemNotFound },
      { status: 404 },
    );
  }

  const form = await request.formData();
  const intent = String(form.get("intent") ?? "");
  if (intent !== "applyLabel" && intent !== "humanReview") {
    return json({ ok: false as const, error: m.dashboard.unknownAction }, {
      status: 400,
    });
  }

  if (intent === "humanReview") {
    const reviewerName = String(form.get("reviewerName") ?? "");
    const notes = String(form.get("reviewNotes") ?? "");
    const reviewed = await markScanItemHumanReviewed(prisma, {
      shopDomain: session.shop,
      scanId,
      itemId,
      reviewerName,
      notes,
    });
    if (!reviewed.ok) {
      return json({ ok: false as const, error: reviewed.error }, { status: reviewed.httpStatus });
    }
    const path = new URL(request.url).pathname;
    return redirect(`${path}?reviewed=1`);
  }

  const result = await applyAiDisclosureLabel(prisma, session.shop, scanId, itemId, locale);

  if (!result.ok) {
    return json(
      {
        ok: false as const,
        error: result.error,
        actionUrl: result.actionUrl,
        actionLabel: result.actionLabel,
      },
      { status: result.httpStatus },
    );
  }

  const path = new URL(request.url).pathname;
  return redirect(`${path}?labelled=1`);
};

export default function ScanItemDetailPage() {
  const { m } = useOutletContext<AppI18nOutletContext>();
  const { detail, labelled, reviewed } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const hasAiRegulation = detail.item.regulations.some(
    (code) => getRegulationByCode(code)?.category === "ai_disclosure",
  );
  const canApplyLabel =
    detail.item.status !== "pending" &&
    detail.item.status !== "exempted" &&
    hasAiRegulation;

  return (
    <Page
      backAction={{
        content: m.scanItemDetail.backScan,
        url: `/app/scans/${detail.scan.id}`,
      }}
    >
      <TitleBar title={m.scanItemDetail.titleBar} />
      <BlockStack gap="500">
        {labelled ? (
          <Banner tone="success" title={m.scanItemDetail.applyLabelSuccess} />
        ) : null}
        {reviewed ? (
          <Banner tone="success" title="Item marked as human-reviewed." />
        ) : null}

        {actionData && "ok" in actionData && actionData.ok === false && (
          <Banner tone="critical" title={actionData.error}>
            {"actionUrl" in actionData && actionData.actionUrl ? (
              <InlineStack gap="200">
                <Button url={actionData.actionUrl} target="_top">
                  {actionData.actionLabel ?? m.hints.openAppsToManagePlan}
                </Button>
              </InlineStack>
            ) : null}
          </Banner>
        )}

        <Text as="p" variant="bodySm" tone="subdued">
          {m.scanItemDetail.productId(detail.item.contentId)}
        </Text>

        <Card>
          <BlockStack gap="300">
            <InlineStack gap="400" align="space-between" blockAlign="start">
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">
                  {m.scanItemDetail.aiProbability}
                </Text>
                <Text as="p" variant="headingMd">
                  {detail.item.aiProbability ?? "—"}
                </Text>
              </BlockStack>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">
                  {m.scanItemDetail.riskLevel}
                </Text>
                <Text as="p" variant="headingMd">
                  {detail.item.riskLevel}
                </Text>
              </BlockStack>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">
                  {m.scanItemDetail.status}
                </Text>
                <Text as="p" variant="headingMd">
                  {detail.item.status}
                </Text>
              </BlockStack>
            </InlineStack>
            <Divider />
            <Text as="p" variant="bodySm" tone="subdued">
              {m.scanItemDetail.fieldLabel}
            </Text>
            <Text as="p" variant="bodyMd">
              {detail.item.field}
            </Text>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              {m.scanItemDetail.regulationsHeading}
            </Text>
            <List type="bullet">
              {detail.regulationLabels.map((r) => (
                <List.Item key={r.code}>
                  {r.displayName}{" "}
                  <Text as="span" variant="bodySm" tone="subdued">
                    ({r.code})
                  </Text>
                </List.Item>
              ))}
            </List>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              {m.scanItemDetail.claimsHeading}
            </Text>
            {detail.item.flaggedClaims.length === 0 ? (
              <Text as="p" variant="bodyMd" tone="subdued">
                {m.scanItemDetail.noClaims}
              </Text>
            ) : (
              <List type="bullet">
                {detail.item.flaggedClaims.map((c) => (
                  <List.Item key={c}>{c}</List.Item>
                ))}
              </List>
            )}
          </BlockStack>
        </Card>

        {detail.productPreview ? (
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                {m.scanItemDetail.previewHeading}
              </Text>
              <Text as="p" variant="bodyMd" fontWeight="semibold">
                {detail.productPreview.title}
              </Text>
              <Box
                padding="400"
                background="bg-surface-secondary"
                borderRadius="200"
              >
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {detail.productPreview.bodyExcerpt}
                </pre>
              </Box>
            </BlockStack>
          </Card>
        ) : (
          <Banner tone="info">{m.scanItemDetail.previewUnavailable}</Banner>
        )}

        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              {m.scanItemDetail.auditHeading}
            </Text>
            {detail.audits.length === 0 ? (
              <Text as="p" variant="bodyMd" tone="subdued">
                {m.scanItemDetail.noAudit}
              </Text>
            ) : (
              <List type="bullet">
                {detail.audits.map((a) => (
                  <List.Item key={a.id}>
                    {a.action} — {new Date(a.reviewedAt).toLocaleString()}
                    {a.notes ? (
                      <Text as="p" variant="bodySm" tone="subdued">
                        {a.notes}
                      </Text>
                    ) : null}
                  </List.Item>
                ))}
              </List>
            )}
          </BlockStack>
        </Card>

        {canApplyLabel ? (
          <Card>
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                {m.scanItemDetail.applyLabelHelp}
              </Text>
              <Form method="post">
                <input type="hidden" name="intent" value="applyLabel" />
                <Button submit variant="primary">
                  {m.scanItemDetail.applyLabel}
                </Button>
              </Form>
            </BlockStack>
          </Card>
        ) : null}
        {detail.item.status !== "pending" && detail.item.status !== "exempted" ? (
          <Card>
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                Mark this item as reviewed by a person and exempt it from label-required status.
              </Text>
              <Form method="post">
                <input type="hidden" name="intent" value="humanReview" />
                <BlockStack gap="200">
                  <label>
                    Reviewer name
                    <input name="reviewerName" required />
                  </label>
                  <label>
                    Notes
                    <textarea name="reviewNotes" rows={3} />
                  </label>
                  <Button submit>Mark as Human-Reviewed</Button>
                </BlockStack>
              </Form>
            </BlockStack>
          </Card>
        ) : null}
      </BlockStack>
    </Page>
  );
}
