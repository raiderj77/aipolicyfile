import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const EXCEPTION = Object.freeze({
  advisory: "https://github.com/advisories/GHSA-vfj7-8cjw-p6xm",
  expiresAt: "2026-11-13T23:59:59Z",
  package: "braces",
  version: "3.0.3",
});

const ALLOWED_CHAIN = new Set([
  "braces",
  "micromatch",
  "fast-glob",
  "@next/eslint-plugin-next",
  "eslint-config-next",
]);

const EXPECTED_VIA = new Map([
  ["micromatch", ["braces"]],
  ["fast-glob", ["micromatch"]],
  ["@next/eslint-plugin-next", ["fast-glob"]],
  ["eslint-config-next", ["@next/eslint-plugin-next"]],
]);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateReportSchema(report, label) {
  assert(report && typeof report === "object", `${label} audit did not return an object.`);
  assert(
    report.vulnerabilities &&
      typeof report.vulnerabilities === "object" &&
      !Array.isArray(report.vulnerabilities),
    `${label} audit is missing vulnerability details.`,
  );

  const total = report?.metadata?.vulnerabilities?.total;
  const detailedCount = Object.keys(report.vulnerabilities).length;
  assert(Number.isInteger(total) && total >= 0, `${label} audit has invalid vulnerability metadata.`);
  assert(total === detailedCount, `${label} audit metadata and detail counts disagree.`);
  return detailedCount;
}

export function validateAuditPolicy({ fullReport, lockfile, now, productionReport }) {
  assert(!productionReport?.error, `Production audit failed: ${productionReport?.error?.summary ?? "unknown error"}`);
  const productionCount = validateReportSchema(productionReport, "Production");
  assert(
    productionCount === 0,
    "Production dependencies contain an audit finding; no production exception is allowed.",
  );

  assert(!fullReport?.error, `Full audit failed: ${fullReport?.error?.summary ?? "unknown error"}`);
  validateReportSchema(fullReport, "Full");
  const vulnerabilities = fullReport?.vulnerabilities ?? {};
  const names = Object.keys(vulnerabilities);

  if (names.length === 0) {
    return { exceptionActive: false };
  }

  assert(
    now.getTime() <= Date.parse(EXCEPTION.expiresAt),
    `The temporary ${EXCEPTION.package} exception expired at ${EXCEPTION.expiresAt}.`,
  );
  assert(
    names.every((name) => ALLOWED_CHAIN.has(name)),
    `Unexpected audit findings: ${names.filter((name) => !ALLOWED_CHAIN.has(name)).join(", ")}`,
  );
  assert(
    names.length === ALLOWED_CHAIN.size && [...ALLOWED_CHAIN].every((name) => names.includes(name)),
    "The accepted dependency path changed and must be reviewed again.",
  );

  const braces = vulnerabilities[EXCEPTION.package];
  assert(braces?.severity === "high", "The accepted advisory severity changed.");
  assert(
    braces.via?.length === 1 &&
      typeof braces.via[0] === "object" &&
      braces.via[0].url === EXCEPTION.advisory,
    "The braces advisory identity changed or another braces advisory appeared.",
  );

  for (const name of names) {
    const vulnerability = vulnerabilities[name];
    assert(vulnerability.severity === "high", `${name} changed severity and must be reviewed again.`);

    if (name !== EXCEPTION.package) {
      const expectedVia = EXPECTED_VIA.get(name);
      assert(
        Array.isArray(vulnerability.via) &&
          vulnerability.via.length === expectedVia?.length &&
          vulnerability.via.every((via, index) => via === expectedVia[index]),
        `${name} dependency path changed and must be reviewed again.`,
      );
    }

    assert(vulnerability.nodes?.length > 0, `${name} has no auditable package-lock node.`);
    for (const node of vulnerability.nodes) {
      const lockEntry = lockfile?.packages?.[node];
      assert(lockEntry?.dev === true, `${node} is not proven development-only in package-lock.json.`);
    }
  }

  const installed = lockfile?.packages?.[`node_modules/${EXCEPTION.package}`];
  assert(installed?.version === EXCEPTION.version, `Expected ${EXCEPTION.package}@${EXCEPTION.version}.`);
  assert(installed?.dev === true, `${EXCEPTION.package} must remain development-only.`);

  return { exceptionActive: true };
}

function runAudit(extraArgs = []) {
  const npmCli = process.env.npm_execpath;
  assert(npmCli, "npm_execpath is unavailable; run this check through npm run audit:ci.");

  const result = spawnSync(
    process.execPath,
    [npmCli, "audit", "--json", "--audit-level=high", ...extraArgs],
    { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
  );

  assert(!result.error, `Unable to run npm audit: ${result.error?.message}`);
  assert(result.status === 0 || result.status === 1, result.stderr || "npm audit failed unexpectedly.");

  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`npm audit returned invalid JSON: ${result.stderr || result.stdout}`);
  }
}

function main() {
  const lockfile = JSON.parse(readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"));
  const productionReport = runAudit(["--omit=dev"]);
  const fullReport = runAudit();
  const result = validateAuditPolicy({
    fullReport,
    lockfile,
    now: new Date(),
    productionReport,
  });

  console.log("Production dependency audit: PASS (no known vulnerabilities).");
  if (result.exceptionActive) {
    console.log(
      `Development audit: PASS with exact temporary exception for ${EXCEPTION.package}@${EXCEPTION.version} ` +
        `(${EXCEPTION.advisory}); expires ${EXCEPTION.expiresAt}.`,
    );
  } else {
    console.log("Development dependency audit: PASS (no known vulnerabilities).");
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
