"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  IndianRupee,
  Loader2,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/providers/ToastProvider";
import type { CustomerDTO, CustomerMetricsDTO } from "@/types";

interface CustomersManagerProps {
  initialCustomers: CustomerDTO[];
  initialMetrics: CustomerMetricsDTO;
  initialTotal: number;
  initialPage: number;
  initialTotalPages: number;
  creatorUsername: string;
}

export function CustomersManager({
  initialCustomers,
  initialMetrics,
  initialTotal,
  initialPage,
  initialTotalPages,
  creatorUsername,
}: CustomersManagerProps) {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<CustomerDTO[]>(initialCustomers);
  const [metrics, setMetrics] = useState<CustomerMetricsDTO>(initialMetrics);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  // Filters
  const [activeTab, setActiveTab] = useState<"all" | "buyer" | "lead">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "spend" | "orders">("latest");
  const [isPending, startTransition] = useTransition();
  const [isExporting, setIsExporting] = useState(false);

  const fetchFilteredData = (
    nextType = activeTab,
    nextSearch = searchTerm,
    nextSort = sortBy,
    nextPage = 1
  ) => {
    startTransition(async () => {
      try {
        const params = new URLSearchParams({
          type: nextType,
          sort: nextSort,
          page: String(nextPage),
          limit: "20",
        });
        if (nextSearch.trim()) {
          params.set("search", nextSearch.trim());
        }

        const res = await fetch(`/api/creator/customers?${params.toString()}`);
        const json = await res.json();
        if (json.success && json.data) {
          setCustomers(json.data.customers);
          setMetrics(json.data.metrics);
          setTotal(json.data.total);
          setPage(json.data.page);
          setTotalPages(json.data.totalPages);
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        toast.error("Error", "Failed to reload customer list. Please try again.");
      }
    });
  };

  const handleTabChange = (type: "all" | "buyer" | "lead") => {
    setActiveTab(type);
    fetchFilteredData(type, searchTerm, sortBy, 1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredData(activeTab, searchTerm, sortBy, 1);
  };

  const handleSortChange = (newSort: "latest" | "spend" | "orders") => {
    setSortBy(newSort);
    fetchFilteredData(activeTab, searchTerm, newSort, 1);
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const res = await fetch("/api/creator/customers/export");
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ezsygram-customers-${creatorUsername}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(
        "Export downloaded",
        "Your audience CSV export has downloaded successfully."
      );
    } catch (err) {
      toast.error(
        "Export failed",
        "Unable to generate audience CSV export."
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
              Customers &amp; Leads
            </h1>
            <Badge variant="brand" size="sm">Audience CRM</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted">
            Manage paying buyers, lead magnet subscribers, and export your audience data anytime.
          </p>
        </div>

        <Button
          onClick={handleExportCsv}
          disabled={isExporting || customers.length === 0}
          variant="outline"
          size="sm"
          className="self-start sm:self-auto min-h-[40px] font-semibold text-xs border-slate-border"
        >
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5 mr-1.5 text-brand-violet" />
          )}
          Export CSV ({total})
        </Button>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <Card className="p-4 sm:p-5 border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Total Audience
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-navy font-display">
            {metrics.totalAudience}
          </div>
          <div className="mt-1 text-[11px] text-slate-muted">
            <span>Deduplicated contacts</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Paying Buyers
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-navy font-display">
            {metrics.totalBuyers}
          </div>
          <div className="mt-1 text-[11px] text-slate-muted">
            <span>Paid checkout customers</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Captured Leads
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-navy font-display">
            {metrics.totalLeads}
          </div>
          <div className="mt-1 text-[11px] text-slate-muted">
            <span>Freebie &amp; WhatsApp opt-ins</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Avg Customer Spend
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-violet/10 text-brand-violet flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-navy font-display">
            ₹{metrics.averageCustomerValueInr.toLocaleString("en-IN")}
          </div>
          <div className="mt-1 text-[11px] text-slate-muted">
            <span>Total: ₹{metrics.totalRevenueInr.toLocaleString("en-IN")}</span>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Audience Segment Tabs */}
          <div className="flex items-center bg-canvas border border-slate-border p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => handleTabChange("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                activeTab === "all"
                  ? "bg-brand-violet text-white shadow-xs"
                  : "text-slate-muted hover:text-slate-text"
              }`}
            >
              All Contacts ({metrics.totalAudience})
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("buyer")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                activeTab === "buyer"
                  ? "bg-brand-violet text-white shadow-xs"
                  : "text-slate-muted hover:text-slate-text"
              }`}
            >
              Buyers ({metrics.totalBuyers})
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("lead")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                activeTab === "lead"
                  ? "bg-brand-violet text-white shadow-xs"
                  : "text-slate-muted hover:text-slate-text"
              }`}
            >
              Leads ({metrics.totalLeads})
            </button>
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20 min-h-[38px]"
              />
            </form>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as "latest" | "spend" | "orders")}
              className="text-xs rounded-xl border border-slate-border bg-canvas px-3 py-2 text-slate-text focus:outline-none min-h-[38px] font-medium"
            >
              <option value="latest">Latest Activity</option>
              <option value="spend">Highest Spend</option>
              <option value="orders">Most Orders</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Customer List / Table */}
      <Card className="border-slate-border overflow-hidden">
        {isPending ? (
          <div className="py-16 text-center text-xs text-slate-muted flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-violet mb-2" />
            Loading contacts...
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-canvas border border-slate-border flex items-center justify-center mx-auto mb-3 text-slate-muted">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-navy font-display mb-1">
              No contacts found
            </h3>
            <p className="text-xs text-slate-muted max-w-sm mx-auto mb-4">
              {searchTerm
                ? `No results matching "${searchTerm}". Try a different keyword.`
                : "Your customer and lead database will grow automatically when visitors buy your products or subscribe to lead magnets."}
            </p>
            <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
              <Link href={`/${creatorUsername}`} target="_blank">
                View Storefront
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-canvas border-b border-slate-border text-slate-muted uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Customer / Lead</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">WhatsApp / Phone</th>
                    <th className="py-3 px-4">Orders</th>
                    <th className="py-3 px-4">Total Spent</th>
                    <th className="py-3 px-4">Products / Source</th>
                    <th className="py-3 px-4 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-border">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-canvas/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-violet/10 text-brand-violet font-bold flex items-center justify-center text-xs">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-navy">{c.name}</div>
                            <div className="text-[11px] text-slate-muted">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={c.type === "buyer" ? "success" : "neutral"}
                          size="sm"
                        >
                          {c.type === "buyer" ? "Buyer" : "Lead"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        {c.phone ? (
                          <a
                            href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            <MessageCircle className="w-3.5 h-3.5 mr-1" />
                            {c.phone}
                          </a>
                        ) : (
                          <span className="text-slate-muted">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-navy">
                        {c.totalOrders}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-navy">
                        ₹{c.totalSpentInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">
                        {c.purchasedProductTitles.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {c.purchasedProductTitles.map((title) => (
                              <span
                                key={title}
                                className="px-2 py-0.5 rounded-md bg-canvas border border-slate-border text-[10px] text-slate-text font-medium truncate max-w-[150px]"
                              >
                                {title}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-muted text-[11px]">{c.source}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-muted text-[11px] whitespace-nowrap">
                        {new Date(c.firstSeenAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (360px - 430px Friendly) */}
            <div className="md:hidden divide-y divide-slate-border">
              {customers.map((c) => (
                <div key={c.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-violet/10 text-brand-violet font-bold flex items-center justify-center text-xs">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-navy">{c.name}</div>
                        <div className="text-[11px] text-slate-muted">{c.email}</div>
                      </div>
                    </div>
                    <Badge
                      variant={c.type === "buyer" ? "success" : "neutral"}
                      size="sm"
                    >
                      {c.type === "buyer" ? "Buyer" : "Lead"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="text-slate-muted">
                      {c.phone && (
                        <a
                          href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-emerald-600 font-medium"
                        >
                          <MessageCircle className="w-3.5 h-3.5 mr-1" />
                          {c.phone}
                        </a>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-navy">
                        ₹{c.totalSpentInr.toLocaleString("en-IN")}
                      </span>
                      <span className="text-slate-muted ml-1 text-[11px]">
                        ({c.totalOrders} {c.totalOrders === 1 ? "order" : "orders"})
                      </span>
                    </div>
                  </div>

                  {c.purchasedProductTitles.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {c.purchasedProductTitles.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded bg-canvas border border-slate-border text-[10px] text-slate-text"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-3 border-t border-slate-border flex items-center justify-between bg-canvas text-xs">
                <span className="text-slate-muted">
                  Showing page {page} of {totalPages} ({total} contacts)
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchFilteredData(activeTab, searchTerm, sortBy, page - 1)}
                    disabled={page <= 1 || isPending}
                    className="h-8 px-2 text-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchFilteredData(activeTab, searchTerm, sortBy, page + 1)}
                    disabled={page >= totalPages || isPending}
                    className="h-8 px-2 text-xs"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
