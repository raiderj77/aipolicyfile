# aipolicyfile.com

Free AI disclosure-law screening tool plus a consent-based founding list.
The checker runs in the browser. Founding-list submissions are forwarded to a
private Telegram chat; the site has no separate waitlist database, and Telegram
messages remain until the owner deletes them as described in the privacy policy.

## Stack

Next.js (App Router, TypeScript, Tailwind v4). No database. The only dynamic
piece is `src/app/api/waitlist/route.ts`, which forwards signups to Telegram.

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

Core law facts live in `src/lib/laws.ts`; substantial guide explanations and
source lists live in `src/lib/lawPages.ts`. The five frameworks were rechecked
against current official sources on August 2, 2026, including Regulation (EU)
2026/1744. The next official-source review is due August 9, 2026.

Standing rule for this site: it gives educational information, never legal
advice, and every page that shows results must say so.
