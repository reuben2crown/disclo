/**
 * Locales Disclo recognizes for merchant UI, plan errors, and worker notifications.
 * Each code has dedicated bundles in merchant, plan, and notifications registries.
 */
export const SUPPORTED_LOCALES = [
  "en",
  "fr",
  "es",
  "de",
  "it",
  "pt",
  "nl",
  "ja",
  "ko",
  "zh",
  "pl",
  "sv",
  "da",
  "tr",
  "ru",
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const FALLBACK_LOCALE: SupportedLocale = "en";

const SUPPORTED_SET = new Set<string>(SUPPORTED_LOCALES);

export function isSupportedLocale(value: string | undefined | null): value is SupportedLocale {
  return value != null && value !== "" && SUPPORTED_SET.has(value);
}

/** Native-language labels for locale pickers (ISO 639-1 style codes). */
export const LOCALE_NATIVE_LABELS: Record<SupportedLocale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  nl: "Nederlands",
  ja: "日本語",
  ko: "한국어",
  zh: "中文",
  pl: "Polski",
  sv: "Svenska",
  da: "Dansk",
  tr: "Türkçe",
  ru: "Русский",
};
