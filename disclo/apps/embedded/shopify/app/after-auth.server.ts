import type { Session } from "@shopify/shopify-app-remix/server";
import { encryptString, getMerchantMessages, loadServerEnv, type SupportedLocale } from "@disclo/core";
import { merchantSupportSuffix } from "./features/dashboard/merchant-support.server.js";
import prisma from "./db.server";

/** Online session fields (optional on offline tokens). */
type SessionWithProfile = Session & {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

/**
 * AD-01: Persist encrypted offline token, user, auth identity, shop, and default settings after OAuth.
 */
export async function syncShopAfterAuth(
  session: Session,
  locale: SupportedLocale,
) {
  const m = getMerchantMessages(locale);
  const s = session as SessionWithProfile;
  const env = loadServerEnv();
  const encryptionKey = env.ENCRYPTION_KEY;
  if (!encryptionKey || encryptionKey.length < 32) {
    console.error(
      "[disclo] after-auth: encryption key missing or shorter than 32 characters",
    );
    throw new Error(
      `${m.oauth.serverNotReady} ${merchantSupportSuffix(locale)}`,
    );
  }

  const freePlan = await prisma.plan.findUnique({ where: { name: "free" } });
  if (!freePlan) {
    console.error('[disclo] after-auth: plan row "free" missing; run db seed');
    throw new Error(
      `${m.oauth.databaseNotReady} ${merchantSupportSuffix(locale)}`,
    );
  }

  const email =
    s.email?.trim() ||
    `${s.shop.replace(/[^a-z0-9-]/gi, "-")}@shop.disclo.local`;

  const displayName =
    [s.firstName, s.lastName].filter(Boolean).join(" ").trim() || null;

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      displayName,
      emailVerified: Boolean(s.email),
    },
    update: {
      displayName: displayName ?? undefined,
      lastLoginAt: new Date(),
    },
  });

  await prisma.authIdentity.upsert({
    where: {
      provider_providerAccountId: {
        provider: "shopify",
        providerAccountId: s.shop,
      },
    },
    create: {
      userId: user.id,
      provider: "shopify",
      providerAccountId: s.shop,
      providerEmail: s.email ?? null,
    },
    update: {
      providerEmail: s.email ?? null,
    },
  });

  if (!s.accessToken) {
    throw new Error(m.oauth.missingAccessToken);
  }
  const encrypted = encryptString(s.accessToken, encryptionKey);

  const shop = await prisma.shop.upsert({
    where: {
      platform_externalDomain: {
        platform: "shopify",
        externalDomain: s.shop,
      },
    },
    create: {
      ownerUserId: user.id,
      platform: "shopify",
      externalDomain: s.shop,
      accessToken: encrypted,
      planId: freePlan.id,
      displayName: s.shop,
    },
    update: {
      accessToken: encrypted,
      displayName: s.shop,
    },
  });

  await prisma.shopSettings.upsert({
    where: { shopId: shop.id },
    create: { shopId: shop.id },
    update: {},
  });
}
