import type { Platform, PlatformAdapter } from "@disclo/core";
export type { ShopifyAdapterDeps } from "./shopify/types.js";
export {
  createShopifyAdapter,
  SHOPIFY_DEFAULT_API_VERSION,
  type ShopifyAdapter,
} from "./shopify/index.js";
import { createAdapter as createWoocommerceAdapter } from "./woocommerce/index.js";
import { createAdapter as createWordpressAdapter } from "./wordpress/index.js";
import { createAdapter as createHeadlessAdapter } from "./headless/index.js";
import { createAdapter as createBigcommerceAdapter } from "./bigcommerce/index.js";
import { createAdapter as createWixAdapter } from "./wix/index.js";
import { createAdapter as createWebflowAdapter } from "./webflow/index.js";
import { createAdapter as createGhostAdapter } from "./ghost/index.js";

export function getAdapter(platform: Platform): PlatformAdapter {
  switch (platform) {
    case "shopify":
      throw new Error(
        "Shopify uses createShopifyAdapter({ prisma, encryptionKey }) from @disclo/adapters; getAdapter does not apply",
      );
    case "woocommerce":
      return createWoocommerceAdapter();
    case "wordpress":
      return createWordpressAdapter();
    case "headless":
      return createHeadlessAdapter();
    case "bigcommerce":
      return createBigcommerceAdapter();
    case "wix":
      return createWixAdapter();
    case "webflow":
      return createWebflowAdapter();
    case "ghost":
      return createGhostAdapter();
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
