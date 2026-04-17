import { loadServerEnv } from "@disclo/core/config";
import {
  DISCLO_LOCALE_COOKIE,
  defaultLocaleFromEnv,
  isSupportedLocale,
  resolveLocalePreference,
  type SupportedLocale,
} from "@disclo/core/i18n";

function parseCookieValue(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader?.trim()) {
    return undefined;
  }
  const parts = cookieHeader.split(";").map((s) => s.trim());
  const prefix = `${name}=`;
  for (const p of parts) {
    if (p.startsWith(prefix)) {
      try {
        return decodeURIComponent(p.slice(prefix.length));
      } catch {
        return p.slice(prefix.length);
      }
    }
  }
  return undefined;
}

/** Explicit locale from `disclo_locale` cookie, if valid; otherwise null (browser default). */
export function discloLocaleCookieChoice(request: Request): SupportedLocale | null {
  const raw = parseCookieValue(request.headers.get("Cookie"), DISCLO_LOCALE_COOKIE)
    ?.trim()
    .toLowerCase();
  return raw && isSupportedLocale(raw) ? raw : null;
}

/** Resolves locale for an HTTP request (embedded + public routes). Cookie overrides Accept-Language. */
export function localeFromRequest(request: Request): SupportedLocale {
  const env = loadServerEnv();
  const cookieRaw = parseCookieValue(request.headers.get("Cookie"), DISCLO_LOCALE_COOKIE);
  return resolveLocalePreference(
    cookieRaw,
    request.headers.get("accept-language"),
    env.DEFAULT_LOCALE,
  );
}

export type { SupportedLocale } from "@disclo/core/i18n";

/** For hooks without a Request (e.g. OAuth afterAuth). */
export { defaultLocaleFromEnv };
