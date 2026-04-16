import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  buildClearLocaleCookieHeader,
  buildLocaleCookieHeader,
  isSupportedLocale,
  type SupportedLocale,
} from "@disclo/core/i18n";
import { safeLocaleReturnTo } from "../locale-action.server.js";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  return redirect(url.searchParams.get("from") ?? "/");
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (formData.get("intent") !== "setLocale") {
    return json({ ok: false }, { status: 400 });
  }

  const raw = formData.get("locale");
  const secure = process.env.NODE_ENV === "production";
  let setCookie: string;

  if (raw === "" || raw == null) {
    setCookie = buildClearLocaleCookieHeader({ secure });
  } else if (typeof raw !== "string") {
    return json({ ok: false }, { status: 400 });
  } else {
    const normalized = raw.trim().toLowerCase();
    if (!isSupportedLocale(normalized)) {
      return json({ ok: false }, { status: 400 });
    }
    setCookie = buildLocaleCookieHeader(normalized as SupportedLocale, { secure });
  }

  const returnTo = safeLocaleReturnTo(formData.get("returnTo"), "/app");
  return redirect(returnTo, {
    headers: { "Set-Cookie": setCookie },
  });
};

export default function LocaleRoute() {
  return null;
}
