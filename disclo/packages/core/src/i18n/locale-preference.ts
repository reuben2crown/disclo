import type { SupportedLocale } from "./locale.js";
import { isSupportedLocale } from "./locale.js";
import { resolveLocale } from "./resolve-locale.js";

/**
 * Resolves UI locale: supported cookie wins, then Accept-Language, then fallback
 * (usually `DEFAULT_LOCALE` from env).
 */
export function resolveLocalePreference(
  cookieLocaleRaw: string | null | undefined,
  acceptLanguage: string | null | undefined,
  fallback: SupportedLocale,
): SupportedLocale {
  const trimmed = cookieLocaleRaw?.trim().toLowerCase();
  if (trimmed && isSupportedLocale(trimmed)) {
    return trimmed;
  }
  return resolveLocale(acceptLanguage, fallback);
}
