import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HookRate — Score your hooks with AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 64, fontWeight: 700, color: "#fff" }}>
            Hook
          </span>
          <span style={{ fontSize: 64, fontWeight: 700, color: "#a1a1aa" }}>
            Rate
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 180,
            height: 180,
            borderRadius: "50%",
            border: "6px solid #4ade80",
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 72, fontWeight: 700, color: "#4ade80" }}>
            87
          </span>
        </div>
        <p style={{ fontSize: 32, color: "#a1a1aa", margin: 0 }}>
          Score your hooks with AI
        </p>
        <p style={{ fontSize: 20, color: "#71717a", margin: "16px 0 0 0" }}>
          TikTok · Instagram Reels · YouTube Shorts · LinkedIn
        </p>
      </div>
    ),
    { ...size }
  );
}
