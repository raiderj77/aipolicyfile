import { NextRequest, NextResponse } from "next/server";
import {
  buildTelegramMessage,
  MAX_WAITLIST_BODY_BYTES,
  parseWaitlistBody,
} from "@/lib/waitlist.mjs";

const TELEGRAM_ENDPOINT = "https://api.telegram.org";

export async function POST(request: NextRequest) {
  if (request.headers.get("content-type")?.split(";", 1)[0].trim() !== "application/json") {
    return NextResponse.json({ ok: false }, { status: 415 });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_WAITLIST_BODY_BYTES) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  try {
    const parsed = parseWaitlistBody(await request.text());
    if (!parsed.ok || !parsed.data) {
      return NextResponse.json({ ok: false }, { status: parsed.status });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return NextResponse.json({ ok: false }, { status: 503 });
    }

    const response = await fetch(`${TELEGRAM_ENDPOINT}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage(parsed.data),
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
