import React from "react";
import type { Metadata } from "next";
import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data protection practices for Ezsygram.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas-light text-slate-900 antialiased dark:bg-canvas-dark dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3">
            <Badge variant="primary">Privacy</Badge>
            <h1 className="font-display text-fluid-hero font-extrabold tracking-tight text-slate-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400">
              *India-appropriate draft · Last updated: November 2026
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              At <strong>Ezsygram</strong>, we take the privacy and security of
              our creators and their customers seriously. This Privacy Policy
              describes how we collect, use, and protect your information under
              the Information Technology Act, 2000 and the Digital Personal Data
              Protection Act (DPDP), 2023 of India.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              1. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Creator Data:</strong> Name, email address, password
                hash, bank account or UPI details for payouts, and Instagram
                OAuth tokens.
              </li>
              <li>
                <strong>Buyer Data:</strong> Name, email address, and phone
                number collected during guest checkout to fulfill orders and
                deliver digital files or invoices.
              </li>
              <li>
                <strong>Technical Information:</strong> IP addresses, browser
                user agents, and device identifiers to detect fraud and prevent
                abuse.
              </li>
            </ul>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              2. How We Use Your Data
            </h2>
            <p>
              We process information strictly to provide storefront hosting,
              process UPI transactions through regulated payment aggregators,
              deliver digital files, automate Instagram direct messages as
              configured by creators, and generate invoices. We do not sell creator
              or buyer personal data to third parties.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              3. Data Ownership &amp; Portability
            </h2>
            <p>
              Creators retain 100% ownership of their customer contact records
              and may export customer lists as CSV at any time. Creators may
              request complete account and data deletion through their Settings
              dashboard.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              4. Payment Security
            </h2>
            <p>
              Ezsygram does not store raw credit/debit card numbers or UPI MPINs.
              All payment transactions are routed securely through RBI-authorized
              payment aggregators with PCI-DSS compliance.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

