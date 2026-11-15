"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  Download,
  ExternalLink,
  Eye,
  FileDown,
  GraduationCap,
  Loader2,
  LogOut,
  Package,
  RefreshCw,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/providers/ToastProvider";
import type { BuyerPurchaseDTO } from "@/types";

interface PurchasesClientProps {
  initialPurchases: BuyerPurchaseDTO[];
  buyerEmail: string;
}

export function PurchasesClient({
  initialPurchases,
  buyerEmail,
}: PurchasesClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [purchases, setPurchases] = useState<BuyerPurchaseDTO[]>(initialPurchases);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedInvoice, setCopiedInvoice] = useState<string | null>(null);
  const [regeneratingOrderId, setRegeneratingOrderId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Filtered purchases
  const filteredPurchases = useMemo(() => {
    return purchases.filter((item) => {
      const matchesType =
        activeFilter === "all" || item.productType === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        item.productTitle.toLowerCase().includes(q) ||
        item.creatorDisplayName.toLowerCase().includes(q) ||
        item.invoiceNumber.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [purchases, activeFilter, searchQuery]);

  // Logout
  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/buyer/logout", { method: "POST" });
      toast.success("Logged Out", "You have been signed out of your library.");
      router.push("/purchases/login");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  }

  // Copy invoice number
  function copyInvoice(inv: string) {
    navigator.clipboard.writeText(inv);
    setCopiedInvoice(inv);
    toast.success("Copied", `Invoice #${inv} copied to clipboard.`);
    setTimeout(() => setCopiedInvoice(null), 2000);
  }

  // Regenerate expired download tokens
  async function handleRegenerateDownload(orderId: string) {
    setRegeneratingOrderId(orderId);
    try {
      const res = await fetch("/api/buyer/regenerate-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to refresh download links.");
      }

      // Update local state with fresh tokens
      const newTokens = json.data.tokens;
      setPurchases((prev) =>
        prev.map((p) => {
          if (p.orderId === orderId) {
            return {
              ...p,
              downloadTokens: newTokens.map((t: { token: string; fileName: string; expiresAt: string }) => ({
                token: t.token,
                fileName: t.fileName,
                downloadCount: 0,
                maxDownloads: 5,
                expiresAt: t.expiresAt,
                isExpired: false,
              })),
            };
          }
          return p;
        })
      );

      toast.success("Links Refreshed!", "Your download link has been renewed for 24 hours.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error refreshing links.";
      toast.error("Error", msg);
    } finally {
      setRegeneratingOrderId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-card border border-slate-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-navy font-display">
              My Purchases &amp; Library
            </h1>
            <p className="text-xs text-slate-muted">{buyerEmail}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={isLoggingOut}
          onClick={handleLogout}
          className="gap-1.5 text-xs text-slate-text"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Type Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-slate-border overflow-x-auto">
          {[
            { id: "all", label: "All Items", count: purchases.length },
            {
              id: "download",
              label: "Downloads",
              count: purchases.filter((p) => p.productType === "download").length,
            },
            {
              id: "course",
              label: "Courses",
              count: purchases.filter((p) => p.productType === "course").length,
            },
            {
              id: "booking",
              label: "1:1 Sessions",
              count: purchases.filter((p) => p.productType === "booking").length,
            },
            {
              id: "membership",
              label: "Memberships",
              count: purchases.filter((p) => p.productType === "membership").length,
            },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? "bg-brand-violet text-white shadow-xs"
                    : "text-slate-muted hover:text-slate-text"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-border/50 text-slate-muted"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search products or creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-card border border-slate-border focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet text-slate-text"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-muted hover:text-slate-text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Purchases List */}
      {filteredPurchases.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center border-slate-border">
          <div className="w-14 h-14 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mx-auto mb-4">
            <Package className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-navy font-display mb-1">
            {purchases.length === 0
              ? "No Purchases Found"
              : "No Matching Items Found"}
          </h2>
          <p className="text-xs text-slate-muted max-w-sm mx-auto mb-4">
            {purchases.length === 0
              ? "Any products, courses, or bookings you purchase on Ezsygram will automatically appear in your library."
              : "Try adjusting your search query or filter."}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/">Explore Creators</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPurchases.map((purchase) => {
            const dateStr = new Date(purchase.purchaseDate).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            );

            return (
              <Card
                key={purchase.orderId}
                className="p-5 sm:p-6 border border-slate-border bg-card shadow-xs transition-all hover:border-brand-violet/30"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  {/* Left: Cover & Info */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-subtle border border-slate-border shrink-0 flex items-center justify-center">
                      {purchase.productCoverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={purchase.productCoverImage}
                          alt={purchase.productTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-slate-muted">
                          {purchase.productType === "download" && (
                            <FileDown className="w-7 h-7 text-brand-violet/70" />
                          )}
                          {purchase.productType === "course" && (
                            <GraduationCap className="w-7 h-7 text-indigo-500/70" />
                          )}
                          {purchase.productType === "booking" && (
                            <Calendar className="w-7 h-7 text-emerald-500/70" />
                          )}
                          {purchase.productType === "membership" && (
                            <Crown className="w-7 h-7 text-amber-500/70" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="capitalize text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-subtle border border-slate-border text-slate-text">
                          {purchase.productType}
                        </span>

                        <span className="text-xs text-slate-muted">•</span>
                        <span className="text-xs text-slate-muted">{dateStr}</span>

                        <span className="text-xs text-slate-muted">•</span>
                        <button
                          type="button"
                          onClick={() => copyInvoice(purchase.invoiceNumber)}
                          className="font-mono text-[11px] text-slate-muted hover:text-navy flex items-center gap-1"
                          title="Click to copy invoice"
                        >
                          <span>#{purchase.invoiceNumber}</span>
                          {copiedInvoice === purchase.invoiceNumber ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-navy truncate font-display">
                        {purchase.productTitle}
                      </h3>

                      {/* Creator Attribution */}
                      <div className="flex items-center gap-2 text-xs text-slate-muted">
                        <Avatar
                          name={purchase.creatorDisplayName}
                          alt={purchase.creatorDisplayName}
                          src={purchase.creatorAvatarUrl}
                          size="xs"
                        />
                        <Link
                          href={`/${purchase.creatorUsername}`}
                          className="hover:text-brand-violet hover:underline truncate"
                        >
                          {purchase.creatorDisplayName}
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions by product type */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-border/50">
                    {/* 1. DOWNLOAD ACTIONS */}
                    {purchase.productType === "download" && (
                      <div className="space-y-1.5 w-full sm:w-auto">
                        {purchase.downloadTokens.map((tokenObj) => (
                          <div
                            key={tokenObj.token}
                            className="flex items-center gap-2"
                          >
                            {tokenObj.isExpired ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={regeneratingOrderId === purchase.orderId}
                                onClick={() =>
                                  handleRegenerateDownload(purchase.orderId)
                                }
                                className="w-full sm:w-auto gap-1.5 text-xs text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                              >
                                {regeneratingOrderId === purchase.orderId ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-3.5 h-3.5" />
                                )}
                                <span>Renew Download Link</span>
                              </Button>
                            ) : (
                              <Button
                                asChild
                                variant="gradient"
                                size="sm"
                                className="w-full sm:w-auto gap-1.5 text-xs font-bold shadow-xs"
                              >
                                <a
                                  href={`/api/downloads/${tokenObj.token}`}
                                  download={tokenObj.fileName}
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download {tokenObj.fileName}</span>
                                </a>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 2. COURSE ACTION */}
                    {purchase.productType === "course" && (
                      <Button
                        asChild
                        variant="gradient"
                        size="sm"
                        className="w-full sm:w-auto gap-1.5 text-xs font-bold shadow-xs"
                      >
                        <Link href={`/courses/${purchase.productId}`}>
                          <GraduationCap className="w-4 h-4" />
                          <span>Open Course Player</span>
                        </Link>
                      </Button>
                    )}

                    {/* 3. BOOKING ACTION */}
                    {purchase.productType === "booking" && (
                      <div className="flex items-center gap-2">
                        {purchase.bookingConfig?.calendarUrl ? (
                          <Button
                            asChild
                            variant="gradient"
                            size="sm"
                            className="w-full sm:w-auto gap-1.5 text-xs font-bold shadow-xs"
                          >
                            <a
                              href={purchase.bookingConfig.calendarUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Book / Reschedule Slot</span>
                            </a>
                          </Button>
                        ) : (
                          <Badge variant="outline" size="sm">
                            {purchase.bookingConfig?.durationMinutes || 30} min session
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* 4. MEMBERSHIP ACTION */}
                    {purchase.productType === "membership" && (
                      <Badge variant="brand" size="md" className="capitalize">
                        Active {purchase.membershipConfig?.interval || "Monthly"} Tier
                      </Badge>
                    )}

                    {/* View Invoice */}
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      title="View Receipt"
                      className="text-xs text-slate-muted hover:text-navy"
                    >
                      <Link href={`/orders/${purchase.orderId}`}>
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Receipt</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
