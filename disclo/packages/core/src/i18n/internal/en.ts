/**
 * Operator-facing HTTP error bodies (internal routes, worker callbacks).
 * English only; not shown in the embedded admin UI.
 */
export const internalHttpMessagesEn = {
  postOnly:
    "This URL only accepts POST. Point your worker or cron at it with POST, not GET.",
  authFailed:
    "Request rejected. Set INTERNAL_API_SECRET to the same value on the Remix app and the worker, and send Authorization: Bearer <that secret>.",
} as const;

export type InternalHttpMessages = typeof internalHttpMessagesEn;
