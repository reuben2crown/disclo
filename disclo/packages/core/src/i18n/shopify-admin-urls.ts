/**
 * Deep link into Shopify admin where merchants manage installed apps and (for many apps) billing.
 * `shopDomain` should be the shop’s `.myshopify.com` host (e.g. from the embedded session).
 */
export function shopifyAdminAppsSettingsUrl(shopDomain: string): string {
  const trimmed = shopDomain.trim().toLowerCase();
  const host = trimmed.includes(".")
    ? trimmed
    : `${trimmed}.myshopify.com`;
  return `https://${host}/admin/settings/apps`;
}
