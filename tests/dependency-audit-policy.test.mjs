import assert from "node:assert/strict";
import test from "node:test";

import { validateAuditPolicy } from "../scripts/check-dependency-audit.mjs";

const chain = [
  "braces",
  "micromatch",
  "fast-glob",
  "@next/eslint-plugin-next",
  "eslint-config-next",
];

function fixture() {
  const vulnerabilities = {
    braces: {
      severity: "high",
      via: [{ url: "https://github.com/advisories/GHSA-vfj7-8cjw-p6xm" }],
      nodes: ["node_modules/braces"],
    },
    micromatch: { severity: "high", via: ["braces"], nodes: ["node_modules/micromatch"] },
    "fast-glob": { severity: "high", via: ["micromatch"], nodes: ["node_modules/fast-glob"] },
    "@next/eslint-plugin-next": {
      severity: "high",
      via: ["fast-glob"],
      nodes: ["node_modules/@next/eslint-plugin-next"],
    },
    "eslint-config-next": {
      severity: "high",
      via: ["@next/eslint-plugin-next"],
      nodes: ["node_modules/eslint-config-next"],
    },
  };
  const packages = Object.fromEntries(
    chain.map((name) => [`node_modules/${name}`, { dev: true, version: name === "braces" ? "3.0.3" : "1.0.0" }]),
  );

  return {
    fullReport: { metadata: { vulnerabilities: { total: chain.length } }, vulnerabilities },
    lockfile: { packages },
    now: new Date("2026-10-13T12:00:00Z"),
    productionReport: { metadata: { vulnerabilities: { total: 0 } }, vulnerabilities: {} },
  };
}

test("accepts only the exact unexpired development dependency exception", () => {
  assert.deepEqual(validateAuditPolicy(fixture()), { exceptionActive: true });
});

test("passes without an exception when all audits are clean", () => {
  const input = fixture();
  input.fullReport = { metadata: { vulnerabilities: { total: 0 } }, vulnerabilities: {} };
  assert.deepEqual(validateAuditPolicy(input), { exceptionActive: false });
});

test("rejects production findings", () => {
  const input = fixture();
  input.productionReport.metadata.vulnerabilities.total = 1;
  input.productionReport.vulnerabilities.next = { severity: "critical" };
  assert.throws(() => validateAuditPolicy(input), /Production dependencies contain/);
});

test("rejects audit metadata that understates detailed findings", () => {
  const productionInput = fixture();
  productionInput.productionReport.vulnerabilities.next = { severity: "critical" };
  assert.throws(() => validateAuditPolicy(productionInput), /metadata and detail counts disagree/);

  const fullInput = fixture();
  fullInput.fullReport.metadata.vulnerabilities.total -= 1;
  assert.throws(() => validateAuditPolicy(fullInput), /metadata and detail counts disagree/);
});

test("rejects an unexpected advisory", () => {
  const input = fixture();
  input.fullReport.vulnerabilities.braces.via.push({ url: "https://github.com/advisories/GHSA-new" });
  assert.throws(() => validateAuditPolicy(input), /advisory identity changed/);
});

test("rejects a changed dependency edge even when every package is allowlisted", () => {
  const input = fixture();
  input.fullReport.vulnerabilities.micromatch.via = ["eslint-config-next"];
  assert.throws(() => validateAuditPolicy(input), /dependency path changed/);
});

test("rejects runtime exposure or expiry", () => {
  const runtimeInput = fixture();
  runtimeInput.lockfile.packages["node_modules/braces"].dev = false;
  assert.throws(() => validateAuditPolicy(runtimeInput), /not proven development-only/);

  const expiredInput = fixture();
  expiredInput.now = new Date("2026-11-14T00:00:00Z");
  assert.throws(() => validateAuditPolicy(expiredInput), /exception expired/);
});
