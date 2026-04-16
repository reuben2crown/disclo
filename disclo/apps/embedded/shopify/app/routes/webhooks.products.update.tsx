import type { ActionFunctionArgs } from "@remix-run/node";
import { defaultLocaleFromEnv } from "../i18n.server.js";
import prisma from "../db.server";
import { enqueueProductIncrementalScan } from "../scan-enqueue.server";
import { authenticate } from "../shopify.server";
import { numericProductIdFromWebhookPayload } from "../webhook-product-payload.server";

/** AD-04: PRODUCTS_UPDATE */
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

export default function ProductsUpdateWebhook() {
  return null;
}
