import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getCreatorProfileByUserId } from "@/services/creator.service";
import { getOrderMetrics, getOrdersByCreatorId } from "@/services/order.service";
import { OrdersList } from "@/components/orders/OrdersList";

export const metadata: Metadata = {
  title: "Orders & Sales | Ezsygram Creator Dashboard",
  description: "Track customer checkouts, Razorpay UPI orders, and automated invoices.",
};

export const dynamic = "force-dynamic";

export default async function OrdersDashboardPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/orders");
  }

  const profile = await getCreatorProfileByUserId(session.user.id);
  if (!profile) {
    redirect("/onboarding");
  }

  const [{ orders }, metrics] = await Promise.all([
    getOrdersByCreatorId(session.user.id),
    getOrderMetrics(session.user.id),
  ]);

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
          Orders &amp; Sales
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
          View buyer purchases, UPI &amp; card transaction receipts, and net earnings.
        </p>
      </div>

      <OrdersList initialOrders={orders} metrics={metrics} />
    </div>
  );
}
