# Dependency security policy

Production dependencies have no audit exceptions. `npm run audit:ci` fails if
`npm audit --omit=dev --audit-level=high` reports any vulnerability.

## Temporary development-only exception

The full development audit may temporarily accept only
[`GHSA-vfj7-8cjw-p6xm`](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
for `braces@3.0.3`, through this exact lint-only chain:

`eslint-config-next` -> `@next/eslint-plugin-next` -> `fast-glob` ->
`micromatch` -> `braces`

This package is used by ESLint during development and CI. It is not present in
the production dependency audit, and the application does not accept user
supplied glob patterns. The upstream advisory currently lists no patched
release. The exception expires at `2026-11-13T23:59:59Z`.

The audit policy fails closed if the advisory, package version, dependency
path, development-only lockfile flags, or expiry changes. It also fails on any
new audit finding. Remove the exception as soon as upstream publishes a fixed
release or Next.js removes the dependency.
