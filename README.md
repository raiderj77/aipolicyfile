# aipolicyfile.com

Free AI disclosure law checker + founding-member waitlist. Phase 1 validation
MVP: the checker drives traffic, the waitlist measures willingness to pay
(role + price-band segments arrive via Telegram, nothing is stored).

## Stack

Next.js (App Router, TypeScript, Tailwind v4). No database. The only dynamic
piece is `src/app/api/waitlist/route.ts`, which forwards signups to Telegram.

## Deploy (Vercel)

1. Import the `raiderj77/aipolicyfile` repo in Vercel (framework preset:
   Next.js, no special settings needed).
2. Set two environment variables (Production):
   - `TELEGRAM_BOT_TOKEN` — same bot rex2 uses
   - `TELEGRAM_CHAT_ID` — same chat id rex2 uses
   Without them the public pages still work, but the waitlist endpoint returns
   a service-unavailable response and does not log the submitted fields.
3. Add the domain `aipolicyfile.com` to the Vercel project, then at Namecheap
   switch the domain from parking to Vercel: an `A` record for `@` pointing to
   `76.76.21.21` and a `CNAME` for `www` pointing to
   `cname.vercel-dns.com` (Vercel's domain screen shows the exact values).

## Content facts

All law facts live in one file: `src/lib/laws.ts` (names, dates, penalties,
official URLs, and the `evaluate()` rules the checker runs). Verified July
2026. When a law changes, edit that file only.

Standing rule for this site: it gives educational information, never legal
advice, and every page that shows results must say so.
