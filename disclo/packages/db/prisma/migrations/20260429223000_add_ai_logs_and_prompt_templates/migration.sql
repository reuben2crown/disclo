-- CreateTable
CREATE TABLE "ai_logs" (
    "id" UUID NOT NULL,
    "storeId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "featureName" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "modelVersion" TEXT,
    "latencyMs" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_templates" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_logs_storeId_createdAt_idx" ON "ai_logs"("storeId", "createdAt");

-- CreateIndex
CREATE INDEX "ai_logs_requestId_idx" ON "ai_logs"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_templates_name_key" ON "prompt_templates"("name");
