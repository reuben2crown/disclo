// In-memory rate limiting map. For a distributed app, use Redis.
// TODO: Update to use Redis
// Store entries by IP or user identifier
const rateLimits = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute for writes

export function rateLimitWrite(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimits.get(identifier);

  if (!record) {
    rateLimits.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return true; // Allowed
  }

  if (now > record.resetAt) {
    // Window expired, reset
    rateLimits.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return true; // Allowed
  }

  if (record.count >= MAX_REQUESTS) {
    return false; // Rate limited
  }

  record.count++;
  return true; // Allowed
}

// Optional cleanup interval to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimits.entries()) {
    if (now > value.resetAt) {
      rateLimits.delete(key);
    }
  }
}, WINDOW_MS * 5);
