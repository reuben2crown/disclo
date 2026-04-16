/**
 * Plan → Linear sync helper.
 * - `node scripts/linear-sync-completed.mjs` — print completed XX-NN codes from plan YAML.
 * - `node scripts/linear-sync-completed.mjs path/to/list_issues.json` — print REU ids to mark Done (dry run).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const planPath = path.resolve(
  __dirname,
  "../../.cursor/plans/disclo_phase1_sprints.plan.md",
);

/** Extra Linear title prefixes when a Sprint0 todo is completed (no XX-NN at start of `content`). */
const COMPLETED_TODO_EXTRA_CODES = {
  "s0-artifact-threat-model": ["SEC-01"],
  "s0-artifact-secrets-runbook": ["SEC-02"],
  "s0-secrets-env-parity": ["SEC-02"],
  "s0-webhook-contract-tests": ["SEC-03-TEST"],
  "s0-incident-response-doc": ["SEC-07"],
  "s0-ci-sec06": ["SEC-06"],
};

export function completedCodesFromPlan(planMarkdown) {
  const parts = planMarkdown.split(/^---$/m);
  const yaml = parts[1] ?? "";
  const blocks = yaml.split(/\n  - id:/).slice(1);
  const codes = new Set();

  for (const b of blocks) {
    const status = b.match(/status:\s*(\w+)/)?.[1];
    if (status !== "completed") continue;
    const id = b.match(/^\s*(\S+)/)?.[1]?.trim();
    const extras = id ? COMPLETED_TODO_EXTRA_CODES[id] : undefined;
    if (extras) for (const c of extras) codes.add(c);

    const content = b.match(/content:\s*"([^"]+)"/)?.[1] ?? "";
    const lead = content.match(/^([A-Z]{2,6}-[0-9]+):/);
    if (lead) codes.add(lead[1]);
    if (content.includes("SEC-06")) codes.add("SEC-06");
    if (content.includes("SEC-07")) codes.add("SEC-07");
  }
  return [...codes].sort();
}

/** Codes → mark matching Linear issues Done (run with second arg `linear-json-path`). */
export function issuesToMarkDone(linearIssues, planCodes) {
  const wantTestSec03 = planCodes.includes("SEC-03-TEST");
  const codeSet = new Set(planCodes.filter((c) => c !== "SEC-03-TEST"));
  const out = [];
  const seen = new Set();

  for (const i of linearIssues) {
    if (i.status === "Done" || i.status === "Canceled" || i.status === "Duplicate")
      continue;
    const t = i.title ?? "";
    if (t.startsWith("[Epic]")) continue;

    if (
      wantTestSec03 &&
      (t.startsWith("[Test] SEC-03:") || t.startsWith("[Test] SEC-03 "))
    ) {
      if (!seen.has(i.id)) {
        seen.add(i.id);
        out.push({ id: i.id, title: t, code: "SEC-03-TEST", test: true });
      }
      continue;
    }

    for (const c of codeSet) {
      if (t.startsWith(`${c}:`)) {
        if (!seen.has(i.id)) {
          seen.add(i.id);
          out.push({ id: i.id, title: t, code: c });
        }
        break;
      }
    }
  }
  return out;
}

const jsonPath = process.argv[2];
const text = fs.readFileSync(planPath, "utf8");

if (jsonPath) {
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const issues = raw.issues ?? raw;
  const codes = completedCodesFromPlan(text);
  const mark = issuesToMarkDone(issues, codes);
  process.stdout.write(`${JSON.stringify(mark, null, 2)}\n`);
  process.stderr.write(`issues to mark Done: ${mark.length}\nplan codes: ${codes.length}\n`);
} else {
  const sorted = completedCodesFromPlan(text);
  process.stdout.write(`${sorted.join("\n")}\n`);
  process.stderr.write(`count: ${sorted.length}\n`);
}
