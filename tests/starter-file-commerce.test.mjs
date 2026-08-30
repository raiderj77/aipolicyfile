import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

function runCommonJs(source, filename, extraGlobals = {}, moduleRequire = require) {
  const commonJsModule = { exports: {} };
  vm.runInNewContext(source, {
    ...extraGlobals,
    exports: commonJsModule.exports,
    module: commonJsModule,
    require: moduleRequire,
  }, { filename });
  return commonJsModule.exports;
}

function compileTsx(source, filename) {
  return ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  }).outputText;
}

function loadCheckoutValidator(pageSource) {
  const filename = "src/app/starter-file/page.tsx";
  const sourceFile = ts.createSourceFile(
    filename,
    pageSource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const declaration = sourceFile.statements.find(
    (statement) =>
      ts.isFunctionDeclaration(statement) &&
      statement.name?.text === "externalCheckoutUrl",
  );
  assert.ok(declaration, "the page must define its checkout URL validator");

  const isolatedSource = `${declaration.getText(sourceFile)}\nmodule.exports = { externalCheckoutUrl };`;
  const compiled = compileTsx(isolatedSource, filename);
  return runCommonJs(compiled, filename, { URL }).externalCheckoutUrl;
}

function loadPurchaseComponent(componentSource) {
  const filename = "src/components/StarterFilePurchase.tsx";
  const compiled = compileTsx(componentSource, filename);
  const componentRequire = (specifier) => {
    if (specifier === "@/lib/analytics") {
      return {
        GA4_MEASUREMENT_ID: "G-MEY1Y9KDNJ",
        buildStarterFileBeginCheckout: () => ({}),
      };
    }
    return require(specifier);
  };
  return runCommonJs(compiled, filename, {}, componentRequire).default;
}

test("public and merchant Starter File copy fixes the price, billing model, refund, and license", async () => {
  const [page, purchase, terms, listing, launch] = await Promise.all([
    read("../src/app/starter-file/page.tsx"),
    read("../src/components/StarterFilePurchase.tsx"),
    read("../src/app/terms/page.tsx"),
    read("../docs/gumroad-starter-file-listing.md"),
    read("../docs/paid-starter-file-launch.md"),
  ]);

  assert.match(page, /\$19 one-time/);
  assert.match(`${page}\n${purchase}`, /No subscription/);
  assert.match(terms, /single \$19 charge, not a subscription/i);
  assert.match(
    terms,
    /no recurring\s+fee, automatic renewal, minimum term, or cancellation step/i,
  );

  assert.match(page, /14-day refund window/i);
  assert.match(page, /within 14 calendar days of purchase/i);
  assert.match(terms, /14-day refund process/i);
  assert.match(terms, /full refund for any reason[\s\S]*within 14 calendar days after purchase/i);

  assert.match(page, /One-business license/i);
  assert.match(page, /One purchasing business may customize and use the file/i);
  assert.match(terms, /grants one purchasing business a limited,[\s\S]*non-transferable license/i);
  assert.match(terms, /separate license for each client business/i);

  const refundCopy = `${page}\n${purchase}\n${terms}\n${listing}\n${launch}`;
  const normalizedTerms = terms.replace(/\s+/g, " ");
  const normalizedListing = listing.replace(/\s+/g, " ");
  const normalizedLaunch = launch.replace(/\s+/g, " ");
  assert.match(refundCopy, /full refund[\s\S]*hosted (?:download )?access[\s\S]*blank-file license/i);
  assert.match(normalizedTerms, /stop using or distributing the blank product files/i);
  assert.match(normalizedTerms, /delete or destroy every copy under its control/i);
  assert.match(normalizedTerms, /Files already downloaded cannot be remotely erased/i);
  assert.match(normalizedTerms, /does not require the business to retract or destroy lawful.*completed outputs/i);
  assert.match(normalizedTerms, /may not make any new use of the blank product files after the refund/i);
  assert.match(normalizedListing, /A confirmed full refund ends this license/i);
  assert.match(normalizedListing, /license also ends after a material breach that is not cured after notice/i);
  assert.match(normalizedTerms, /license also ends when a full refund is confirmed or after a material breach/i);
  assert.match(normalizedLaunch, /downloaded files cannot be remotely erased/i);
});

test("checkout accepts only HTTPS Gumroad or Paddle hosts", async () => {
  const page = await read("../src/app/starter-file/page.tsx");
  const externalCheckoutUrl = loadCheckoutValidator(page);

  for (const url of [
    "https://gumroad.com/l/ai-disclosure-starter-file",
    "https://store.gumroad.com/l/ai-disclosure-starter-file",
    "https://paddle.com/checkout/offer",
    "https://checkout.paddle.com/checkout/offer",
    "https://paddle.net/checkout/offer",
    "https://buy.paddle.net/checkout/offer",
  ]) {
    assert.equal(
      externalCheckoutUrl(url),
      url,
      `${url} should be accepted as an allowlisted checkout URL`,
    );
  }

  for (const url of [
    "http://gumroad.com/l/offer",
    "http://checkout.paddle.com/offer",
    "https://user:secret@gumroad.com/l/offer",
    "https://gumroad.com.evil.example/l/offer",
    "https://evilgumroad.com/l/offer",
    "https://paddle.net.evil.example/offer",
    "https://evilpaddle.com/offer",
    "https://paddle.com@evil.example/offer",
    "https://aipolicyfile.com/checkout",
    "https://www.aipolicyfile.com/checkout",
    "https://localhost:3000/checkout",
    "https://127.0.0.1/checkout",
    "not a URL",
  ]) {
    assert.equal(
      externalCheckoutUrl(url),
      null,
      `${url} should be rejected as an unsafe checkout URL`,
    );
  }
});

test("purchase href appears only when all three independent sales gates pass", async () => {
  const componentSource = await read("../src/components/StarterFilePurchase.tsx");
  const StarterFilePurchase = loadPurchaseComponent(componentSource);
  const approvedUrl = "https://gumroad.com/l/ai-disclosure-starter-file";

  for (const sourceCurrent of [false, true]) {
    for (const checkoutConfigured of [false, true]) {
      for (const salesEnabled of [false, true]) {
        const available = sourceCurrent && checkoutConfigured && salesEnabled;
        const html = renderToStaticMarkup(
          React.createElement(StarterFilePurchase, {
            checkoutUrl: checkoutConfigured ? approvedUrl : null,
            nextSourceReviewLabel: "September 29, 2026",
            salesEnabled,
            sourceCurrent,
          }),
        );

        assert.match(
          html,
          new RegExp(`data-checkout-state="${available ? "available" : "closed"}"`),
        );

        if (available) {
          assert.match(html, new RegExp(`href="${approvedUrl}"`));
          assert.match(html, /Buy the Starter File for \$19/);
        } else {
          assert.doesNotMatch(html, /<a\b[^>]*\bhref=/i);
          assert.match(html, /Not currently for sale/);
          assert.match(html, /Checkout closed\./);
        }
      }
    }
  }
});
