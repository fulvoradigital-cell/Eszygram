import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Ezsygram — Sell. Automate. Grow.";
export const size = {
  width: 1200,
  height: 630,
};
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
          padding: "72px 84px",
          backgroundColor: "#0B0B1A",
          backgroundImage:
            "radial-gradient(circle at 18% 18%, rgba(109, 40, 217, 0.42), transparent 46%), radial-gradient(circle at 86% 24%, rgba(79, 70, 229, 0.36), transparent 44%), radial-gradient(circle at 75% 86%, rgba(255, 122, 89, 0.22), transparent 40%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Brand Lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 84,
              height: 84,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 24,
              background:
                "linear-gradient(135deg, #6D28D9 0%, #5B35DF 55%, #4F46E5 100%)",
              border: "2px solid rgba(255, 255, 255, 0.28)",
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="11" y="10" width="6.5" height="28" rx="2.6" fill="#FFFFFF" />
              <rect x="11" y="10" width="25" height="6.5" rx="2.6" fill="#FFFFFF" />
              <rect x="11" y="31.5" width="25" height="6.5" rx="2.6" fill="#FFFFFF" />
              <path
                d="M13.6 20.75H27.2L24.5 24L27.2 27.25H13.6C12.1641 27.25 11 26.0859 11 24.65V23.35C11 21.9141 12.1641 20.75 13.6 20.75Z"
                fill="#FFFFFF"
              />
              <path
                d="M33.2 17.8L34.7 22.5L39.4 24L34.7 25.5L33.2 30.2L31.7 25.5L27 24L31.7 22.5L33.2 17.8Z"
                fill="#FF7A59"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 44,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Ezsygram
            </span>
            <span
              style={{
                fontSize: 20,
                color: "#FF7A59",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Sell. Automate. Grow.
            </span>
          </div>
        </div>

        {/* Center Value Proposition */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              maxWidth: 960,
            }}
          >
            Turn your Instagram followers into customers.
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#CBD5E1",
              maxWidth: 880,
              lineHeight: 1.4,
            }}
          >
            Link-in-bio storefronts, UPI-first checkout, digital products,
            courses, bookings & automated Instagram DMs for Indian creators.
          </div>
        </div>

        {/* Bottom Feature Pills */}
        <div style={{ display: "flex", gap: 16 }}>
          {["UPI & Cards", "Comment-to-DM", "Digital Products & Courses", "Built for India"].map(
            (pill) => (
              <div
                key={pill}
                style={{
                  display: "flex",
                  padding: "12px 22px",
                  borderRadius: 999,
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#E2E8F0",
                }}
              >
                {pill}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

