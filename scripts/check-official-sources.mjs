import { createHash } from "node:crypto";
import { LAWS } from "../src/lib/laws.ts";

const USER_AGENT = "AI-Policy-File-source-monitor/1.0 (+https://aipolicyfile.com/editorial-standards)";
const BLOCKED_STATUS = new Set([401, 403, 429]);
const EXPECTED_AUTOMATION_BLOCKS = new Map([
  ["ny-gbl-396-b", new Set([403, 429])],
  ["ny-s8420-a", new Set([403, 429])],
  ["ny-s8420-effective-date-announcement", new Set([403, 429])],
]);
const failures = [];
const warnings = [];
const observedExpectedBlocks = new Set();

async function fetchWithRetry(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
        ...options,
        headers: { "User-Agent": USER_AGENT, ...(options.headers ?? {}) },
      });
      if (response.status < 500 || attempt === 2) return response;
      await response.body?.cancel();
    } catch (error) {
      lastError = error;
      if (attempt === 2) throw error;
    }
  }
  throw lastError;
}

async function sha256Response(url) {
  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  return createHash("sha256").update(bytes).digest("hex");
}

const sources = Object.values(LAWS).flatMap((law) => law.officialSources);
const uniqueCanonicalSources = [...new Map(sources.map((source) => [source.canonicalUrl, source])).values()];

await Promise.all(
  uniqueCanonicalSources.map(async (source) => {
    try {
      const response = await fetchWithRetry(source.canonicalUrl, {
        headers: { Accept: "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8" },
      });
      await response.body?.cancel();
      if (response.ok || (response.status >= 300 && response.status < 400)) return;
      if (BLOCKED_STATUS.has(response.status)) {
        const expectedStatuses = EXPECTED_AUTOMATION_BLOCKS.get(source.sourceId);
        if (expectedStatuses?.has(response.status)) {
          observedExpectedBlocks.add(source.sourceId);
          warnings.push(
            `${source.sourceId}: allowlisted automation access limit returned HTTP ${response.status}`,
          );
          return;
        }
        failures.push(
          `${source.sourceId}: unexpected automation access block returned HTTP ${response.status}`,
        );
        return;
      }
      failures.push(`${source.sourceId}: official link returned HTTP ${response.status}`);
    } catch (error) {
      failures.push(`${source.sourceId}: official link request failed (${error instanceof Error ? error.message : String(error)})`);
    }
  }),
);

for (const sourceId of EXPECTED_AUTOMATION_BLOCKS.keys()) {
  const source = sources.find((item) => item.sourceId === sourceId);
  if (!source) {
    failures.push(`${sourceId}: allowlisted automation block references an unknown source`);
    continue;
  }
  const law = Object.values(LAWS).find((item) =>
    item.officialSources.some((officialSource) => officialSource.sourceId === sourceId),
  );
  if (law?.review.automatedSourceCheckStatus !== "access_limited") {
    failures.push(`${sourceId}: allowlisted access limit is not surfaced in framework metadata`);
  }
  if (!observedExpectedBlocks.has(sourceId)) {
    warnings.push(`${sourceId}: allowlisted access block was not observed; review the allowlist and metadata`);
  }
}

for (const source of sources.filter((item) => item.contentSha256 && item.fingerprintUrl)) {
  try {
    const actual = await sha256Response(source.fingerprintUrl);
    if (actual !== source.contentSha256) {
      failures.push(`${source.sourceId}: stored official snapshot fingerprint changed (${actual})`);
    }
  } catch (error) {
    failures.push(`${source.sourceId}: snapshot verification failed (${error instanceof Error ? error.message : String(error)})`);
  }
}

const ftc = LAWS.ftc.officialSources.find((source) => source.sourceId === "us-ftc-endorsement-guides");
if (!ftc?.contentSha256) {
  failures.push("us-ftc-endorsement-guides: missing comparison fingerprint");
} else {
  let checkedCurrentFtc = false;
  for (let daysAgo = 0; daysAgo <= 7 && !checkedCurrentFtc; daysAgo += 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - daysAgo);
    const dateLabel = date.toISOString().slice(0, 10);
    const url = `https://www.ecfr.gov/api/versioner/v1/full/${dateLabel}/title-16.xml?part=255`;
    try {
      const response = await fetchWithRetry(url);
      if (response.status === 404) continue;
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const actual = createHash("sha256").update(Buffer.from(await response.arrayBuffer())).digest("hex");
      checkedCurrentFtc = true;
      if (actual !== ftc.contentSha256) {
        failures.push(`us-ftc-endorsement-guides: current eCFR snapshot ${dateLabel} differs; substantive review required (${actual})`);
      }
    } catch (error) {
      failures.push(`us-ftc-endorsement-guides: current eCFR comparison failed (${error instanceof Error ? error.message : String(error)})`);
      checkedCurrentFtc = true;
    }
  }
  if (!checkedCurrentFtc) failures.push("us-ftc-endorsement-guides: no eCFR snapshot was available for the last eight UTC dates");
}

try {
  const response = await fetchWithRetry(
    "https://leginfo.legislature.ca.gov/faces/billStatusClient.xhtml?bill_id=202520260SB1000",
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const statusPage = await response.text();
  if (!/Active Bill\s*-\s*Passed/i.test(statusPage)) {
    failures.push("ca-sb1000-2025-2026: official status no longer says 'Active Bill - Passed'; substantive review required");
  }
} catch (error) {
  failures.push(`ca-sb1000-2025-2026: status monitor failed (${error instanceof Error ? error.message : String(error)})`);
}

for (const warning of warnings.sort()) console.warn(`SOURCE MONITOR WARNING: ${warning}`);

if (failures.length) {
  for (const failure of failures.sort()) console.error(`SOURCE MONITOR FAILURE: ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Official-source monitor completed with no detected source change: ${uniqueCanonicalSources.length} links ` +
      `(${warnings.length} explicit access warning${warnings.length === 1 ? "" : "s"}), ` +
      `${sources.filter((source) => source.contentSha256).length} stored snapshots, FTC current text, and SB 1000 status checked.`,
  );
}
