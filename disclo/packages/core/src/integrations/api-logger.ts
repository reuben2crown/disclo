import prisma from '@disclo/db';
import { randomUUID } from "node:crypto";

export interface ApiLogRequest {
  storeId: string;
  requestId?: string;
  featureName: string;
  provider: string;
  modelVersion?: string;
  latencyMs?: number;
  metadata?: Record<string, unknown>;
}

export async function apiLogger(request: ApiLogRequest): Promise<void> {
  await (prisma as any).aiLog.create({
    data: {
      storeId: request.storeId,
      requestId: request.requestId ?? randomUUID(),
      featureName: request.featureName,
      provider: request.provider,
      modelVersion: request.modelVersion ?? null,
      latencyMs: request.latencyMs ?? null,
      metadata: request.metadata ?? {},
    },
  });
}