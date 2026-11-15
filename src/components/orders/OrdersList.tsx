"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Download,
  Eye,
  FileDown,
  FileSpreadsheet,
  GraduationCap,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/providers/ToastProvider";
import type { OrderDTO, OrderMetricsDTO, OrderStatus } from "@/types";

interface OrdersListProps {
  initialOrders: OrderDTO[];
  metrics: OrderMetricsDTO;
}

export function OrdersList({ initialOrders, metrics }: OrdersListProps) {
  const { toast } = useToast();
  const [orders] = useState<OrderDTO[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [copiedInvoice, setCopiedInvoice] = useState<string | null>(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        order.invoiceNumber.toLowerCase().includes(q) ||
        order.buyerName.toLowerCase().includes(q) ||
        order.buyerEmail.toLowerCase().includes(q) ||
        order.productTitle.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  function copyInvoice(inv: string) {
    navigator.clipboard.writeText(inv);
    setCopiedInvoice(inv);
    toast.success("Copied", `Invoice #${inv} copied to clipboard.`);
    setTimeout(() => setCopiedInvoice(null), 2000);
  }

  // Export to CSV
  function exportToCsv() {
    if (filteredOrders.length === 0) {
      toast.error("No Orders", "No orders available to export.");
      return;
    }

    const headers = [
      "Invoice Number",
      "Date",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Product",
      "Type",
      "Gross Amount (INR)",
      "Creator Earnings (INR)",
      "Platform Fee (INR)",
      "Discount (INR)",
      "Status",
      "Payment Method",
      "Payment ID",
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.invoiceNumber}"`,
      `"${new Date(o.createdAt).toLocaleDateString("en-IN")}"`,
      `"${o.buyerName.replace(/"/g, '""')}"`,
      `"${o.buyerEmail}"`,
      `"${o.buyerPhone}"`,
      `"${o.productTitle.replace(/"/g, '""')}"`,
      `"${o.productType}"`,
      o.amountInr,
      Math.round(o.creatorEarningsPaise / 100),
      Math.round(o.platformFeePaise / 100),
      Math.round(o.discountAmountPaise / 100),
      `"${o.status}"`,
      `"${o.paymentMethod}"`,
      `"${o.razorpayPaymentId || "N/A"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ezsygram_Orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV Exported", "Your orders export has downloaded.");
  }

  function getStatusBadge(status: OrderStatus) {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/50">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/50">
            <XCircle className="w-3 h-3 text-red-600" />
            Failed
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Refunded
          </span>
        );
    }
  }

  return (
    <div className="space-y-6">
      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="p-4 border-slate-border bg-card">
          <p className="text-xs font-medium text-slate-muted">Gross Volume</p>
          <p className="text-2xl font-extrabold text-navy font-display mt-0.5">
            ₹{metrics.totalGrossInr}
          </p>
          <p className="text-[11px] text-slate-muted mt-1">
            Total buyer payments
          </p>
        </Card>

        <Card className="p-4 border-slate-border bg-card">
          <p className="text-xs font-medium text-slate-muted">Net Creator Earnings</p>
          <p className="text-2xl font-extrabold text-emerald-600 font-display mt-0.5">
            ₹{metrics.totalNetEarningsInr}
          </p>
          <p className="text-[11px] text-slate-muted mt-1">
            Your earnings after fee
          </p>
        </Card>

        <Card className="p-4 border-slate-border bg-card">
          <p className="text-xs font-medium text-slate-muted">Platform Fee</p>
          <p className="text-2xl font-extrabold text-navy font-display mt-0.5">
            ₹{metrics.totalPlatformFeeInr}
          </p>
          <p className="text-[11px] text-slate-muted mt-1">
            Platform infrastructure
          </p>
        </Card>

        <Card className="p-4 border-slate-border bg-card">
          <p className="text-xs font-medium text-slate-muted">Paid Orders</p>
          <p className="text-2xl font-extrabold text-brand-violet font-display mt-0.5">
            {metrics.paidOrdersCount}
          </p>
          <p className="text-[11px] text-slate-muted mt-1">
            of {metrics.totalOrdersCount} total checkouts
          </p>
        </Card>
      </div>

      {/* Filter Tabs, Search & Export Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-slate-border overflow-x-auto">
          {[
            { id: "all", label: "All Orders" },
            { id: "paid", label: "Paid" },
            { id: "pending", label: "Pending" },
            { id: "refunded", label: "Refunded" },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-brand-violet text-white shadow-xs"
                    : "text-slate-muted hover:text-slate-text"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & CSV button */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by buyer, invoice..."
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

          <Button
            variant="outline"
            size="sm"
            onClick={exportToCsv}
            className="gap-1.5 text-xs shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center border-slate-border">
          <div className="w-14 h-14 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-navy font-display mb-1">
            {orders.length === 0 ? "No Orders Yet" : "No Matching Orders Found"}
          </h2>
          <p className="text-xs text-slate-muted max-w-sm mx-auto mb-4">
            {orders.length === 0
              ? "Share your storefront link to start receiving customer orders and instant UPI payments."
              : "Try adjusting your search query or status filter."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            );

            return (
              <Card
                key={order.id}
                className="p-4 sm:p-5 border border-slate-border bg-card transition-all hover:border-brand-violet/40 hover:shadow-xs"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left: Invoice, Date, Customer & Product */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyInvoice(order.invoiceNumber)}
                        className="font-mono text-xs font-bold text-navy hover:text-brand-violet flex items-center gap-1"
                        title="Click to copy invoice number"
                      >
                        <span>#{order.invoiceNumber}</span>
                        {copiedInvoice === order.invoiceNumber ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-muted" />
                        )}
                      </button>

                      <span className="text-xs text-slate-muted">•</span>
                      <span className="text-xs text-slate-muted">{dateStr}</span>
                      <span className="text-xs text-slate-muted">•</span>
                      {getStatusBadge(order.status)}

                      {order.orderBumpIncluded && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-coral/10 text-coral border border-coral/20">
                          <Sparkles className="w-2.5 h-2.5" />
                          Order Bump
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 pt-1">
                      <p className="text-sm font-bold text-navy truncate font-display">
                        {order.productTitle}
                      </p>
                      <span className="hidden sm:inline text-slate-border">•</span>
                      <p className="text-xs text-slate-muted truncate">
                        {order.buyerName}{" "}
                        <span className="text-slate-muted/70">
                          ({order.buyerEmail})
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Middle: Price & Net Earnings */}
                  <div className="flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-border/50">
                    <div className="text-left sm:text-right">
                      <span className="text-base font-extrabold text-navy font-display">
                        {order.amountInr === 0 ? "FREE" : `₹${order.amountInr}`}
                      </span>
                      {order.amountInr > 0 && (
                        <p className="text-[10px] text-emerald-600 font-semibold">
                          Net: ₹{Math.round(order.creatorEarningsPaise / 100)}
                        </p>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-muted uppercase font-mono">
                      {order.paymentMethod}
                    </span>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-end w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="gap-1.5 text-xs h-8"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          open={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.invoiceNumber}`}
          size="md"
        >
          <div className="space-y-4 pt-1">
            {/* Header Status */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-subtle/50 border border-slate-border">
              <div>
                <p className="text-xs font-semibold text-slate-muted">
                  Order Status
                </p>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold text-slate-muted">Total Paid</p>
                <p className="text-base font-extrabold text-navy font-display mt-0.5">
                  {selectedOrder.amountInr === 0
                    ? "FREE"
                    : `₹${selectedOrder.amountInr}`}
                </p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-2xl border border-slate-border bg-card space-y-2 text-xs">
              <h4 className="font-bold text-navy uppercase tracking-wider text-[11px] font-display">
                Buyer Information
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-text">
                <div>
                  <span className="text-slate-muted">Name:</span>
                  <p className="font-semibold text-navy">{selectedOrder.buyerName}</p>
                </div>
                <div>
                  <span className="text-slate-muted">Email:</span>
                  <p className="font-semibold text-navy truncate">
                    {selectedOrder.buyerEmail}
                  </p>
                </div>
                <div>
                  <span className="text-slate-muted">Phone:</span>
                  <p className="font-semibold text-navy">
                    +91 {selectedOrder.buyerPhone}
                  </p>
                </div>
                <div>
                  <span className="text-slate-muted">Payment ID:</span>
                  <p className="font-mono text-[11px] text-slate-muted truncate">
                    {selectedOrder.razorpayPaymentId || "FREE_CHECKOUT"}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="p-4 rounded-2xl border border-slate-border bg-card space-y-2 text-xs">
              <h4 className="font-bold text-navy uppercase tracking-wider text-[11px] font-display">
                Financial Breakdown
              </h4>
              <div className="space-y-1.5 text-slate-muted">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span className="font-medium text-navy">
                    ₹{Math.round(selectedOrder.basePricePaise / 100)}
                  </span>
                </div>
                {selectedOrder.orderBumpIncluded && (
                  <div className="flex justify-between text-coral">
                    <span>Order Bump Add-On</span>
                    <span>+₹{Math.round(selectedOrder.orderBumpPricePaise / 100)}</span>
                  </div>
                )}
                {selectedOrder.discountAmountPaise > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon ({selectedOrder.couponCode})</span>
                    <span>-₹{Math.round(selectedOrder.discountAmountPaise / 100)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>-₹{Math.round(selectedOrder.platformFeePaise / 100)}</span>
                </div>
                <div className="border-t border-slate-border pt-1.5 flex justify-between font-bold text-navy">
                  <span>Your Net Earnings</span>
                  <span className="text-emerald-600 font-extrabold text-sm">
                    ₹{Math.round(selectedOrder.creatorEarningsPaise / 100)}
                  </span>
                </div>
              </div>
            </div>

            {/* Download Tokens (if download product) */}
            {selectedOrder.downloadTokens && selectedOrder.downloadTokens.length > 0 && (
              <div className="p-4 rounded-2xl border border-slate-border bg-card space-y-2 text-xs">
                <h4 className="font-bold text-navy uppercase tracking-wider text-[11px] font-display">
                  Download Link Status
                </h4>
                <div className="space-y-2">
                  {selectedOrder.downloadTokens.map((t) => (
                    <div
                      key={t.token}
                      className="p-2.5 rounded-xl bg-slate-subtle flex items-center justify-between text-[11px]"
                    >
                      <span className="font-medium text-navy truncate max-w-[200px]">
                        {t.fileName}
                      </span>
                      <span className="text-slate-muted">
                        {t.downloadCount} / {t.maxDownloads} downloads used
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
