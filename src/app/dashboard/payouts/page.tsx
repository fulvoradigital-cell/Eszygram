import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuthSession } from "@/lib/auth";
import { getCreatorProfileByUserId } from "@/services/creator.service";
import {
  getPayoutAccountByCreatorId,
  getPayoutSummary,
  getPayoutsByCreatorId,
} from "@/services/payout.service";
import { PayoutsManager } from "@/components/payouts/PayoutsManager";

export const metadata: Metadata = {
  title: "Payouts & Bank Settlements | Ezsygram Creator Dashboard",
  description: "Configure your Indian bank account or UPI VPA for daily automated payouts.",
};

export const dynamic = "force-dynamic";

export default async function PayoutsDashboardPage() {
  const session = await requireAuthSession();

  const profile = await getCreatorProfileByUserId(session.user.id);
  if (!profile) {
    redirect("/onboarding");
  }

  const [account, summary, payouts] = await Promise.all([
    getPayoutAccountByCreatorId(session.user.id),
    getPayoutSummary(session.user.id),
    getPayoutsByCreatorId(session.user.id, 50),
  ]);

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-6">
      <PayoutsManager
        initialAccount={account}
        initialSummary={summary}
        initialPayouts={payouts}
        creatorUsername={profile.username}
      />
    </div>
  );
}
