import { NextRequest, NextResponse } from "next/server";

// Zero-retention waitlist: no database. Each signup is forwarded once to the
// site owner via Telegram (set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the
// deployment environment). If those are unset the signup still succeeds from
// the user's perspective and is visible in function logs only.

export async function POST(request: NextRequest) {
  let body: { email?: string; role?: string; worth?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim().slice(0, 200);
  if (!email || !email.includes("@") || email.length < 5) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  const role = (body.role || "unspecified").slice(0, 40);
  const worth = (body.worth || "unspecified").slice(0, 40);
  const source = (body.source || "site").slice(0, 40);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const line = `aipolicyfile waitlist signup\nemail: ${email}\nrole: ${role}\nworth: ${worth}\nsource: ${source}`;

  if (token && chatId) {
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: line }),
      });
    } catch (err) {
      console.error("waitlist telegram forward failed", err);
    }
  } else {
    console.log(line);
  }

  return NextResponse.json({ ok: true });
}
