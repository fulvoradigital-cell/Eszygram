import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuthSession } from "@/lib/auth";
import { getCreatorProfileByUserId } from "@/services/creator.service";
import { getAnalyticsReport } from "@/services/analytics.service";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics & Performance | Ezsygram Creator Dashboard",
  description: "Track storefront traffic, conversion funnel, referrers, and net revenue.",
};

export const dynamic = "force-dynamic";

export default async function AnalyticsDashboardPage() {
  const session = await requireAuthSession();

  const profile = await getCreatorProfileByUserId(session.user.id);
  if (!profile) {
    redirect("/onboarding");
  }

  const report = await getAnalyticsReport(session.user.id, "30d");

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-6">
      <AnalyticsDashboard
        initialReport={report}
        username={profile.username}
      />
    </div>
  );
}
