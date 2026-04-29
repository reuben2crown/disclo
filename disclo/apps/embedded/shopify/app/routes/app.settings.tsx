import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Banner,
  Button,
  BlockStack,
  Card,
  Checkbox,
  Form,
  FormLayout,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { useActionData, useLoaderData, useOutletContext } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import { LanguageSwitcherFooter } from "../components/LanguageSwitcherFooter.js";
import type { AppI18nOutletContext } from "../locales/i18n-outlet-context.js";
import { discloLocaleCookieChoice } from "../locales/i18n.server.js";
import prisma from "../db.server.js";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const cookieLocale = discloLocaleCookieChoice(request);
  const shop = await prisma.shop.findFirst({
    where: { platform: "shopify", externalDomain: session.shop },
    select: { id: true },
  });
  const settings = shop
    ? await prisma.shopSettings.findUnique({
        where: { shopId: shop.id },
        select: {
          targetMarkets: true,
          badgeTextShort: true,
          greenBadgeTooltip: true,
          autoScanOnUpdate: true,
          notifyScanComplete: true,
          notifyHighRisk: true,
        },
      })
    : null;
  return json({ cookieLocale, settings });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") ?? "");
  if (intent !== "saveSettings") {
    return json({ ok: false, error: "Unknown action." }, { status: 400 });
  }
  const shop = await prisma.shop.findFirst({
    where: { platform: "shopify", externalDomain: session.shop },
    select: { id: true },
  });
  if (!shop) {
    return json({ ok: false, error: "Shop not found." }, { status: 404 });
  }

  const marketsRaw = String(form.get("targetMarkets") ?? "");
  const targetMarkets = Array.from(
    new Set(
      marketsRaw
        .split(",")
        .map((m) => m.trim().toUpperCase())
        .filter((m) => m === "EU" || m === "US" || m === "US-FL" || m === "US-NY"),
    ),
  );
  if (!targetMarkets.length) {
    return json(
      { ok: false, error: "Use at least one market: EU, US, US-FL, or US-NY." },
      { status: 400 },
    );
  }

  await prisma.shopSettings.upsert({
    where: { shopId: shop.id },
    create: {
      shopId: shop.id,
      targetMarkets,
      badgeTextShort: String(form.get("badgeTextShort") ?? "").trim() || undefined,
      greenBadgeTooltip: String(form.get("greenBadgeTooltip") ?? "").trim() || null,
      autoScanOnUpdate: form.get("autoScanOnUpdate") === "on",
      notifyScanComplete: form.get("notifyScanComplete") === "on",
      notifyHighRisk: form.get("notifyHighRisk") === "on",
    },
    update: {
      targetMarkets,
      badgeTextShort: String(form.get("badgeTextShort") ?? "").trim() || undefined,
      greenBadgeTooltip: String(form.get("greenBadgeTooltip") ?? "").trim() || null,
      autoScanOnUpdate: form.get("autoScanOnUpdate") === "on",
      notifyScanComplete: form.get("notifyScanComplete") === "on",
      notifyHighRisk: form.get("notifyHighRisk") === "on",
    },
  });

  return json({ ok: true });
};

export default function SettingsPage() {
  const { m } = useOutletContext<AppI18nOutletContext>();
  const { cookieLocale, settings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <Page
      title={m.settings.pageTitle}
      backAction={{ url: "/app" }}
    >
      <TitleBar title={m.settings.titleBar} />
      <BlockStack gap="500">
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              {m.settings.languageHeading}
            </Text>
            <Text as="p" variant="bodyMd" tone="subdued">
              {m.settings.languageBody}
            </Text>
            <LanguageSwitcherFooter
              m={m}
              cookieLocale={cookieLocale}
              layout="plain"
            />
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              {m.settings.marketsHeading}
            </Text>
            <Text as="p" variant="bodyMd" tone="subdued">
              {m.settings.marketsBody}
            </Text>
            <Form method="post">
              <input type="hidden" name="intent" value="saveSettings" />
              <FormLayout>
                <TextField
                  label={m.settings.marketsFieldLabel}
                  name="targetMarkets"
                  defaultValue={settings?.targetMarkets?.join(", ") ?? "EU"}
                  autoComplete="off"
                  helpText={m.settings.marketsHelpText}
                />
                <TextField
                  label="Badge short text"
                  name="badgeTextShort"
                  defaultValue={settings?.badgeTextShort ?? ""}
                  autoComplete="off"
                />
                <TextField
                  label="Green badge tooltip"
                  name="greenBadgeTooltip"
                  defaultValue={settings?.greenBadgeTooltip ?? ""}
                  autoComplete="off"
                />
                <Checkbox
                  label="Auto-scan products on update"
                  name="autoScanOnUpdate"
                  defaultChecked={settings?.autoScanOnUpdate ?? true}
                />
                <Checkbox
                  label="Notify when scan completes"
                  name="notifyScanComplete"
                  defaultChecked={settings?.notifyScanComplete ?? true}
                />
                <Checkbox
                  label="Notify on high-risk items"
                  name="notifyHighRisk"
                  defaultChecked={settings?.notifyHighRisk ?? true}
                />
                <Button submit variant="primary">
                  Save settings
                </Button>
              </FormLayout>
            </Form>
            {actionData?.ok ? <Banner tone="success">Settings saved.</Banner> : null}
            {actionData?.ok === false ? (
              <Banner tone="critical">{actionData.error}</Banner>
            ) : null}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
