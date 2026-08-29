export const MAX_WAITLIST_BODY_BYTES = 4096;
export const WAITLIST_CONSENT_NOTICE_VERSION = "waitlist-launch-v1";
export const WAITLIST_RETENTION_TARGET_DAYS = 365;
export const WAITLIST_RETENTION_RULE =
  "Delete on verified withdrawal; otherwise within 30 days after the one launch email; the destination chat auto-deletes new messages after 365 days as a backstop.";

export async function readLimitedRequestBody(request, maxBytes = MAX_WAITLIST_BODY_BYTES) {
  const reader = request.body?.getReader();
  if (!reader) return { ok: true, status: 200, text: "" };

  const decoder = new TextDecoder();
  let bytesRead = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > maxBytes) {
        await reader.cancel();
        return { ok: false, status: 413 };
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return { ok: true, status: 200, text };
  } catch {
    return { ok: false, status: 400 };
  }
}

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

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400 };
  }

  const allowedFields = new Set(["email", "role", "worth", "source", "website", "consent"]);
  if (Object.keys(body).some((field) => !allowedFields.has(field))) {
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

export function buildTelegramMessage({ email, role, worth, source }, now = new Date()) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new TypeError("buildTelegramMessage requires a valid Date");
  }
  const submittedAt = now.toISOString();
  const retentionDue = new Date(now.getTime());
  retentionDue.setUTCDate(retentionDue.getUTCDate() + WAITLIST_RETENTION_TARGET_DAYS);

  return [
    "aipolicyfile waitlist signup",
    `email: ${email}`,
    `role: ${role || "not provided"}`,
    `worth: ${worth || "not provided"}`,
    `source: ${source}`,
    `submitted_at_utc: ${submittedAt}`,
    `consent_notice_version: ${WAITLIST_CONSENT_NOTICE_VERSION}`,
    `retention_due_utc: ${retentionDue.toISOString()}`,
    `retention_rule: ${WAITLIST_RETENTION_RULE}`,
  ].join("\n");
}
