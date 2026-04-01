import { Queue } from "bullmq";

export async function applyRateLimit(_key: string): Promise<void> {
  // Placeholder middleware hook for Redis token-bucket integration.
}

export async function enforceQuota(_key: string): Promise<void> {
  // Placeholder middleware hook for monthly quota enforcement.
}

export function createNotificationQueue(connection: { url: string }) {
  return new Queue("notification-queue", { connection });
}
