import { ImageResponse } from "next/og";

export const alt = "AI Policy File - source-linked AI disclosure law screening";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #eef2ff 0%, #ffffff 48%, #e0e7ff 100%)",
          color: "#0f172a",
          padding: "72px 84px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: 30, fontWeight: 700 }}>
          <div
            style={{
              width: 58,
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              background: "#4f46e5",
              color: "white",
            }}
          >
            AI
          </div>
          AI Policy File
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 800, letterSpacing: "-2px" }}>
            Which AI disclosure rules are worth reviewing?
          </div>
          <div style={{ marginTop: 30, fontSize: 28, lineHeight: 1.35, color: "#475569" }}>
            Conservative screening, plain-English limitations, and links to official sources.
          </div>
        </div>
        <div style={{ display: "flex", gap: "14px", fontSize: 22, color: "#4338ca" }}>
          Free checker <span style={{ color: "#94a3b8" }}>•</span> Educational information <span style={{ color: "#94a3b8" }}>•</span> Not legal advice
        </div>
      </div>
    ),
    size,
  );
}
