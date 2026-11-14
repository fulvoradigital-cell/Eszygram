import React from "react";
import { FAQ_ITEMS } from "@/lib/marketing-data";
import { getAppUrl } from "@/lib/utils";

export function JsonLd() {
  const appUrl = getAppUrl();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ezsygram",
    url: appUrl,
    logo: `${appUrl}/icon`,
    sameAs: [
      "https://instagram.com",
      "https://twitter.com",
      "https://youtube.com",
    ],
    description:
      "Link-in-bio storefront, UPI payments, and Instagram comment-to-DM automation for Indian creators.",
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Ezsygram",
    operatingSystem: "All",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Sell digital products, courses, bookings, accept UPI instantly, and automate Instagram DMs.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

