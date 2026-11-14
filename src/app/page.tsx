import React from "react";
import { CookieConsent } from "@/components/marketing/CookieConsent";
import { CtaBand } from "@/components/marketing/CtaBand";
import { EarningsCalculator } from "@/components/marketing/EarningsCalculator";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { FeatureBentoGrid } from "@/components/marketing/FeatureBentoGrid";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { InstagramSpotlight } from "@/components/marketing/InstagramSpotlight";
import { Navbar } from "@/components/marketing/Navbar";
import { PricingSection } from "@/components/marketing/PricingSection";
import { SocialProofStrip } from "@/components/marketing/SocialProofStrip";
import { TestimonialsCarousel } from "@/components/marketing/TestimonialsCarousel";
import { UseCaseTabs } from "@/components/marketing/UseCaseTabs";
import { JsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas-light text-slate-900 antialiased dark:bg-canvas-dark dark:text-slate-100 flex flex-col">
      <JsonLd />
      {/* 1. Sticky Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero with floating phone mockup & cards */}
        <Hero />

        {/* 3. Social proof strip with niches & counters */}
        <SocialProofStrip />

        {/* 4. Feature bento grid (9 capabilities) */}
        <FeatureBentoGrid />

        {/* 5. How it works (3 steps) */}
        <HowItWorks />

        {/* 6. Instagram automation spotlight with live chat simulation */}
        <InstagramSpotlight />

        {/* 7. Use-case tabs for Indian creators */}
        <UseCaseTabs />

        {/* 8. Interactive earnings calculator */}
        <EarningsCalculator />

        {/* 9. Pricing cards with monthly/yearly toggle */}
        <PricingSection />

        {/* 10. Testimonials carousel */}
        <TestimonialsCarousel />

        {/* 11. FAQ accordion (10 questions) */}
        <FaqAccordion />

        {/* 12. Final bold CTA band */}
        <CtaBand />
      </main>

      {/* 13. Footer */}
      <Footer />

      {/* Global Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}
