import { createHash } from "node:crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getRegulationByCode } from "../regulations/configs.js";

/** One row for digest + PDF (shop-agnostic). */
export type AuditLogPdfInputRow = {
  id: string;
  action: string;
  reviewedAt: string;
  contentHash: string;
  notes: string | null;
  scanItemId: string;
  productContentId: string;
  regulations: string[];
};

/**
 * Deterministic SHA-256 over canonical audit rows (sorted by id).
 * Printed in the PDF declaration; recompute from the same source rows to verify.
 */
export function computeAuditRecordDigest(rows: AuditLogPdfInputRow[]): string {
  const canonical = [...rows]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((r) =>
      [
        r.id,
        r.action,
        r.reviewedAt,
        r.contentHash,
        r.notes ?? "",
        r.scanItemId,
        r.productContentId,
        [...r.regulations].sort().join(","),
      ].join("|"),
    )
    .join("\n");
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

function wrapLine(text: string, maxLen: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxLen) {
      cur = next;
    } else {
      if (cur) {
        lines.push(cur);
      }
      cur = w.length > maxLen ? `${w.slice(0, maxLen)}…` : w;
    }
  }
  if (cur) {
    lines.push(cur);
  }
  return lines.length ? lines : [""];
}

/**
 * BE-11: Multi-page PDF with cover declaration and per-entry detail (regulation names resolved).
 */
export async function buildAuditLogPdf(options: {
  shopDomain: string;
  rows: AuditLogPdfInputRow[];
  title: string;
  declarationLines: string[];
}): Promise<Uint8Array> {
  const { shopDomain, rows, title, declarationLines } = options;
  const generatedAt = new Date().toISOString();
  const recordDigest = computeAuditRecordDigest(rows);

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 9;
  const margin = 48;
  const pageWidth = 612;
  const pageHeight = 792;
  let page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const draw = (text: string, size: number, bold = false) => {
    const f = bold ? fontBold : font;
    page.drawText(text, { x: margin, y, size, font: f, color: rgb(0, 0, 0) });
    y -= size + 3;
  };

  const needSpace = (h: number) => {
    if (y < margin + h) {
      page = doc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
  };

  draw(title, 14, true);
  y -= 4;
  for (const line of declarationLines) {
    for (const wl of wrapLine(line, 92)) {
      needSpace(16);
      draw(wl, fontSize, false);
    }
  }
  needSpace(20);
  draw(`Shop: ${shopDomain}`, fontSize, false);
  draw(`Generated (UTC): ${generatedAt}`, fontSize, false);
  draw(`SHA-256 record digest: ${recordDigest}`, fontSize, true);
  y -= 8;
  needSpace(24);
  draw("Entries", fontSize, true);
  y -= 4;

  const sortedForDisplay = [...rows].sort((a, b) =>
    b.reviewedAt.localeCompare(a.reviewedAt),
  );

  for (const r of sortedForDisplay) {
    const regText = [...r.regulations]
      .map((c) => getRegulationByCode(c)?.displayName ?? c)
      .join("; ");
    const parts = [
      `Action: ${r.action} · Reviewed: ${r.reviewedAt}`,
      `Product ID: ${r.productContentId} · Scan item: ${r.scanItemId}`,
      `Content hash: ${r.contentHash}`,
      `Regulations: ${regText || "—"}`,
    ];
    if (r.notes?.trim()) {
      parts.push(`Notes: ${r.notes.trim()}`);
    }
    for (const part of parts) {
      for (const wl of wrapLine(part, 92)) {
        needSpace(18);
        draw(wl, fontSize, false);
      }
    }
    needSpace(20);
    y -= 6;
    draw("— — —", fontSize, false);
    y -= 6;
  }

  return doc.save();
}
