import { ImageResponse } from "next/og";

export const alt =
  "AI Disclosure Starter File - a $19 one-time, offline disclosure planning worksheet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function StarterFileOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #eef2ff 0%, #ffffff 52%, #e0e7ff 100%)",
          color: "#0f172a",
          padding: "66px 78px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 15,
                background: "#4f46e5",
                color: "white",
              }}
            >
              AI
            </div>
            AI Policy File
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 999,
              background: "#ffffff",
              border: "2px solid #c7d2fe",
              color: "#3730a3",
              padding: "12px 22px",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            $19 once
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1020 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-2px",
            }}
          >
            AI Disclosure Starter File
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 30,
              lineHeight: 1.32,
              color: "#475569",
            }}
          >
            Turn your AI-use inventory into one practical, source-linked
            disclosure plan.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            fontSize: 22,
            color: "#4338ca",
          }}
        >
          Works offline <span style={{ color: "#94a3b8" }}>•</span> No account
          <span style={{ color: "#94a3b8" }}>•</span> No subscription
          <span style={{ color: "#94a3b8" }}>•</span> Educational, not legal advice
        </div>
      </div>
    ),
    size,
  );
}
