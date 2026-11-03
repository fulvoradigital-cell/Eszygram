import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creator Revenue OS | SuperProfile & Stan Store Alternative for India",
  description:
    "The all-in-one monetization OS for Indian digital creators, educators, and influencers. Sell digital products, courses, 1:1 sessions, and collect payments with instant UPI checkout.",
  keywords: [
    "Creator Revenue OS",
    "Stan Store Alternative",
    "SuperProfile Alternative",
    "Indian Creators",
    "UPI Checkout",
    "Digital Products India",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-brand-500 selection:text-white">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

