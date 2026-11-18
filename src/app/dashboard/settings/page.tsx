import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import {
  getCreatorProfileByUserId,
  toCreatorProfileDTO,
} from "@/services/creator.service";
import { findUserById } from "@/services/user.service";
import { SettingsManager } from "@/components/settings/SettingsManager";

export const metadata: Metadata = {
  title: "Settings & Profile | Ezsygram Creator Dashboard",
  description: "Manage your creator profile, bio links, credentials, and plan subscription.",
};

export const dynamic = "force-dynamic";

interface SettingsPageProps {
  searchParams?: { tab?: string };
}

export default async function SettingsDashboardPage({ searchParams }: SettingsPageProps) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/settings");
  }

  const [profile, freshUser] = await Promise.all([
    getCreatorProfileByUserId(session.user.id),
    findUserById(session.user.id),
  ]);

  if (!profile) {
    redirect("/onboarding");
  }

  const profileDTO = toCreatorProfileDTO(profile);
  const initialTab =
    searchParams?.tab === "billing" || searchParams?.tab === "security"
      ? searchParams.tab
      : "profile";

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-6">
      <SettingsManager
        initialProfile={profileDTO}
        userEmail={freshUser?.email || session.user.email || ""}
        userPlan={freshUser?.plan || session.user.plan || "free"}
        planExpiresAt={freshUser?.planExpiresAt || null}
        initialTab={initialTab}
      />
    </div>
  );
}
