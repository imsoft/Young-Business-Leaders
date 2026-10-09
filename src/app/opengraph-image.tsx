import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const alt = SITE_NAME;
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
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(160deg, #EBA43F 0%, #D9862B 100%)",
          color: "#1A1714",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
          <div style={{ fontSize: 22, letterSpacing: 6, fontWeight: 700, opacity: 0.8 }}>YOUNG BUSINESS LEADERS · MX</div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, marginTop: 20 }}>{SITE_TAGLINE}</div>
          <div style={{ fontSize: 28, marginTop: 24, opacity: 0.85 }}>Comunidad de jóvenes emprendedores en Jalisco</div>
        </div>
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: 999,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
          }}
        >
          <svg width="170" height="170" viewBox="0 0 64 64" fill="none" stroke="#E9A23B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 12h26a9 9 0 0 1 0 18H26" />
            <path d="M26 30h16a11 11 0 0 1 0 22H16" />
          </svg>
        </div>
      </div>
    ),
    size,
  );
}
