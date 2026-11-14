import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { getAppUrl } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const appUrl = getAppUrl();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Ezsygram — Sell. Automate. Grow.",
    template: "%s | Ezsygram",
  },
  description:
    "Turn your Instagram followers into customers. Build your store, sell digital products, courses and sessions, accept UPI instantly, and automate every DM and comment.",
  applicationName: "Ezsygram",
  keywords: [
    "Ezsygram",
    "link in bio India",
    "creator storefront",
    "sell digital products UPI",
    "Instagram DM automation",
    "creator monetization India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: appUrl,
    siteName: "Ezsygram",
    title: "Ezsygram — Sell. Automate. Grow.",
    description:
      "Turn your Instagram followers into customers with a link-in-bio store, UPI payments, and automated DMs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ezsygram — Sell. Automate. Grow.",
    description:
      "Turn your Instagram followers into customers with a link-in-bio store, UPI payments, and automated DMs.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFB" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B1A" },
  ],
};

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("ezsygram-theme");if(t==="dark"){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-canvas-light font-sans text-slate-900 antialiased dark:bg-canvas-dark dark:text-slate-100">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

