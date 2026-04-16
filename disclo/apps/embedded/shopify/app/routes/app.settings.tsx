import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  BlockStack,
  Card,
  FormLayout,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { useState } from "react";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import { LanguageSwitcherFooter } from "../components/LanguageSwitcherFooter.js";
import type { AppI18nOutletContext } from "../i18n-outlet-context.js";
import { discloLocaleCookieChoice } from "../i18n.server.js";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const cookieLocale = discloLocaleCookieChoice(request);
  return json({ cookieLocale });
};

export default function SettingsPage() {
  const { m } = useOutletContext<AppI18nOutletContext>();
  const { cookieLocale } = useLoaderData<typeof loader>();
  const [markets, setMarkets] = useState("EU");

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
            <FormLayout>
              <TextField
                label={m.settings.marketsFieldLabel}
                value={markets}
                onChange={setMarkets}
                autoComplete="off"
                helpText={m.settings.marketsHelpText}
              />
            </FormLayout>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
