# AI Disclosure Starter File product source

This directory holds the generated, versioned offline bundle for the $19 one-time AI Disclosure Starter File. The generator is `scripts/build-starter-file.mjs`; it reads the canonical framework, checker, official-source, and review metadata from `src/lib/laws.ts`. The public offer's three core filenames are fixed as `ai-disclosure-starter-file.html`, `README.txt`, and `BUSINESS-LICENSE.txt`.

Run from the repository root:

```powershell
node scripts/build-starter-file.mjs
```

The command writes `generated/ai-disclosure-starter-file-v1.0.0/` plus the deterministic merchant archive `generated/ai-disclosure-starter-file-v1.0.0.zip`. The ZIP has a fixed versioned root, file order, stored bytes, CRCs, and build-date timestamp. It has no command-line date override. When any canonical substantive review is overdue, it still writes a blocked bundle and ZIP for inspection, marks every dependent output `SOURCE REVIEW OVERDUE`, disables tool generation/export/printing, and exits with code 2. Neither blocked artifact may be sold or shipped.

The build becomes packageable only after the canonical source-review workflow records current substantive review metadata. A successful source gate still requires the normal owner release review.

The artifact is intentionally self-contained: no dependencies, account, AI, storage, analytics, or automatic requests. Only explicit user clicks on embedded official-source links can navigate away from the file.
