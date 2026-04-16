/**
 * Write-only audit log action names (REQUIREMENTS §7.5, §10.4–10.5).
 * Stored in `audit_log.action`.
 */
export const AUDIT_ACTIONS = [
  "human_reviewed",
  "exemption_expired",
  "labelled",
  "claim_substantiated",
  "rewrite_applied",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];
