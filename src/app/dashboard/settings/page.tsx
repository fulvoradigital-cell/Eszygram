import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import {
  getCreatorProfileByUserId,
  toCreatorProfileDTO,
} from "@/services/creator.service";
import { SettingsManager } from "@/components/settings/SettingsManager";

export const metadata: Metadata = {
  title: "Settings & Profile | Ezsygram Creator Dashboard",
  description: "Manage your creator profile, bio links, credentials, and plan subscription.",
};

export const dynamic = "force-dynamic";

export default async function SettingsDashboardPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/settings");
  }

  const profile = await getCreatorProfileByUserId(session.user.id);
  if (!profile) {
    redirect("/onboarding");
  }

  const profileDTO = toCreatorProfileDTO(profile);

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-6">
      <SettingsManager
        initialProfile={profileDTO}
        userEmail={session.user.email || ""}
        userPlan={session.user.plan || "free"}
      />
    </div>
  );
}
