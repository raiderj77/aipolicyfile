import { getLawTrackerCsv } from "@/lib/lawTracker";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(getLawTrackerCsv(), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      "Content-Disposition": 'attachment; filename="ai-disclosure-law-tracker.csv"',
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
