import { getLlmsText } from "@/lib/llmsText";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(getLlmsText(), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=60",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
