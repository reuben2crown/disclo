import { describe, expect, it } from "vitest";
import {
  buildAuditLogPdf,
  computeAuditRecordDigest,
  type AuditLogPdfInputRow,
} from "./pdf-export.js";

const sampleRows = (): AuditLogPdfInputRow[] => [
  {
    id: "b",
    action: "labelled",
    reviewedAt: "2026-04-01T12:00:00.000Z",
    contentHash: "hash-b",
    notes: "Citations: eu_ai_act_art50",
    scanItemId: "si-1",
    productContentId: "99",
    regulations: ["eu_ai_act_art50"],
  },
  {
    id: "a",
    action: "human_reviewed",
    reviewedAt: "2026-04-02T12:00:00.000Z",
    contentHash: "hash-a",
    notes: null,
    scanItemId: "si-2",
    productContentId: "100",
    regulations: ["ftc_green"],
  },
];

describe("computeAuditRecordDigest", () => {
  it("is stable regardless of input order", () => {
    const r = sampleRows();
    const d1 = computeAuditRecordDigest(r);
    const d2 = computeAuditRecordDigest([r[1]!, r[0]!]);
    expect(d1).toBe(d2);
    expect(d1).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe("buildAuditLogPdf", () => {
  it("produces a non-empty PDF document", async () => {
    const rows = sampleRows();
    const bytes = await buildAuditLogPdf({
      shopDomain: "test.myshopify.com",
      rows,
      title: "Disclo audit export",
      declarationLines: [
        "This document lists audit log entries for compliance review.",
        "Verify integrity by recomputing SHA-256 over the same rows (sorted by id).",
      ],
    });
    const head = new TextDecoder("latin1").decode(bytes.slice(0, 5));
    expect(head).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(400);
  });
});
