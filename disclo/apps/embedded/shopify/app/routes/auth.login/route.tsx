import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  AppProvider as PolarisAppProvider,
  Button,
  Card,
  FormLayout,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

import { getMerchantMessages } from "@disclo/core/i18n";
import { LanguageSwitcherFooter } from "../../components/LanguageSwitcherFooter.js";
import { discloLocaleCookieChoice, localeFromRequest } from "../../i18n.server.js";
import { login } from "../../shopify.server";

import { loginErrorMessage } from "./error.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = localeFromRequest(request);
  const errors = loginErrorMessage(await login(request), locale);

  return {
    errors,
    polarisTranslations,
    locale,
    cookieLocale: discloLocaleCookieChoice(request),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const locale = localeFromRequest(request);
  const errors = loginErrorMessage(await login(request), locale);

  return {
    errors,
    locale,
  };
};

export default function Auth() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [shop, setShop] = useState("");
  const merged = actionData || loaderData;
  const { errors } = merged;
  const locale = merged.locale ?? loaderData.locale;
  const m = getMerchantMessages(locale);

  return (
    <PolarisAppProvider i18n={loaderData.polarisTranslations}>
      <Page>
        <Card>
          <Form method="post">
            <FormLayout>
              <Text variant="headingMd" as="h2">
                {m.auth.heading}
              </Text>
              <TextField
                type="text"
                name="shop"
                label={m.auth.shopLabel}
                helpText={m.auth.shopHelp}
                value={shop}
                onChange={setShop}
                autoComplete="on"
                error={errors.shop}
              />
              <Button submit>{m.auth.submit}</Button>
            </FormLayout>
          </Form>
        </Card>
        <LanguageSwitcherFooter
          m={m}
          cookieLocale={loaderData.cookieLocale}
          layout="plain"
        />
      </Page>
    </PolarisAppProvider>
  );
}
