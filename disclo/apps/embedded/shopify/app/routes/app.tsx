import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { getMerchantMessages } from "@disclo/core/i18n";

import { LanguageSwitcherFooter } from "../components/LanguageSwitcherFooter.js";
import type { AppI18nOutletContext } from "../i18n-outlet-context.js";
import { discloLocaleCookieChoice, localeFromRequest } from "../i18n.server.js";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    locale: localeFromRequest(request),
    cookieLocale: discloLocaleCookieChoice(request),
  };
};

export default function App() {
  const { apiKey, locale, cookieLocale } = useLoaderData<typeof loader>();
  const m = getMerchantMessages(locale);
  const i18n: AppI18nOutletContext = { locale, m };

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          {m.nav.dashboard}
        </Link>
        <Link to="/app/scans">{m.nav.scans}</Link>
        <Link to="/app/settings">{m.nav.settings}</Link>
      </NavMenu>
      <Outlet context={i18n} />
      <LanguageSwitcherFooter m={m} cookieLocale={cookieLocale} />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
