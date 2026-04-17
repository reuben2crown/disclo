import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import shopify from "../../shopify.server";

/**
 * App-specific webhook endpoint. Register topics in `shopify.app.toml` or via Admin API.
 */
export async function action({ request }: ActionFunctionArgs) {
  const { topic, shop, session, payload } = await shopify.authenticate.webhook(request);
  console.info(`[webhook] ${topic} for ${shop}`, { session: !!session, payloadType: typeof payload });
  return json({ ok: true });
}

export default function Webhooks() {
  return null;
}
