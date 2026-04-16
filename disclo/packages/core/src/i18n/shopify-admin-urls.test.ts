import { describe, expect, it } from "vitest";
import { shopifyAdminAppsSettingsUrl } from "./shopify-admin-urls.js";

describe("shopifyAdminAppsSettingsUrl", () => {
  it("builds settings apps URL for myshopify host", () => {
    expect(shopifyAdminAppsSettingsUrl("acme.myshopify.com")).toBe(
      "https://acme.myshopify.com/admin/settings/apps",
    );
  });

  it("appends myshopify.com when given a bare shop handle", () => {
    expect(shopifyAdminAppsSettingsUrl("acme")).toBe(
      "https://acme.myshopify.com/admin/settings/apps",
    );
  });
});
