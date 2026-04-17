import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../../shopify.server";

/**
 * AD-04 / BE-21 bridge: APP_SUBSCRIPTIONS_UPDATE — sync `shops.billingId` + plan when billing is implemented.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);
  console.info(`[webhook] ${topic} shop=${shop}`, {
    hasPayload: payload != null,
  });
  return new Response();
};

export default function AppSubscriptionsUpdateWebhook() {
  return null;
}
