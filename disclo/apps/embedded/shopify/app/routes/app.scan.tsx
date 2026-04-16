import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getMerchantMessages } from "@disclo/core/i18n";
import { localeFromRequest } from "../i18n.server";
import prisma from "../db.server";
import { enqueueFullShopScan } from "../scan-enqueue.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const locale = localeFromRequest(request);
  const m = getMerchantMessages(locale);
  if (request.method !== "POST") {
    return json({ ok: false, error: m.scanAction.wrongMethod }, { status: 405 });
  }

  const { session } = await authenticate.admin(request);
  const result = await enqueueFullShopScan(
    prisma,
    session.shop,
    "merchant",
    locale,
  );

  if (!result.ok) {
    return json(
      {
        ok: false,
        error: result.error,
        ...(result.actionUrl != null ? { actionUrl: result.actionUrl } : {}),
        ...(result.actionLabel != null
          ? { actionLabel: result.actionLabel }
          : {}),
      },
      { status: result.httpStatus },
    );
  }

  return json({ ok: true, scanId: result.scanId });
};

export default function AppScanAction() {
  return null;
}
