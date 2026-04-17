import type { ActionFunctionArgs } from "@remix-run/node";
import { defaultLocaleFromEnv } from "../../locales/i18n.server";
import prisma from "../../db.server";
import { enqueueProductIncrementalScan } from "../../features/scans/scan-enqueue.server";
import { authenticate } from "../../shopify.server";
import { numericProductIdFromWebhookPayload } from "../../features/webhooks/webhook-product-payload.server";

/**
 * AD-04: PRODUCTS_CREATE — HMAC-verified by `authenticate.webhook`.
 * Enqueues an incremental product scan when `autoScanOnUpdate` is on.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);
  const productId = numericProductIdFromWebhookPayload(payload);
  if (!productId) {
    console.warn(`[webhook] ${topic} shop=${shop} missing product id`);
    return new Response();
  }

  const settings = await prisma.shopSettings.findFirst({
    where: { shop: { platform: "shopify", externalDomain: shop } },
  });
  if (settings && !settings.autoScanOnUpdate) {
    return new Response();
  }

  const result = await enqueueProductIncrementalScan(
    prisma,
    shop,
    productId,
    defaultLocaleFromEnv(),
  );
  if (!result.ok && result.httpStatus >= 500) {
    console.error(`[webhook] ${topic} enqueue failed`, result.error);
  }
  return new Response();
};

export default function ProductsCreateWebhook() {
  return null;
}
