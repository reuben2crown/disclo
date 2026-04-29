import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "../db.server.js";
import { authenticate } from "../shopify.server.js";

/**
 * NOTIF-02 polling endpoint for embedded surfaces.
 * Returns unread count and the latest unread row for the current shop owner.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await prisma.shop.findFirst({
    where: { platform: "shopify", externalDomain: session.shop },
    select: { ownerUserId: true, id: true },
  });
  if (!shop) {
    return json({ unreadCount: 0, latest: null });
  }

  const [unreadCount, latest] = await Promise.all([
    prisma.notification.count({
      where: { userId: shop.ownerUserId, readAt: null, shopId: shop.id },
    }),
    prisma.notification.findFirst({
      where: { userId: shop.ownerUserId, readAt: null, shopId: shop.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        body: true,
        link: true,
        createdAt: true,
      },
    }),
  ]);

  return json({
    unreadCount,
    latest: latest
      ? {
          ...latest,
          createdAt: latest.createdAt.toISOString(),
        }
      : null,
  });
};

export default function NotificationsEndpoint() {
  return null;
}
