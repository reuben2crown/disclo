import type { SupportedLocale } from "./locale.js";
import { FALLBACK_LOCALE, isSupportedLocale } from "./locale.js";

/**
 * Maps the first subtag of a BCP 47 tag (before `-`) to a supported locale.
 * Full tags like `pt-BR` map via primary language `pt`.
 */
const PRIMARY_TO_LOCALE: Record<string, SupportedLocale> = {
  en: "en",
  fr: "fr",
  es: "es",
  de: "de",
  it: "it",
  pt: "pt",
  nl: "nl",
  ja: "ja",
  ko: "ko",
  zh: "zh",
  pl: "pl",
  sv: "sv",
  da: "da",
  tr: "tr",
  ru: "ru",
};

function localeFromLanguageTag(tag: string): SupportedLocale | null {
  const lower = tag.trim().toLowerCase();
  const firstSegment = lower.split(",")[0]?.split(";")[0]?.trim() ?? "";
  if (!firstSegment) {
    return null;
  }
  if (firstSegment.startsWith("zh-")) {
    return "zh";
  }
  const primary = firstSegment.split("-")[0] ?? "";
  const mapped = PRIMARY_TO_LOCALE[primary];
  return mapped ?? null;
}

/**
 * Picks a supported locale from `Accept-Language` (first tag; ignores q= weights).
 * Falls back to `fallback` (typically `DEFAULT_LOCALE` from env or `en`).
 */
export function resolveLocale(
  acceptLanguage: string | null | undefined,
  fallback: SupportedLocale = FALLBACK_LOCALE,
): SupportedLocale {
  if (!acceptLanguage?.trim()) {
    return fallback;
  }
  const resolved = localeFromLanguageTag(acceptLanguage);
  if (resolved) {
    return resolved;
  }
  return fallback;
}

/** Reads `process.env.DEFAULT_LOCALE` without loading the full server env schema (safe for workers). */
export function defaultLocaleFromEnv(): SupportedLocale {
  const raw = process.env.DEFAULT_LOCALE?.trim().toLowerCase();
  if (isSupportedLocale(raw)) {
    return raw;
  }
  return FALLBACK_LOCALE;
}
