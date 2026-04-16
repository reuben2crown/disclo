import type { SupportedLocale } from "./locale.js";

/** Cookie name for explicit app language (embedded app + public routes). */
export const DISCLO_LOCALE_COOKIE = "disclo_locale";

export const DISCLO_LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function buildLocaleCookieHeader(
  locale: SupportedLocale,
  options: { secure: boolean },
): string {
  const parts = [
    `${DISCLO_LOCALE_COOKIE}=${encodeURIComponent(locale)}`,
    "Path=/",
    `Max-Age=${DISCLO_LOCALE_COOKIE_MAX_AGE}`,
    "SameSite=Lax",
  ];
  if (options.secure) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function buildClearLocaleCookieHeader(options: { secure: boolean }): string {
  const parts = [
    `${DISCLO_LOCALE_COOKIE}=`,
    "Path=/",
    "Max-Age=0",
    "SameSite=Lax",
  ];
  if (options.secure) {
    parts.push("Secure");
  }
  return parts.join("; ");
}
