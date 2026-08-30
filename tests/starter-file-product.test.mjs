import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

import {
  ARTIFACT_DIRECTORY,
  ARTIFACT_VERSION,
  EDUCATIONAL_LIMITATION,
  QUESTION_ORDER,
  STARTER_TEMPLATE_VERSION,
  assertReleaseReady,
  buildSourceLedger,
  buildStarterFile,
  calculateReviewStatus,
  createProductOutput,
  renderMarkdownOutput,
  renderPrintableOutput,
} from "../scripts/build-starter-file.mjs";
import {
  CHECKER_VERSION,
  LAWS,
  LEGAL_SOURCE_DATA_VERSION,
  evaluate,
} from "../src/lib/laws.ts";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const productRoot = path.join(repositoryRoot, "product", "starter-file");
const generatedDirectory = path.join(productRoot, "generated", ARTIFACT_DIRECTORY);
const allNo = Object.fromEntries(QUESTION_ORDER.map((key) => [key, "no"]));
const allUnsure = Object.fromEntries(QUESTION_ORDER.map((key) => [key, "unsure"]));

function digest(content) {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

function parseStoredZip(buffer) {
  const localEntries = new Map();
  const localOffsets = new Map();
  let offset = 0;
  while (buffer.readUInt32LE(offset) === 0x04034b50) {
    const flags = buffer.readUInt16LE(offset + 6);
    const method = buffer.readUInt16LE(offset + 8);
    const checksum = buffer.readUInt32LE(offset + 14);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const uncompressedSize = buffer.readUInt32LE(offset + 22);
    const nameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    assert.equal(flags, 0x0800, "ZIP entries must use only the UTF-8 flag");
    assert.equal(method, 0, "deterministic archive must use the stored method");
    assert.equal(compressedSize, uncompressedSize);
    const nameStart = offset + 30;
    const name = buffer.subarray(nameStart, nameStart + nameLength).toString("utf8");
    const dataStart = nameStart + nameLength + extraLength;
    const data = buffer.subarray(dataStart, dataStart + compressedSize);
    assert.ok(!localEntries.has(name), `duplicate ZIP entry ${name}`);
    localOffsets.set(name, offset);
    localEntries.set(name, { checksum, data });
    offset = dataStart + compressedSize;
  }

  const centralStart = offset;
  const centralEntries = new Map();
  while (buffer.readUInt32LE(offset) === 0x02014b50) {
    const checksum = buffer.readUInt32LE(offset + 16);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const nameStart = offset + 46;
    const name = buffer.subarray(nameStart, nameStart + nameLength).toString("utf8");
    assert.equal(compressedSize, uncompressedSize);
    centralEntries.set(name, { checksum, localOffset });
    offset = nameStart + nameLength + extraLength + commentLength;
  }
  assert.equal(buffer.readUInt32LE(offset), 0x06054b50, "ZIP must end with an EOCD record");
  assert.equal(buffer.readUInt16LE(offset + 8), localEntries.size);
  assert.equal(buffer.readUInt16LE(offset + 10), localEntries.size);
  assert.equal(buffer.readUInt32LE(offset + 12), offset - centralStart);
  assert.equal(buffer.readUInt32LE(offset + 16), centralStart);
  assert.equal(buffer.readUInt16LE(offset + 20), 0);
  assert.equal(offset + 22, buffer.length, "ZIP must not contain an undeclared trailer");
  assert.deepEqual([...centralEntries.keys()], [...localEntries.keys()]);
  for (const [name, central] of centralEntries) {
    assert.equal(central.localOffset, localOffsets.get(name));
    assert.equal(central.checksum, localEntries.get(name).checksum);
  }
  return localEntries;
}

async function readDirectory(directory) {
  const names = (await readdir(directory)).sort();
  return Object.fromEntries(
    await Promise.all(names.map(async (name) => [name, await readFile(path.join(directory, name), "utf8")])),
  );
}

function toolDataFromHtml(html) {
  const match = html.match(/<script>window\.STARTER_FILE_DATA=([\s\S]*?);<\/script>/);
  assert.ok(match, "tool must embed its deterministic data as JSON");
  return JSON.parse(match[1]);
}

test("canonical review dates fail closed on the first day after the due date", () => {
  const dueDay = buildSourceLedger({ asOfDate: "2026-08-09" });
  assert.equal(dueDay.reviewStatus.overdue, false);
  assert.equal(dueDay.reviewStatus.state, "CURRENT");

  const nextDay = buildSourceLedger({ asOfDate: "2026-08-10" });
  assert.equal(nextDay.reviewStatus.overdue, true);
  assert.equal(nextDay.reviewStatus.state, "SOURCE REVIEW OVERDUE");
  assert.deepEqual(nextDay.reviewStatus.overdueFrameworkIds, Object.keys(LAWS));

  assert.throws(
    () => calculateReviewStatus(nextDay.frameworks, "08/10/2026"),
    /Invalid as-of date/,
  );
  assert.throws(
    () => calculateReviewStatus(nextDay.frameworks, "2026-02-30", "2026-03-02T12:00:00Z"),
    /Invalid as-of date/,
  );
  assert.throws(
    () => calculateReviewStatus(nextDay.frameworks, "2026-08-10", "2026-08-11T00:00:00Z"),
    /must fall on the as-of UTC date/,
  );
});

test("review currentness starts at the exact owner-authorization timestamp", () => {
  const frameworks = [
    {
      id: "synthetic",
      review: {
        dateWindowAuthorized: true,
        authorizationStartsAt: "2026-08-30T08:10:00-07:00",
        lastSubstantiveHumanReviewDate: "2026-08-30",
        nextReviewDue: "2026-09-06",
        lastAutomatedSourceCheckDate: "2026-08-30",
        reviewRecordId: "legal-review-2026-08-30-owner",
        reviewAuthorizationState: "signed",
        reviewMetadataLinked: true,
      },
    },
  ];
  assert.equal(
    calculateReviewStatus(frameworks, "2026-08-30", "2026-08-30T15:09:59.999Z").overdue,
    true,
  );
  assert.equal(
    calculateReviewStatus(frameworks, "2026-08-30", "2026-08-30T15:10:00.000Z").overdue,
    false,
  );
  frameworks[0].review.dateWindowAuthorized = false;
  assert.equal(
    calculateReviewStatus(frameworks, "2026-08-30", "2026-08-30T15:10:00.000Z").overdue,
    true,
  );
});

test("source ledger carries every canonical framework, official source, and review version", () => {
  const ledger = buildSourceLedger({ asOfDate: "2026-08-29" });
  assert.equal(ledger.artifactVersion, ARTIFACT_VERSION);
  assert.equal(ledger.artifactTemplateVersion, STARTER_TEMPLATE_VERSION);
  assert.equal(ledger.legalSourceDataVersion, LEGAL_SOURCE_DATA_VERSION);
  assert.equal(ledger.checkerVersion, CHECKER_VERSION);
  assert.equal(ledger.frameworks.length, Object.keys(LAWS).length);

  for (const framework of ledger.frameworks) {
    const canonical = LAWS[framework.id];
    assert.ok(canonical, framework.id);
    assert.equal(framework.review.sourceDataVersion, canonical.review.sourceDataVersion);
    assert.equal(framework.review.checkerVersion, canonical.review.checkerVersion);
    assert.equal(
      framework.review.lastSubstantiveHumanReviewDate,
      canonical.review.lastSubstantiveHumanReviewDate,
    );
    assert.equal(framework.review.nextReviewDue, canonical.review.nextReviewDue);
    assert.deepEqual(
      framework.officialSources.map((source) => source.sourceId),
      canonical.officialSources.map((source) => source.sourceId),
    );
    for (const source of framework.officialSources) {
      assert.match(source.canonicalUrl, /^https:\/\//);
      assert.ok(source.authority);
      assert.ok(source.retrievedAt);
    }
  }
});

test("unanswered facts produce More information needed without hiding provenance", () => {
  const model = createProductOutput({
    answers: allUnsure,
    asOfDate: "2026-08-09",
    profile: { projectName: "Test project" },
  });
  assert.equal(model.releaseBlocked, false);
  assert.equal(model.sourceReviewStatus, "CURRENT");
  assert.equal(model.results.length, 5);
  assert.ok(model.results.every((result) => result.status === "More information needed"));

  for (const result of model.results) {
    assert.ok(result.matchedAnswers.length > 0);
    assert.ok(result.matchedAnswers.every((answer) => answer.answer === "Not sure"));
    assert.ok(result.unresolvedFacts.length > 0);
    assert.ok(result.officialSources.length > 0);
    assert.ok(result.sourceVersion);
    assert.ok(result.substantiveReviewDate);
    assert.ok(result.nextReviewDue);
    assert.ok(result.checkerVersion);
    assert.ok(Object.hasOwn(result, "templateVersion"));
  }
  assert.equal(model.educationalLimitation, EDUCATIONAL_LIMITATION);
});

test("answered product results retain canonical checker outcomes", () => {
  const scenarios = [
    allNo,
    { ...allNo, publish: "yes", sponsored: "yes" },
    { ...allNo, publish: "yes", euAudience: "yes" },
    { ...allNo, deepfakes: "yes", chatbot: "yes", nyAds: "yes", bigProvider: "yes" },
  ];
  for (const answers of scenarios) {
    const booleanAnswers = Object.fromEntries(
      QUESTION_ORDER.map((key) => [key, answers[key] === "yes"]),
    );
    const expected = evaluate(booleanAnswers, new Date("2026-08-09T12:00:00Z"));
    const actual = createProductOutput({ answers, asOfDate: "2026-08-09" }).results;
    assert.deepEqual(
      actual.map((result) => result.frameworkId),
      expected.map((result) => result.law.id),
    );
    assert.deepEqual(
      actual.map((result) => result.headline),
      expected.map((result) => result.headline),
    );
    assert.deepEqual(
      actual.map((result) => result.detail),
      expected.map((result) => result.detail),
    );
    assert.deepEqual(
      actual.map((result) => result.status),
      expected.map((result) => ({ review: "Worth reviewing", monitor: "Possible relevance", lower: "Lower apparent relevance" })[result.status]),
    );
  }
});

test("exports escape user text and expose required source and review metadata", () => {
  const model = createProductOutput({
    answers: allNo,
    asOfDate: "2026-08-09",
    profile: {
      projectName: '<script>alert("project")</script>',
      ownerOrTeam: "A & B",
      channel: "Website",
      aiUse: "drafting <headlines>",
      humanRole: "editor review",
    },
  });
  const markdown = renderMarkdownOutput(model);
  const printable = renderPrintableOutput(model);

  assert.doesNotMatch(printable, /<script>alert\("project"\)<\/script>/);
  assert.match(printable, /&lt;script&gt;alert\(&quot;project&quot;\)&lt;\/script&gt;/);
  assert.match(printable, /connect-src 'none'/);
  assert.equal(printable.toLowerCase().includes("<script"), false);
  assert.match(markdown, /Legal source data version:/);
  assert.match(markdown, /Last substantive human review:/);
  assert.match(markdown, /Next review due:/);
  assert.match(markdown, /Matched answers/);
  assert.match(markdown, /Unresolved facts/);
  assert.match(markdown, /Official sources/);
  assert.match(markdown, /Educational limitation/);
  for (const law of Object.values(LAWS)) {
    assert.match(markdown, new RegExp(law.review.sourceDataVersion.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("versioned bundle builds byte-for-byte deterministically and hashes every payload", async () => {
  const firstRoot = await mkdtemp(path.join(productRoot, ".test-build-a-"));
  const secondRoot = await mkdtemp(path.join(productRoot, ".test-build-b-"));
  try {
    const first = await buildStarterFile({ outputRoot: firstRoot, asOfDate: "2026-08-29" });
    const second = await buildStarterFile({ outputRoot: secondRoot, asOfDate: "2026-08-29" });
    assert.equal(first.manifest.releaseReady, false);
    assert.equal(first.manifest.releaseStatus, "blocked_source_review_overdue");
    assert.deepEqual(first.manifest, second.manifest);

    const firstFiles = await readDirectory(first.outputDirectory);
    const secondFiles = await readDirectory(second.outputDirectory);
    assert.deepEqual(firstFiles, secondFiles);
    const firstZip = await readFile(first.archivePath);
    const secondZip = await readFile(second.archivePath);
    assert.deepEqual(firstZip, secondZip);
    assert.equal(first.archiveSha256, digest(firstZip));
    assert.equal(first.archiveBytes, firstZip.length);
    assert.equal(path.basename(first.archivePath), `${ARTIFACT_DIRECTORY}.zip`);
    assert.deepEqual(Object.keys(firstFiles), [
      "BUSINESS-LICENSE.txt",
      "README.txt",
      "SAMPLE_OUTPUT.html",
      "SAMPLE_OUTPUT.md",
      "SOURCE_LEDGER.md",
      "ai-disclosure-starter-file.html",
      "manifest.json",
      "source-ledger.json",
    ]);

    const manifest = JSON.parse(firstFiles["manifest.json"]);
    for (const entry of manifest.files) {
      assert.equal(digest(firstFiles[entry.path]), entry.sha256, entry.path);
      assert.equal(Buffer.byteLength(firstFiles[entry.path], "utf8"), entry.bytes, entry.path);
    }
    const zipEntries = parseStoredZip(firstZip);
    assert.deepEqual([...zipEntries.keys()], manifest.archive.entries);
    assert.deepEqual(
      manifest.archive.entries,
      Object.keys(firstFiles)
        .sort((left, right) => left.localeCompare(right))
        .map((fileName) => `${ARTIFACT_DIRECTORY}/${fileName}`),
    );
    for (const entryName of manifest.archive.entries) {
      const fileName = entryName.slice(`${ARTIFACT_DIRECTORY}/`.length);
      assert.deepEqual(zipEntries.get(entryName).data, Buffer.from(firstFiles[fileName], "utf8"));
    }
    for (const fileName of [
      "README.txt",
      "SAMPLE_OUTPUT.html",
      "SAMPLE_OUTPUT.md",
      "SOURCE_LEDGER.md",
      "ai-disclosure-starter-file.html",
    ]) {
      assert.match(firstFiles[fileName], /SOURCE REVIEW OVERDUE/, fileName);
    }
    assert.ok(
      firstFiles["README.txt"].includes(`Legal source data: \`${LEGAL_SOURCE_DATA_VERSION}\``),
    );
    assert.match(firstFiles["README.txt"], /full refund for any reason within 14 calendar days/i);
    assert.match(firstFiles["README.txt"], /order ID and purchase email/i);
    assert.match(firstFiles["README.txt"], /confirmed full refund ends hosted download access/i);
    assert.match(firstFiles["README.txt"], /Downloaded files cannot be remotely erased/i);
    assert.match(firstFiles["README.txt"], /no new use of the blank files is permitted/i);
    assert.match(firstFiles["BUSINESS-LICENSE.txt"], /one purchasing business/i);
    assert.match(firstFiles["BUSINESS-LICENSE.txt"], /employees and contractors/i);
    assert.match(firstFiles["BUSINESS-LICENSE.txt"], /separate license for each client business/i);
    assert.match(firstFiles["BUSINESS-LICENSE.txt"], /business-use license for the blank product files end/i);
    assert.match(firstFiles["BUSINESS-LICENSE.txt"], /delete or destroy every copy under its control/i);
    assert.match(firstFiles["BUSINESS-LICENSE.txt"], /Files already downloaded cannot be remotely erased/i);
    assert.match(firstFiles["BUSINESS-LICENSE.txt"], /may not make any new use of the blank product files after the refund/i);
    assert.match(firstFiles["BUSINESS-LICENSE.txt"], /license also ends after a material breach that is not cured after notice/i);
  } finally {
    await rm(firstRoot, { recursive: true, force: true });
    await rm(secondRoot, { recursive: true, force: true });
  }
});

test("default CLI-equivalent builds do not persist the ephemeral gate timestamp", async () => {
  const firstRoot = await mkdtemp(path.join(productRoot, ".test-default-a-"));
  const secondRoot = await mkdtemp(path.join(productRoot, ".test-default-b-"));
  try {
    const first = await buildStarterFile({ outputRoot: firstRoot });
    const second = await buildStarterFile({ outputRoot: secondRoot });
    assert.equal(first.archiveSha256, second.archiveSha256);
    assert.deepEqual(await readFile(first.archivePath), await readFile(second.archivePath));
    assert.equal(Object.hasOwn(first.ledger.reviewStatus, "asOfTimestamp"), false);
  } finally {
    await rm(firstRoot, { recursive: true, force: true });
    await rm(secondRoot, { recursive: true, force: true });
  }
});

test("committed merchant bundle exactly matches a fresh deterministic build", async () => {
  const committedManifest = JSON.parse(
    await readFile(path.join(generatedDirectory, "manifest.json"), "utf8"),
  );
  const freshRoot = await mkdtemp(path.join(productRoot, ".test-committed-build-"));
  try {
    const fresh = await buildStarterFile({
      outputRoot: freshRoot,
      asOfDate: committedManifest.builtAsOf,
      // The exact wall-clock gate time is deliberately not serialized. End of
      // the recorded UTC build date deterministically reproduces a bundle that
      // could only have been committed after its signed authorization existed.
      asOfTimestamp: `${committedManifest.builtAsOf}T23:59:59.999Z`,
    });
    assert.deepEqual(
      await readDirectory(generatedDirectory),
      await readDirectory(fresh.outputDirectory),
      "committed generated files must be rebuilt whenever source or generator inputs change",
    );
    assert.deepEqual(
      await readFile(path.join(productRoot, "generated", `${ARTIFACT_DIRECTORY}.zip`)),
      await readFile(fresh.archivePath),
      "committed merchant ZIP must match the fresh deterministic archive",
    );
  } finally {
    await rm(freshRoot, { recursive: true, force: true });
  }
});

test("offline HTML has no automatic network, persistence, analytics, or AI path", async () => {
  const html = await readFile(
    path.join(generatedDirectory, "ai-disclosure-starter-file.html"),
    "utf8",
  );
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /default-src 'none'/);
  assert.match(html, /form-action 'none'/);
  assert.match(html, /referrer" content="no-referrer"/);
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc=/i);
  assert.doesNotMatch(html, /<link\b/i);
  assert.doesNotMatch(html, /\bfetch\s*\(/);
  assert.doesNotMatch(html, /\bXMLHttpRequest\b/);
  assert.doesNotMatch(html, /\bWebSocket\b/);
  assert.doesNotMatch(html, /\bEventSource\b/);
  assert.doesNotMatch(html, /\bsendBeacon\b/);
  assert.doesNotMatch(html, /\blocalStorage\b/);
  assert.doesNotMatch(html, /\bsessionStorage\b/);
  assert.doesNotMatch(html, /\bindexedDB\b/);
  assert.doesNotMatch(html, /document\.cookie/);
  assert.doesNotMatch(html, /serviceWorker/);
  assert.doesNotMatch(html, /dataLayer|gtag|google-analytics|googletagmanager/i);
  assert.match(html, /URL\.createObjectURL/);
  assert.match(html, /new Blob/);

  const ledger = buildSourceLedger({ asOfDate: "2026-08-29" });
  const allowedUrls = new Set(
    ledger.frameworks.flatMap((framework) =>
      framework.officialSources.map((source) => source.canonicalUrl),
    ),
  );
  const absoluteLinks = [...html.matchAll(/<a href="(https:[^"]+)" target="_blank" rel="noopener noreferrer">/g)]
    .map((match) => match[1].replaceAll("&amp;", "&"));
  assert.ok(absoluteLinks.length > 0);
  assert.ok(absoluteLinks.every((url) => allowedUrls.has(url)));
});

test("embedded offline decision table matches the canonical checker for all 256 answer sets", async () => {
  const html = await readFile(
    path.join(generatedDirectory, "ai-disclosure-starter-file.html"),
    "utf8",
  );
  const data = toolDataFromHtml(html);
  for (let mask = 0; mask < 2 ** QUESTION_ORDER.length; mask += 1) {
    const answers = Object.fromEntries(
      QUESTION_ORDER.map((key, index) => [key, Boolean(mask & (1 << index))]),
    );
    const canonical = evaluate(answers, new Date(`${data.ledger.assembledAsOf}T12:00:00Z`));
    for (const expected of canonical) {
      const frameworkTable = data.decisionTable[expected.law.id];
      const key = frameworkTable.signalKeys
        .map((answerKey) => (answers[answerKey] ? "1" : "0"))
        .join("");
      const actual = frameworkTable.cases[key];
      assert.equal(actual.frameworkId, expected.law.id);
      assert.equal(actual.headline, expected.headline);
      assert.equal(actual.detail, expected.detail);
      assert.deepEqual(actual.unresolvedFacts, expected.unresolvedFacts);
      assert.deepEqual(
        actual.matchedAnswers.map((answer) => [answer.key, answer.label]),
        expected.matchedSignals.map((answer) => [answer.answerKey, answer.label]),
      );
      assert.equal(actual.sourceVersion, expected.provenance.sourceVersion);
      assert.equal(actual.checkerVersion, expected.provenance.checkerVersion);
      assert.equal(
        actual.exampleDisclosure?.text,
        expected.sampleDisclosure?.text,
      );
    }
  }
});

test("overdue bundle disables actions in HTML, at runtime, and in print CSS", async () => {
  const html = await readFile(
    path.join(generatedDirectory, "ai-disclosure-starter-file.html"),
    "utf8",
  );
  assert.match(html, /<body class="review-overdue">/);
  assert.match(html, /SOURCE REVIEW OVERDUE — RELEASE AND EXPORT REFUSED/);
  assert.match(html, /id="generate" type="button" disabled/);
  assert.match(html, /today > framework\.review\.nextReviewDue/);
  assert.match(html, /framework\.review\.dateWindowAuthorized !== true/);
  assert.match(html, /now < authorizationStart/);
  assert.match(html, /body\.review-overdue \.page-content\{display:none!important\}/);
  assert.doesNotMatch(html, /\.hero,\.sidebar,\.form-panel,\.actions/);
  assert.match(html, /\.form-panel>h2,\.form-panel>\.privacy,\.form-panel form\{display:none\}/);
  assert.match(html, /window\.addEventListener\("beforeprint", function \(\) \{ gate\(\); \}\)/);

  const scripts = html.split("<script>").slice(1).map((segment) => {
    const end = segment.indexOf("</script>");
    assert.notEqual(end, -1, "each exact inline script opening must have an exact closing tag");
    return segment.slice(0, end);
  });
  assert.equal(scripts.length, 2);
  assert.doesNotThrow(() => new vm.Script(scripts.join("\n")));
});

test("committed bundle manifest is self-consistent and explicitly not releasable", async () => {
  const files = await readDirectory(generatedDirectory);
  const archive = await readFile(path.join(productRoot, "generated", `${ARTIFACT_DIRECTORY}.zip`));
  const manifest = JSON.parse(files["manifest.json"]);
  assert.equal(manifest.price.amount, 19);
  assert.equal(manifest.price.currency, "USD");
  assert.equal(manifest.price.cadence, "one_time");
  assert.equal(manifest.releaseReady, false);
  assert.equal(manifest.sourceReviewStatus.overdue, true);
  assert.deepEqual(manifest.sourceReviewStatus.overdueFrameworkIds, Object.keys(LAWS));
  for (const entry of manifest.files) {
    assert.equal(digest(files[entry.path]), entry.sha256, entry.path);
  }
  assert.deepEqual(
    manifest.files.map((entry) => entry.path),
    [
      "ai-disclosure-starter-file.html",
      "BUSINESS-LICENSE.txt",
      "README.txt",
      "SAMPLE_OUTPUT.html",
      "SAMPLE_OUTPUT.md",
      "SOURCE_LEDGER.md",
      "source-ledger.json",
    ],
  );
  const zipEntries = parseStoredZip(archive);
  assert.deepEqual([...zipEntries.keys()], manifest.archive.entries);
  for (const entryName of manifest.archive.entries) {
    const fileName = entryName.slice(`${ARTIFACT_DIRECTORY}/`.length);
    assert.deepEqual(zipEntries.get(entryName).data, Buffer.from(files[fileName], "utf8"));
  }
  assert.match(files["README.txt"], /confirmed full refund ends hosted download access/i);
  assert.match(files["README.txt"], /Downloaded files cannot be remotely erased/i);
  assert.match(files["BUSINESS-LICENSE.txt"], /business-use license for the blank product files end/i);
  assert.match(files["BUSINESS-LICENSE.txt"], /delete or destroy every copy under its control/i);
  assert.match(files["BUSINESS-LICENSE.txt"], /may not make any new use of the blank product files after the refund/i);
  assert.match(files["BUSINESS-LICENSE.txt"], /license also ends after a material breach that is not cured after notice/i);
  assert.throws(
    () => assertReleaseReady(manifest),
    (error) =>
      error.code === "SOURCE_REVIEW_OVERDUE" &&
      error.exitCode === 2 &&
      error.overdueFrameworkIds.length === 5,
  );

  const buildSource = await readFile(
    path.join(repositoryRoot, "scripts", "build-starter-file.mjs"),
    "utf8",
  );
  assert.doesNotMatch(buildSource, /--as-of/);
  assert.match(buildSource, /error instanceof SourceReviewOverdueError \? error\.exitCode : 1/);
});
