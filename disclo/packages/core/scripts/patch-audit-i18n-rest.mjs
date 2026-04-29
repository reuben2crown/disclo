import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const merchantDir = path.join(__dirname, "../src/i18n/merchant");

const auditBlock = `
  auditLog: {
    titleBar: "Audit log",
    intro:
      "Chronological record of reviewer actions (labels, human-reviewed, rewrites, and more). Filter by regulation that applies to the product at scan time. Export a PDF for your records when your plan includes PDF export.",
    filterLabel: "Regulation on product",
    allRegulations: "All regulations",
    applyFilter: "Apply filter",
    exportPdf: "Export PDF",
    exportPdfHelp:
      "Downloads a PDF with a SHA-256 digest of the included entries. Uses the same regulation filter as the list.",
    emptyTitle: "No audit entries yet",
    emptyDescription:
      "Actions from scans (such as applying a disclosure label) appear here.",
    emptyFilter:
      "No entries match this regulation filter. Clear the filter or pick another code.",
    upgradeTitle: "Audit log is not on your plan",
    upgradeBody:
      "Upgrade in Shopify admin to keep a full audit trail and export PDFs.",
    tableWhen: "When",
    tableAction: "Action",
    tableProduct: "Product ID",
    tableNotes: "Notes",
  },
`;

for (const f of fs.readdirSync(merchantDir)) {
  if (!f.endsWith(".ts") || f === "types.ts" || f === "hints-en.ts") continue;
  const fp = path.join(merchantDir, f);
  let s = fs.readFileSync(fp, "utf8");
  if (s.includes("auditLog:")) {
    continue;
  }
  if (!s.includes("\n  nav: {")) {
    console.log("skip no nav", f);
    continue;
  }
  s = s.replace(
    /(scans:[^\n]+\n)(    settings:)/,
    "$1    audit: \"Audit log\",\n$2",
  );
  if (!s.includes('audit: "Audit log"')) {
    console.error("nav patch failed", f);
    process.exit(1);
  }
  s = s.replace(/\n\n  footer:/, `${auditBlock}\n\n  footer:`);
  fs.writeFileSync(fp, s);
  console.log("ok", f);
}
