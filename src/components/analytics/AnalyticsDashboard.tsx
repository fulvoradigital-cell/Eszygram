"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Eye,
  Filter,
  IndianRupee,
  Layers,
  Loader2,
  MousePointer,
  Package,
  PieChart as PieIcon,
  RefreshCw,
  ShoppingBag,
  Smartphone,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  AnalyticsOverviewMetrics,
  AnalyticsReportDTO,
  AnalyticsTimeRange,
  ConversionFunnelStage,
  DeviceStat,
  ReferrerStat,
  TimeSeriesPoint,
  TopProductStat,
} from "@/types";

interface AnalyticsDashboardProps {
  initialReport: AnalyticsReportDTO;
  username: string;
}

const TIME_RANGES: { id: AnalyticsTimeRange; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "90d", label: "Last 90 Days" },
  { id: "all", label: "All Time" },
];

const PIE_COLORS = ["#6D28D9", "#FF7A59", "#10B981", "#3B82F6", "#F59E0B"];

export function AnalyticsDashboard({
  initialReport,
  username,
}: AnalyticsDashboardProps) {
  const [report, setReport] = useState<AnalyticsReportDTO>(initialReport);
  const [currentRange, setCurrentRange] = useState<AnalyticsTimeRange>(initialReport.timeRange);
  const [isPending, startTransition] = useTransition();

  const handleRangeChange = async (range: AnalyticsTimeRange) => {
    if (range === currentRange) return;
    setCurrentRange(range);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/creator/analytics?range=${range}`);
        const json = await res.json();
        if (json.success && json.data) {
          setReport(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics range:", err);
      }
    });
  };

  const overview = report.overview;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Time Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
              Analytics &amp; Performance
            </h1>
            <Badge variant="brand" size="sm">Real-time</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted">
            Track visitors, link clicks, conversion rates, and revenue across your storefront.
          </p>
        </div>

        {/* Time Range Pills */}
        <div className="flex items-center bg-card border border-slate-border p-1 rounded-xl shadow-xs overflow-x-auto">
          {TIME_RANGES.map((r) => {
            const isActive = currentRange === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRangeChange(r.id)}
                disabled={isPending}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap min-h-[36px] flex items-center ${
                  isActive
                    ? "bg-brand-violet text-white shadow-xs"
                    : "text-slate-muted hover:text-slate-text hover:bg-canvas"
                }`}
              >
                {isActive && isPending && (
                  <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                )}
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total Revenue */}
        <Card className="p-4 sm:p-5 border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Gross Revenue
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
                <ArrowUpRight className="w-3 h-3 mr-0.5" />+{overview.revenueGrowth}%
              </span>
            ) : (
              <span className="text-rose-500 font-semibold inline-flex items-center">
                <ArrowDownRight className="w-3 h-3 mr-0.5" />{overview.revenueGrowth}%
              </span>
            )}
            <span>vs previous period</span>
          </div>
        </Card>

        {/* Paid Orders */}
        <Card className="p-4 sm:p-5 border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Paid Orders
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
                <ArrowUpRight className="w-3 h-3 mr-0.5" />+{overview.ordersGrowth}%
              </span>
            ) : (
              <span className="text-rose-500 font-semibold inline-flex items-center">
                <ArrowDownRight className="w-3 h-3 mr-0.5" />{overview.ordersGrowth}%
              </span>
            )}
            <span>avg ₹{overview.avgOrderValueInr}</span>
          </div>
        </Card>

        {/* Store Views */}
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

        {/* Conversion Rate */}
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
            <span>link / product clicks</span>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Orders Trend Chart */}
        <Card className="p-5 sm:p-6 border-slate-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-navy font-display flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-violet" />
                Revenue &amp; Orders Trend
              </h2>
              <p className="text-xs text-slate-muted mt-0.5">
                Daily earnings and paid checkout volume
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            {report.timeSeries.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-muted">
                No orders recorded during this timeframe
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={report.timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6D28D9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    formatter={(val: number, name: string) => [
                      name === "revenueInr" ? `₹${val.toLocaleString("en-IN")}` : val,
                      name === "revenueInr" ? "Revenue" : "Paid Orders",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenueInr"
                    stroke="#6D28D9"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                    name="revenueInr"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Storefront Traffic: Views vs Clicks */}
        <Card className="p-5 sm:p-6 border-slate-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-navy font-display flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-sky-500" />
                Storefront Traffic (Views vs Clicks)
              </h2>
              <p className="text-xs text-slate-muted mt-0.5">
                Visitor engagement and link interactions
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            {report.timeSeries.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-muted">
                No visitor traffic recorded yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    formatter={(val: number, name: string) => [
                      val,
                      name === "views" ? "Store Views" : "Link Clicks",
                    ]}
                  />
                  <Bar dataKey="views" fill="#38BDF8" radius={[4, 4, 0, 0]} name="views" />
                  <Bar dataKey="clicks" fill="#6D28D9" radius={[4, 4, 0, 0]} name="clicks" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Conversion Funnel Section */}
      <Card className="p-5 sm:p-6 border-slate-border">
        <div className="mb-6">
          <h2 className="text-base font-bold text-navy font-display flex items-center gap-2">
            <Layers className="w-4 h-4 text-coral" />
            Conversion Funnel
          </h2>
          <p className="text-xs text-slate-muted mt-0.5">
            How audience members navigate from link click in Instagram bio to completed checkout
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {report.funnel.map((stage, idx) => (
            <div
              key={stage.stage}
              className="p-4 rounded-xl bg-canvas border border-slate-border flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-muted mb-2 font-semibold">
                  <span>Step {idx + 1}</span>
                  <Badge variant="neutral" size="sm">{stage.percentage}%</Badge>
                </div>
                <div className="text-sm font-bold text-navy font-display">
                  {stage.stage}
                </div>
                <div className="text-2xl font-extrabold text-navy mt-1">
                  {stage.count.toLocaleString("en-IN")}
                </div>
              </div>

              {idx > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-border/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-muted">Drop-off:</span>
                  <span className="font-semibold text-rose-500">
                    {stage.dropoffRate}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* 3-Column Breakdown: Referrers, Top Products & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Referrers */}
        <Card className="p-5 border-slate-border flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-navy font-display mb-1 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-brand-violet" />
              Traffic Sources
            </h2>
            <p className="text-xs text-slate-muted mb-4">
              Where your storefront visitors come from
            </p>

            {report.referrers.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-muted">
                No referral traffic recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {report.referrers.map((ref) => (
                  <div key={ref.source} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-navy">{ref.source}</span>
                      <span className="text-slate-muted">
                        {ref.count} ({ref.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-brand-violet rounded-full transition-all"
                        style={{ width: `${Math.min(ref.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-5 border-slate-border flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-navy font-display mb-1 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Top Selling Products
            </h2>
            <p className="text-xs text-slate-muted mb-4">
              Best-performing digital products &amp; courses
            </p>

            {report.topProducts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-muted">
                No product purchases recorded yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {report.topProducts.map((prod, i) => (
                  <div
                    key={prod.productId}
                    className="p-2.5 rounded-lg bg-canvas border border-slate-border flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-navy truncate">
                        {i + 1}. {prod.title}
                      </div>
                      <div className="text-[11px] text-slate-muted">
                        {prod.salesCount} {prod.salesCount === 1 ? "sale" : "sales"}
                      </div>
                    </div>
                    <div className="text-xs font-extrabold text-navy whitespace-nowrap">
                      ₹{prod.revenueInr.toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Device Split */}
        <Card className="p-5 border-slate-border flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-navy font-display mb-1 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-pink-500" />
              Device Breakdown
            </h2>
            <p className="text-xs text-slate-muted mb-4">
              Instagram in-app browser vs desktop readers
            </p>

            {report.devices.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-muted">
                No device signals recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {report.devices.map((dev, idx) => (
                  <div key={dev.device} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-navy">{dev.device}</span>
                      <span className="text-slate-muted">
                        {dev.count} ({dev.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(dev.percentage, 100)}%`,
                          backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
