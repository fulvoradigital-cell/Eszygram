import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  Copy,
  Eye,
  ExternalLink,
  IndianRupee,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { getCreatorProfileByUserId } from "@/services/creator.service";
import { getAnalyticsReport } from "@/services/analytics.service";
import { getOrdersByCreatorId } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardOverviewClient } from "@/components/dashboard/DashboardOverviewClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  const profile = await getCreatorProfileByUserId(session.user.id);
  if (!profile) {
    redirect("/onboarding");
  }

  const username = profile.username;
  const displayName = profile.displayName || session.user.name || "Creator";

  const [analytics, { orders: recentOrders }] = await Promise.all([
    getAnalyticsReport(session.user.id, "30d"),
    getOrdersByCreatorId(session.user.id, { limit: 5 }),
  ]);

  const overview = analytics.overview;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner / Store Link Callout */}
      <DashboardOverviewClient
        username={username}
        displayName={displayName}
        plan={session.user.plan || "free"}
      />

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <Card className="p-4 sm:p-5 border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-navy font-display">
            ₹{overview.totalRevenueInr.toLocaleString("en-IN")}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-muted">
            {overview.revenueGrowth >= 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +{overview.revenueGrowth}%
              </span>
            ) : (
              <span className="text-rose-500 font-semibold inline-flex items-center">
                <ArrowDownRight className="w-3 h-3 mr-0.5" /> {overview.revenueGrowth}%
              </span>
            )}
            <span>vs last 30 days</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-violet/10 text-brand-violet flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-navy font-display">
            {overview.paidOrders}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-muted">
            {overview.ordersGrowth >= 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +{overview.ordersGrowth}%
              </span>
            ) : (
              <span className="text-rose-500 font-semibold inline-flex items-center">
                <ArrowDownRight className="w-3 h-3 mr-0.5" /> {overview.ordersGrowth}%
              </span>
            )}
            <span>paid checkouts</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Store Views
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-navy font-display">
            {overview.storeViews.toLocaleString("en-IN")}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-muted">
            <span className="text-slate-text font-semibold">
              {overview.uniqueVisitors}
            </span>
            <span>unique visitors</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Conversion Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-navy font-display">
            {overview.conversionRate.toFixed(1)}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-muted">
            <span className="text-slate-text font-semibold">
              {overview.blockClicks}
            </span>
            <span>link interactions</span>
          </div>
        </Card>
      </div>

      {/* Quick Launch Checklist / Shortcuts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-navy font-display">
            Creator Quick Actions
          </h2>
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href="/dashboard/analytics">View Deep Analytics</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-slate-border hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-navy font-display mb-1">
                1. Add your products
              </h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                Sell an eBook, video course, 1:1 consultation, template, or digital download.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-border">
              <Button asChild size="sm" variant="default" className="w-full bg-brand-violet hover:bg-brand-violet/90 text-white text-xs font-semibold">
                <Link href="/dashboard/products" className="inline-flex items-center justify-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>Create Product</span>
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="p-5 border-slate-border hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-navy font-display mb-1">
                2. Customize storefront
              </h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                Choose your brand colors, fonts, links, and preview how it looks on mobile.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-border">
              <Button asChild size="sm" variant="outline" className="w-full text-xs font-semibold">
                <Link href="/dashboard/store" className="inline-flex items-center justify-center gap-1.5">
                  <span>Customize Store</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="p-5 border-slate-border hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-navy font-display mb-1">
                3. Automate Instagram
              </h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                Automatically send buy links when followers comment keywords on your reels.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-border">
              <Button asChild size="sm" variant="outline" className="w-full text-xs font-semibold">
                <Link href="/dashboard/automations" className="inline-flex items-center justify-center gap-1.5">
                  <span>Set Up Trigger</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Orders / Activity Section */}
      <Card className="p-6 border-slate-border">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-border">
          <div>
            <h2 className="text-base font-bold text-navy font-display">Recent Orders</h2>
            <p className="text-xs text-slate-muted">Track customer purchases and instant UPI settlements</p>
          </div>
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href="/dashboard/orders">View all orders</Link>
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-2xl bg-canvas border border-slate-border flex items-center justify-center mx-auto mb-3 text-slate-muted">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-navy font-display mb-1">
              No sales yet
            </h3>
            <p className="text-xs text-slate-muted max-w-sm mx-auto mb-4">
              Once you share your store link in your Instagram bio or post captions, your orders will appear here automatically.
            </p>
            <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
              <Link href={`/${username}`} target="_blank">
                Preview Store
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas border-b border-slate-border text-slate-muted uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-border">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-canvas/50">
                    <td className="py-3 px-3 font-mono text-[11px] font-semibold text-slate-muted">
                      #{ord.invoiceNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-navy">{ord.buyerName}</div>
                      <div className="text-[11px] text-slate-muted">{ord.buyerEmail}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-navy max-w-xs truncate">
                      {ord.productTitle}
                    </td>
                    <td className="py-3 px-3 font-bold text-navy">
                      ₹{ord.amountInr.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={ord.status === "paid" ? "success" : "neutral"}
                        size="sm"
                      >
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-muted text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
