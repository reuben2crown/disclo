import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getMerchantMessages } from "@disclo/core/i18n";

import { LanguageSwitcherFooter } from "../../components/LanguageSwitcherFooter.js";
import { discloLocaleCookieChoice, localeFromRequest } from "../../locales/i18n.server.js";
import { login } from "../../shopify.server";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return {
    showForm: Boolean(login),
    locale: localeFromRequest(request),
    cookieLocale: discloLocaleCookieChoice(request),
  };
};

export default function App() {
  const { showForm, locale, cookieLocale } = useLoaderData<typeof loader>();
  const m = getMerchantMessages(locale);

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>{m.marketing.heading}</h1>
        <p className={styles.text}>{m.marketing.tagline}</p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input className={styles.input} type="text" name="shop" />
              <span>{m.marketing.shopExample}</span>
            </label>
            <button className={styles.button} type="submit">
              {m.auth.submit}
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>{m.marketing.bulletScans}</li>
          <li>{m.marketing.bulletScores}</li>
          <li>{m.marketing.bulletDisclosures}</li>
        </ul>
        <LanguageSwitcherFooter
          m={m}
          cookieLocale={cookieLocale}
          polarisChrome={false}
        />
      </div>
    </div>
  );
}
