# Incident response

Last reviewed: 2026-08-29.

## Severity and containment

Treat security, privacy, billing, availability, and legal-content integrity as distinct incident categories. Preserve evidence without collecting unnecessary personal data. Do not publish a legal-source change, send outreach, alter billing, or delete user data through an automated agent without deterministic authorization and appropriate human confirmation.

A legal-content integrity incident includes a wrong law status, date, role, definition, exception, checker mapping, template, or citation, or an overdue source presented as current. Contain it by marking the affected framework `SOURCE REVIEW OVERDUE` or under review, pausing misleading dependent output, preserving prior versions, and linking the controlling official source.

## Response checklist

1. Record detection time, reporter, affected systems or framework, exposed versions, and verified facts.
2. Contain the smallest affected surface without destroying evidence.
3. Verify the primary source or technical root cause; separate verified, inferred, and unknown.
4. Correct the structured record or control and run relevant regression, build, accessibility, security, privacy, and stale-source checks.
5. Check dependent checker results, templates, CSV/LLM output, saved documents, analytics, logs, and customer output where they exist.
6. Publish a correction for material public legal errors. Identify affected checker/template versions and users when identifiable.
7. Notify affected people or authorities when facts and applicable requirements call for it; owner and qualified counsel decide legally consequential notifications.
8. Verify production directly, document recovery, and schedule follow-up prevention work.

## Reporting routes

- Legal/content corrections: `hello@aipolicyfile.com`, subject `Correction`
- Privacy: `hello@aipolicyfile.com`, subject `Privacy`
- Accessibility: `hello@aipolicyfile.com`, subject `Accessibility`
- Security: `hello@aipolicyfile.com`, subject `Security`

Do not send passwords, API keys, private legal files, health information, payment-card data, or exploit data that exceeds what is needed to reproduce a security issue.
