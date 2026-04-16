import type { LoginError } from "@shopify/shopify-app-remix/server";
import { LoginErrorType } from "@shopify/shopify-app-remix/server";
import { getMerchantMessages, type SupportedLocale } from "@disclo/core/i18n";

interface LoginErrorMessage {
  shop?: string;
}

export function loginErrorMessage(
  loginErrors: LoginError,
  locale: SupportedLocale,
): LoginErrorMessage {
  const m = getMerchantMessages(locale);
  if (loginErrors?.shop === LoginErrorType.MissingShop) {
    return { shop: m.auth.missingShop };
  } else if (loginErrors?.shop === LoginErrorType.InvalidShop) {
    return { shop: m.auth.invalidShop };
  }

  return {};
}
