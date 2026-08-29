# aipolicyfile.com

Free AI disclosure-law screening tool plus a consent-based founding list.
The checker runs in the browser. Founding-list submissions are forwarded to a
private Telegram chat; the site has no separate waitlist database, and Telegram
messages carry server-generated consent and manual retention metadata. The account-side
auto-delete control and legacy-message purge remain separate operational checks.

## Stack

Next.js (App Router, TypeScript, Tailwind v4). No database. Dynamic routes are
the Telegram-backed waitlist endpoint, the current-clock CSV download, and
`/llms.txt`; none stores checker answers or results.

## Deploy (Vercel)

1. Import the `raiderj77/aipolicyfile` repo in Vercel (framework preset:
   Next.js, no special settings needed).
2. Set two environment variables (Production):
   - `TELEGRAM_BOT_TOKEN` — a bot token stored only in Vercel
   - `TELEGRAM_CHAT_ID` — the private destination chat ID
   Without them the public pages still work, but the waitlist endpoint returns
   a service-unavailable response and does not log the submitted fields.
3. Add the domain `aipolicyfile.com` to the Vercel project, then at Namecheap
   switch the domain from parking to Vercel: an `A` record for `@` pointing to
   `76.76.21.21` and a `CNAME` for `www` pointing to
   `cname.vercel-dns.com` (Vercel's domain screen shows the exact values).

## Content facts

Structured law facts, official source records, fingerprints where available,
per-framework review metadata, checker logic, and result provenance live in
`src/lib/laws.ts`. Substantial guide explanations live in `src/lib/lawPages.ts`
and consume the centralized source records. The last substantive human review was
August 2, 2026 and the scheduled review date was August 9, 2026. An AI-assisted
comparison against official sources found material corrections on August 29, 2026.
A deterministic monitor separately checked official links, recorded fingerprints,
current FTC text, and pending SB 1000 status. Neither process replaced substantive
human review, so dependent output remains visibly overdue.

Standing rule for this site: it gives educational information, never legal
advice, and every page that shows results must say so.

Project rules are versioned in `PROJECT_CHARTER.md`. Data handling is inventoried
in `docs/data-inventory.md`; incident handling is in `docs/incident-response.md`.
