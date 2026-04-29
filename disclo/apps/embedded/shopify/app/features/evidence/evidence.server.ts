import type { PrismaClient } from "@disclo/db";

export async function getEvidenceContext(prisma: PrismaClient, shopDomain: string) {
  const shop = await prisma.shop.findFirst({
    where: { platform: "shopify", externalDomain: shopDomain },
    select: { id: true, ownerUserId: true },
  });
  return shop;
}

export async function listEvidenceForShopOwner(
  prisma: PrismaClient,
  ownerUserId: string,
  shopId: string,
) {
  return prisma.evidenceItem.findMany({
    where: {
      userId: ownerUserId,
      OR: [{ scope: "account" }, { scope: "shop", scopeShopId: shopId }],
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export async function createEvidenceItemForShopOwner(
  prisma: PrismaClient,
  input: {
    ownerUserId: string;
    shopId: string;
    evidenceType: string;
    title: string;
    qualityTier: string;
    referenceUrl?: string | null;
    documentUrl?: string | null;
    documentHash?: string | null;
    certificationBody?: string | null;
    certificateNumber?: string | null;
    notes?: string | null;
  },
) {
  return prisma.evidenceItem.create({
    data: {
      userId: input.ownerUserId,
      evidenceType: input.evidenceType,
      title: input.title,
      qualityTier: input.qualityTier,
      referenceUrl: input.referenceUrl ?? null,
      documentUrl: input.documentUrl ?? null,
      documentHash: input.documentHash ?? null,
      certificationBody: input.certificationBody ?? null,
      certificateNumber: input.certificateNumber ?? null,
      notes: input.notes ?? null,
      scope: "shop",
      scopeShopId: input.shopId,
    },
  });
}

export async function linkEvidenceToScanItem(args: {
  prisma: PrismaClient;
  ownerUserId: string;
  shopId: string;
  scanItemId: string;
  evidenceItemId: string;
}) {
  const { prisma, ownerUserId, shopId, scanItemId, evidenceItemId } = args;
  const [scanItem, evidence] = await Promise.all([
    prisma.scanItem.findFirst({
      where: { id: scanItemId, shopId },
      select: { id: true },
    }),
    prisma.evidenceItem.findFirst({
      where: {
        id: evidenceItemId,
        userId: ownerUserId,
        OR: [{ scope: "account" }, { scope: "shop", scopeShopId: shopId }],
      },
      select: { id: true },
    }),
  ]);
  if (!scanItem || !evidence) {
    return { ok: false as const };
  }
  await prisma.claimEvidence.upsert({
    where: {
      scanItemId_evidenceItemId: {
        scanItemId,
        evidenceItemId,
      },
    },
    create: {
      scanItemId,
      evidenceItemId,
      linkedByUserId: ownerUserId,
    },
    update: {},
  });
  return { ok: true as const };
}
