import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 44,
          background: "linear-gradient(135deg, #6D28D9 0%, #5B35DF 55%, #4F46E5 100%)",
          border: "4px solid rgba(255, 255, 255, 0.24)",
        }}
      >
        <svg
          width="136"
          height="136"
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
    ),
    {
      ...size,
    }
  );
}

