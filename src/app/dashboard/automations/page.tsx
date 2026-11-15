import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuthSession } from "@/lib/auth";
import { getCreatorProfileByUserId } from "@/services/creator.service";
import {
  getAutomationLogs,
  getAutomationRulesByCreatorId,
} from "@/services/automation.service";
import { getProductsByCreatorId } from "@/services/product.service";
import { AutomationsManager } from "@/components/automations/AutomationsManager";

export const metadata: Metadata = {
  title: "Instagram Automation | Ezsygram Creator Dashboard",
  description:
    "Auto-reply to Instagram post comments and instantly DM product buy links, lead magnets, and coupons.",
};

export const dynamic = "force-dynamic";

export default async function AutomationsDashboardPage() {
  const session = await requireAuthSession();

  const profile = await getCreatorProfileByUserId(session.user.id);
  if (!profile) {
    redirect("/onboarding");
  }

  const [rules, logs, products] = await Promise.all([
    getAutomationRulesByCreatorId(session.user.id),
    getAutomationLogs(session.user.id, 50),
    getProductsByCreatorId(session.user.id),
  ]);

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-6">
      <AutomationsManager
        initialRules={rules}
        initialLogs={logs}
        products={products}
        creatorDisplayName={profile.displayName || profile.username}
        username={profile.username}
        avatarUrl={profile.avatarUrl}
      />
    </div>
  );
}
