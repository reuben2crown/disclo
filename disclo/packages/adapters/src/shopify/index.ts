import { AdapterError, decryptString, type LabelInstruction, type PlatformAdapter, type ScanRequest, } from "@disclo/core";
import { fetchShopifyProductPage } from "./fetch-content.js";
import { fetchShopifyProductByNumericId } from "./fetch-single-product.js";
import type { ShopifyAdapterDeps } from "./types.ts";
import { writeProductMetafieldLabel } from "./write-label.js";

/** Default Admin API version (align with `ApiVersion.January26` in the embedded app). */
export const SHOPIFY_DEFAULT_API_VERSION = "2026-01";

export type ShopifyAdapter = PlatformAdapter & {
  fetchProductByNumericId(
    shopId: string,
    numericProductId: string,
  ): Promise<ScanRequest | null>;
};
/**
 * Shopify adapter — thin I/O. Business logic lives in `packages/core`.
 * Full OAuth + GraphQL wiring is implemented in `apps/shopify`.
 */

export function createShopifyAdapter(deps: ShopifyAdapterDeps): ShopifyAdapter {
  const apiVersion = deps.apiVersion ?? SHOPIFY_DEFAULT_API_VERSION;

  async function loadShopCredentials(shopId: string) {
    const shop = await deps.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop || shop.platform !== "shopify") {
      throw new AdapterError(`Shop ${shopId} is not a Shopify shop`);
    }
    if (!shop.accessToken) {
      throw new AdapterError("Shop has no access token; reinstall the app");
    }
    const token = decryptString(shop.accessToken, deps.encryptionKey);
    return { shop, domain: shop.externalDomain, token };
  }

  return {
    async fetchContent(shopId: string, startCursor?: string): Promise<ScanRequest[]> {
      const { shop, domain, token } = await loadShopCredentials(shopId);
      const out: ScanRequest[] = [];
      let cursor: string | undefined = startCursor;
      const MAX_PAGES = 2000;
      for (let i = 0; i < MAX_PAGES; i++) {
        const page = await fetchShopifyProductPage({
          shopDomain: domain,
          accessToken: token,
          apiVersion,
          shopUuid: shop.id,
          cursor,
        });
        out.push(...page.requests);
        if (!page.nextCursor) {
          break;
        }
        cursor = page.nextCursor;
      }
      return out;
    },

    async writeLabel(instruction: LabelInstruction): Promise<void> {
      if (instruction.platform !== "shopify") {
        throw new AdapterError(
          `Shopify adapter received platform "${instruction.platform}"`,
        );
      }
      const { domain, token } = await loadShopCredentials(instruction.shop_id);
      await writeProductMetafieldLabel({
        shopDomain: domain,
        accessToken: token,
        apiVersion,
        instruction,
      });
    },

    async registerWebhooks(_shopId: string): Promise<void> {
      void _shopId;
      // Subscriptions are declared in `shopify.app.toml` and registered via
      // `registerWebhooks({ session })` in the embedded app `afterAuth` hook.
    },

    async revokeAccess(shopId: string): Promise<void> {
      await deps.prisma.shop.updateMany({
        where: { id: shopId, platform: "shopify" },
        data: { accessToken: null },
      });
    },

    async fetchProductByNumericId(
      shopId: string,
      numericProductId: string,
    ): Promise<ScanRequest | null> {
      const { shop, domain, token } = await loadShopCredentials(shopId);
      return fetchShopifyProductByNumericId({
        shopDomain: domain,
        accessToken: token,
        apiVersion,
        shopUuid: shop.id,
        numericProductId,
      });
    },
  };
}
