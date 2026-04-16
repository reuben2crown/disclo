import type { MerchantMessages, SupportedLocale } from "@disclo/core/i18n";

export type AppI18nOutletContext = {
  locale: SupportedLocale;
  m: MerchantMessages;
};
