export const MAX_WAITLIST_BODY_BYTES = 4096;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = new Set(["", "creator", "smallbiz", "freelancer", "other"]);
const WORTH = new Set(["", "free", "5-10", "20-40", "40plus"]);
const SOURCES = new Set(["home", "checker"]);

export function parseWaitlistBody(rawBody) {
  if (new TextEncoder().encode(rawBody).byteLength > MAX_WAITLIST_BODY_BYTES) {
    return { ok: false, status: 413 };
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { ok: false, status: 400 };
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const role = typeof body.role === "string" ? body.role : "";
  const worth = typeof body.worth === "string" ? body.worth : "";
  const source = typeof body.source === "string" ? body.source : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";

  if (
    body.consent !== true ||
    website ||
    email.length > 254 ||
    !EMAIL_RE.test(email) ||
    !ROLES.has(role) ||
    !WORTH.has(worth) ||
    !SOURCES.has(source)
  ) {
    return { ok: false, status: 400 };
  }

  return { ok: true, status: 200, data: { email, role, worth, source } };
}

export function buildTelegramMessage({ email, role, worth, source }) {
  return [
    "aipolicyfile waitlist signup",
    `email: ${email}`,
    `role: ${role || "not provided"}`,
    `worth: ${worth || "not provided"}`,
    `source: ${source}`,
  ].join("\n");
}
