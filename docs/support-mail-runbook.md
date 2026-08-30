# Support mailbox runbook

Last verified: 2026-08-30.

This runbook covers `hello@aipolicyfile.com`. It is an operational record, not proof that every launch gate is complete. Never place mailbox passwords, recovery values, customer messages, order records, or security-event details in this repository.

## Current route

1. Namecheap BasicDNS publishes the Migadu MX, SPF, DKIM, verification, and DMARC records for `aipolicyfile.com`.
2. Migadu hosts `hello@aipolicyfile.com`, retains a server copy, and forwards a copy to the owner-controlled Gmail account.
3. Gmail applies the `AI Policy File Support` label and currently sends replies through `smtp.migadu.com` using TLS on port 587.
4. Gmail is configured to reply from the same address that received the message.

Google plans to remove third-party Send-as support from Gmail web and mobile in January 2027. Move replies to Migadu webmail or another directly configured mail client and repeat every routing/authentication test before that deadline.

## Verified evidence

- Migadu organization and mailbox ownership were verified under `raiderj77@gmail.com`; the mailbox recovery address is configured.
- External round-trip test `APF-20260829-04` reached Gmail with the dedicated label and its reply reached the external sender from `hello@aipolicyfile.com`.
- Separate outbound test `APF-20260829-03` passed SPF, DKIM, and DMARC at Google.
- The Gmail receiving account identifies Jason Ramirez / `raiderj77@gmail.com`, has 2-Step Verification on, and has recovery phone and recovery email methods configured. The values are intentionally not recorded here.
- Gmail showed no delegated mailbox accounts. The support address uses Migadu SMTP/TLS, and same-address replies are selected.
- Google reported no security alert or activity during the preceding 28 days when checked on 2026-08-30.

## Open security gates

- Google Security Checkup asks the owner to reconfirm the recovery phone and email. It also reports recommended reviews for devices and unverified linked applications. Only the owner can identify which devices and applications are trusted; do not remove access blindly.
- Migadu and Namecheap were signed out during the 2026-08-30 follow-up. Sign in personally, verify the exact account identity and recovery methods, and enable or confirm MFA. Namecheap had previously shown two-factor authentication off, so treat that as unresolved until rechecked and enabled.
- Verify Migadu webmail/session controls, spam/quarantine behavior, message export, deletion from both retained copies, and account recovery with synthetic data. Do not use a real customer message for the test.
- After any password, recovery, MFA, forwarding, DNS, mailbox, or client change, repeat external inbound, reply, SPF, DKIM, and DMARC tests.

## Daily handling

1. During launch and the first 10 qualifying orders, check the `AI Policy File Support` label and Gmail Spam daily. After that, check both at least weekly while sales remain open.
2. Reply from `hello@aipolicyfile.com`, not the personal Gmail identity. Confirm the From field before sending.
3. Ask only for the order ID and purchase email when order lookup is necessary. Never request or accept full card, bank, password, authentication-code, government-ID, health, privileged, or other highly sensitive data by email.
4. Keep customer records in the merchant dashboard and mailbox only. Do not copy them into Telegram, GitHub, Vercel logs, analytics, repository files, or general project notes.
5. Treat unexpected attachments and links as untrusted. Do not open executable or macro-enabled files to handle a support request.

## Retention, deletion, and export target

These targets remain provisional until the selected merchant's dispute, accounting, tax, and retention terms are verified:

- Routine pre-sale and general-support messages: delete from both Migadu and Gmail within 90 days after the issue is resolved, unless a shorter privacy-request deadline or a documented legal/security need applies.
- Waitlist messages: follow the published waitlist rule and delete on verified withdrawal or within 30 days after the launch email; the Telegram backstop is separate from mailbox copies.
- Order, delivery, and refund support: keep only the minimum correspondence needed for the open case, refund/chargeback window, accounting, and legal obligations. The merchant dashboard—not the mailbox—should remain the authoritative transaction record.
- Privacy, security, dispute, or legal-hold records: use a case-specific deletion date and record the reason without copying message contents into project logs.

Before sales open, run one synthetic export and deletion exercise. Confirm the message can be exported, deleted from Gmail and Migadu, removed from trash where appropriate, and no longer found through either mailbox search, subject to provider backup limitations. Deletion is destructive and requires owner confirmation at execution time.

## Incident response

If mail routing, account access, sender identity, authentication, delivery, or customer-data handling is uncertain:

1. Keep or set `STARTER_FILE_SALES_ENABLED=false` and pause the merchant product if it exists.
2. Do not reply from an uncertain identity or send customer data through another channel.
3. The owner changes compromised credentials, revokes unknown sessions/app access, and restores MFA/recovery. Verify forwarding, delegates, Send-as entries, filters, and DNS before reopening.
4. Preserve only the minimal evidence needed for investigation; do not store message bodies, credentials, or personal data in the repository or Telegram.
5. Repeat external inbound, reply, SPF, DKIM, and DMARC tests with synthetic messages.
6. Resume sales only after the support route, merchant route, privacy notice, and incident record agree and the owner authorizes release.
