import {
  getMerchantMessages,
  loadServerEnv,
  type SupportedLocale,
} from "@disclo/core";

/** Shown after infra or unknown failures so merchants know who to ping. */
export function merchantSupportSuffix(locale: SupportedLocale = "en"): string {
  const m = getMerchantMessages(locale);
  const email = loadServerEnv().MERCHANT_SUPPORT_EMAIL;
  if (email) {
    return m.support.withEmail(email);
  }
  return m.support.withoutEmail;
}

/** Pass through loaders when you want optional inline help (no trailing sentence duplication). */
export function getMerchantSupportEmail(): string | null {
  return loadServerEnv().MERCHANT_SUPPORT_EMAIL ?? null;
}
