import { NextRequest, NextResponse } from "next/server";
import {
  buildTelegramMessage,
  MAX_WAITLIST_BODY_BYTES,
  parseWaitlistBody,
  readLimitedRequestBody,
} from "@/lib/waitlist.mjs";

const TELEGRAM_ENDPOINT = "https://api.telegram.org";
const TELEGRAM_TIMEOUT_MS = 5_000;

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (origin !== new URL(request.url).origin || (fetchSite && fetchSite !== "same-origin")) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  if (request.headers.get("content-type")?.split(";", 1)[0].trim() !== "application/json") {
    return NextResponse.json({ ok: false }, { status: 415 });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_WAITLIST_BODY_BYTES) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  const limitedBody = await readLimitedRequestBody(request);
  if (!limitedBody.ok || limitedBody.text === undefined) {
    return NextResponse.json({ ok: false }, { status: limitedBody.status });
  }

  const parsed = parseWaitlistBody(limitedBody.text);
  if (!parsed.ok || !parsed.data) {
    return NextResponse.json({ ok: false }, { status: parsed.status });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  try {
    const response = await fetch(`${TELEGRAM_ENDPOINT}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
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
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
