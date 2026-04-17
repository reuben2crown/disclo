import { getMerchantMessages, type SupportedLocale } from "@disclo/core/i18n";
import { merchantSupportSuffix } from "../dashboard/merchant-support.server.js";

function withDevHelp(body: string, locale: SupportedLocale): string {
  return `${body} ${merchantSupportSuffix(locale)}`;
}

export function merchantFullScanQueueError(locale: SupportedLocale): string {
  return withDevHelp(getMerchantMessages(locale).scan.queueUnavailable, locale);
}

export function merchantFullScanServerError(locale: SupportedLocale): string {
  return withDevHelp(getMerchantMessages(locale).scan.serverMisconfigured, locale);
}

export function merchantIncrementalQueueError(locale: SupportedLocale): string {
  return withDevHelp(getMerchantMessages(locale).scan.queueUnavailable, locale);
}

export function merchantIncrementalServerError(locale: SupportedLocale): string {
  return withDevHelp(getMerchantMessages(locale).scan.serverMisconfigured, locale);
}

export function merchantShopMissingError(locale: SupportedLocale): string {
  return getMerchantMessages(locale).scan.shopMissing;
}

export function merchantPlanNotSyncedError(locale: SupportedLocale): string {
  return getMerchantMessages(locale).scan.planNotSynced;
}

export function merchantNoProductsError(locale: SupportedLocale): string {
  return getMerchantMessages(locale).scan.noProducts;
}

export function merchantProductMissingError(locale: SupportedLocale): string {
  return getMerchantMessages(locale).scan.productGone;
}

export function merchantCatalogAdapterError(locale: SupportedLocale): string {
  return withDevHelp(getMerchantMessages(locale).scan.catalogLoadFailed, locale);
}

export function merchantUnexpectedFullScanError(locale: SupportedLocale): string {
  return withDevHelp(
    getMerchantMessages(locale).scan.unexpectedFullScan,
    locale,
  );
}

export function merchantUnexpectedIncrementalError(
  locale: SupportedLocale,
): string {
  return withDevHelp(
    getMerchantMessages(locale).scan.unexpectedIncremental,
    locale,
  );
}
