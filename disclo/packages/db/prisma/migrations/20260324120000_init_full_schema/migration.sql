-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "billingCustomerId" TEXT,
    "agencyAccount" BOOLEAN NOT NULL DEFAULT false,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_pass" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "failureTrialCount" INTEGER NOT NULL DEFAULT 0,
    "resetToken" TEXT,
    "tokenExpiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "auth_pass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_identities" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "providerEmail" TEXT,
    "encryptedToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "priceMonthlyUsd" DECIMAL(8,2),
    "maxItemsPerScan" INTEGER,
    "textDetection" BOOLEAN NOT NULL,
    "imageDetection" BOOLEAN NOT NULL,
    "fixDashboard" BOOLEAN NOT NULL,
    "auditLog" BOOLEAN NOT NULL,
    "auditLogPdfExport" BOOLEAN NOT NULL,
    "monthlyAutoScan" BOOLEAN NOT NULL,
    "rewriteEngine" BOOLEAN NOT NULL,
    "maxShops" INTEGER,
    "whiteLabelReports" BOOLEAN NOT NULL,
    "apiAccess" BOOLEAN NOT NULL,
    "apiMonthlyCalls" INTEGER,
    "teamMembers" INTEGER NOT NULL DEFAULT 1,
    "slaSupport" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_overrides" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "overrides" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdByAdminId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shops" (
    "id" UUID NOT NULL,
    "ownerUserId" UUID NOT NULL,
    "platform" TEXT NOT NULL,
    "externalDomain" TEXT NOT NULL,
    "accessToken" TEXT,
    "displayName" TEXT,
    "planId" UUID NOT NULL,
    "planOverrideId" UUID,
    "billingProvider" TEXT NOT NULL DEFAULT 'shopify',
    "billingId" TEXT,
    "lastScanAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop_settings" (
    "id" UUID NOT NULL,
    "shopId" UUID NOT NULL,
    "badgeTextShort" TEXT NOT NULL DEFAULT 'This content was created with AI assistance.',
    "badgeTextLong" TEXT,
    "greenBadgeTooltip" TEXT,
    "targetMarkets" TEXT[] DEFAULT ARRAY['EU']::TEXT[],
    "autoScanOnUpdate" BOOLEAN NOT NULL DEFAULT true,
    "notifyScanComplete" BOOLEAN NOT NULL DEFAULT true,
    "notifyHighRisk" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scans" (
    "id" UUID NOT NULL,
    "shopId" UUID NOT NULL,
    "scanType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "totalItems" INTEGER,
    "flaggedItems" INTEGER,
    "riskScore" INTEGER,
    "triggeredBy" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_items" (
    "id" UUID NOT NULL,
    "scanId" UUID NOT NULL,
    "shopId" UUID NOT NULL,
    "platform" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "aiProbability" DECIMAL(5,4),
    "riskLevel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "regulations" TEXT[],
    "flaggedClaims" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scan_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL,
    "scanItemId" UUID NOT NULL,
    "shopId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "reviewerName" TEXT,
    "reviewerEmail" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentHash" TEXT NOT NULL,
    "notes" TEXT,
    "createdByUserId" UUID,
    "evidenceItemId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" UUID NOT NULL,
    "shopId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "keyHash" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scopes" TEXT[],
    "monthlyLimit" INTEGER,
    "callsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "link" TEXT,
    "readAt" TIMESTAMP(3),
    "shopId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_endpoints" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "events" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_deliveries" (
    "id" UUID NOT NULL,
    "endpointId" UUID NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "httpStatus" INTEGER,
    "responseBody" TEXT,
    "responseTimeMs" INTEGER,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "succeeded" BOOLEAN NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextRetryAt" TIMESTAMP(3),

    CONSTRAINT "webhook_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_items" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "evidenceType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "certificationBody" TEXT,
    "certificateNumber" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "qualityTier" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "nextVerificationAt" TIMESTAMP(3),
    "referenceUrl" TEXT,
    "pageSnapshot" TEXT,
    "documentUrl" TEXT,
    "documentHash" TEXT,
    "assertionData" JSONB,
    "scope" TEXT NOT NULL DEFAULT 'account',
    "scopeShopId" UUID,
    "scopeExternalProductId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evidence_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_evidence" (
    "id" UUID NOT NULL,
    "scanItemId" UUID NOT NULL,
    "evidenceItemId" UUID NOT NULL,
    "linkedByUserId" UUID NOT NULL,
    "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification_registry_configs" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "issuingBody" TEXT NOT NULL,
    "lookupMethod" TEXT NOT NULL,
    "apiEndpoint" TEXT,
    "apiAuthType" TEXT,
    "urlPattern" TEXT,
    "checkFrequencyDays" INTEGER NOT NULL DEFAULT 30,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,

    CONSTRAINT "certification_registry_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_pass_userId_key" ON "auth_pass"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_pass_email_key" ON "auth_pass"("email");

-- CreateIndex
CREATE INDEX "auth_identities_userId_idx" ON "auth_identities"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_identities_provider_providerAccountId_key" ON "auth_identities"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "plans_name_key" ON "plans"("name");

-- CreateIndex
CREATE INDEX "plan_overrides_userId_idx" ON "plan_overrides"("userId");

-- CreateIndex
CREATE INDEX "shops_ownerUserId_idx" ON "shops"("ownerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "shops_platform_externalDomain_key" ON "shops"("platform", "externalDomain");

-- CreateIndex
CREATE UNIQUE INDEX "shop_settings_shopId_key" ON "shop_settings"("shopId");

-- CreateIndex
CREATE INDEX "scans_shopId_idx" ON "scans"("shopId");

-- CreateIndex
CREATE INDEX "scan_items_shopId_riskLevel_idx" ON "scan_items"("shopId", "riskLevel");

-- CreateIndex
CREATE INDEX "scan_items_shopId_status_idx" ON "scan_items"("shopId", "status");

-- CreateIndex
CREATE INDEX "scan_items_contentHash_idx" ON "scan_items"("contentHash");

-- CreateIndex
CREATE INDEX "scan_items_scanId_idx" ON "scan_items"("scanId");

-- CreateIndex
CREATE INDEX "audit_log_shopId_createdAt_idx" ON "audit_log"("shopId", "createdAt");

-- CreateIndex
CREATE INDEX "api_keys_shopId_idx" ON "api_keys"("shopId");

-- CreateIndex
CREATE INDEX "api_keys_userId_idx" ON "api_keys"("userId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_shopId_idx" ON "notifications"("shopId");

-- CreateIndex
CREATE INDEX "webhook_endpoints_userId_idx" ON "webhook_endpoints"("userId");

-- CreateIndex
CREATE INDEX "webhook_deliveries_endpointId_idx" ON "webhook_deliveries"("endpointId");

-- CreateIndex
CREATE INDEX "webhook_deliveries_attemptedAt_idx" ON "webhook_deliveries"("attemptedAt");

-- CreateIndex
CREATE INDEX "evidence_items_userId_idx" ON "evidence_items"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "claim_evidence_scanItemId_evidenceItemId_key" ON "claim_evidence"("scanItemId", "evidenceItemId");

-- CreateIndex
CREATE UNIQUE INDEX "certification_registry_configs_code_key" ON "certification_registry_configs"("code");

-- AddForeignKey
ALTER TABLE "auth_pass" ADD CONSTRAINT "auth_pass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_identities" ADD CONSTRAINT "auth_identities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_overrides" ADD CONSTRAINT "plan_overrides_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_overrides" ADD CONSTRAINT "plan_overrides_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_planOverrideId_fkey" FOREIGN KEY ("planOverrideId") REFERENCES "plan_overrides"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_settings" ADD CONSTRAINT "shop_settings_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scans" ADD CONSTRAINT "scans_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_items" ADD CONSTRAINT "scan_items_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "scans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_items" ADD CONSTRAINT "scan_items_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_scanItemId_fkey" FOREIGN KEY ("scanItemId") REFERENCES "scan_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_evidenceItemId_fkey" FOREIGN KEY ("evidenceItemId") REFERENCES "evidence_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "webhook_endpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_items" ADD CONSTRAINT "evidence_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_items" ADD CONSTRAINT "evidence_items_scopeShopId_fkey" FOREIGN KEY ("scopeShopId") REFERENCES "shops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_evidence" ADD CONSTRAINT "claim_evidence_scanItemId_fkey" FOREIGN KEY ("scanItemId") REFERENCES "scan_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_evidence" ADD CONSTRAINT "claim_evidence_evidenceItemId_fkey" FOREIGN KEY ("evidenceItemId") REFERENCES "evidence_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_evidence" ADD CONSTRAINT "claim_evidence_linkedByUserId_fkey" FOREIGN KEY ("linkedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
