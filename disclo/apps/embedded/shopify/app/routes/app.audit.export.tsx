import type { LoaderFunctionArgs } from "@remix-run/node";
import { buildAuditPdfDownloadResponse } from "../features/audit/audit-pdf-download.server.js";
import { localeFromRequest } from "../locales/i18n.server.js";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

/**
 * BE-11: authenticated PDF download (plan feature auditLogPdfExport).
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = localeFromRequest(request);
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const regulation = url.searchParams.get("regulation")?.trim() || null;

  const result = await buildAuditPdfDownloadResponse(
    prisma,
    session.shop,
    locale,
    regulation,
  );

  if (!result.ok) {
    const headers: Record<string, string> = {
      "Content-Type": "text/plain; charset=utf-8",
    };
    if (result.actionUrl) {
      headers["X-Disclo-Action-Url"] = result.actionUrl;
      headers["X-Disclo-Action-Label"] = result.actionLabel ?? "";
    }
    throw new Response(result.message, { status: result.status, headers });
  }

  return result.response;
};
