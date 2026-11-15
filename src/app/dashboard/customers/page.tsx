import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuthSession } from "@/lib/auth";
import { getCreatorProfileByUserId } from "@/services/creator.service";
import { getCreatorCustomers } from "@/services/customer.service";
import { CustomersManager } from "@/components/customers/CustomersManager";

export const metadata: Metadata = {
  title: "Customers & Leads | Ezsygram Creator Dashboard",
  description: "Audience CRM, buyers, captured leads, and CSV export.",
};

export const dynamic = "force-dynamic";

export default async function CustomersDashboardPage() {
  const session = await requireAuthSession();

  const profile = await getCreatorProfileByUserId(session.user.id);
  if (!profile) {
    redirect("/onboarding");
  }

  const { customers, metrics, total, page, totalPages } = await getCreatorCustomers(
    session.user.id,
    {
      type: "all",
      sort: "latest",
      page: 1,
      limit: 20,
    }
  );

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-6">
      <CustomersManager
        initialCustomers={customers}
        initialMetrics={metrics}
        initialTotal={total}
        initialPage={page}
        initialTotalPages={totalPages}
        creatorUsername={profile.username}
      />
    </div>
  );
}
