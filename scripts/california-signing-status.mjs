// This verifies the announcement only, not enacted text or operative dates.
export function hasCaliforniaSigningAnnouncement(html) {
  const listHtml = html.match(/Governor Newsom today signed the following legislation:[\s\S]*?<ul\b[^>]*>([\s\S]*?)<\/ul>/i)?.[1];
  const signedList = listHtml?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  return Boolean(signedList && /\bAB 2713\b/.test(signedList) && /\bSB 1000\b/.test(signedList));
}
