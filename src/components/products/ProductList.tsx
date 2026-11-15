"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Check,
  Copy,
  Crown,
  Edit2,
  ExternalLink,
  Eye,
  FileDown,
  GraduationCap,
  Package,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/providers/ToastProvider";
import type { ProductDTO, ProductType } from "@/types";

interface ProductListProps {
  products: ProductDTO[];
  username?: string;
  onEdit: (product: ProductDTO) => void;
  onDelete: (productId: string) => void;
  onToggleActive: (productId: string, currentActive: boolean) => Promise<void>;
  onCreateNew: () => void;
}

export function ProductList({
  products,
  username,
  onEdit,
  onDelete,
  onToggleActive,
  onCreateNew,
}: ProductListProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"all" | ProductType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesTab = activeTab === "all" || p.type === activeTab;
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [products, activeTab, searchQuery]);

  // Aggregate stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const totalSales = products.reduce((acc, p) => acc + (p.salesCount || 0), 0);

  const filterTabs: Array<{ id: "all" | ProductType; label: string; count: number }> = [
    { id: "all", label: "All Products", count: totalProducts },
    {
      id: "download",
      label: "Downloads",
      count: products.filter((p) => p.type === "download").length,
    },
    {
      id: "course",
      label: "Courses",
      count: products.filter((p) => p.type === "course").length,
    },
    {
      id: "booking",
      label: "1:1 Bookings",
      count: products.filter((p) => p.type === "booking").length,
    },
    {
      id: "membership",
      label: "Memberships",
      count: products.filter((p) => p.type === "membership").length,
    },
  ];

  function copyProductLink(slug: string, id: string) {
    if (!username) {
      toast.warning("Username Missing", "Complete onboarding to get your public storefront link.");
      return;
    }
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/${username}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link Copied!", "Shareable product page link copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2500);
  }

  function getTypeBadge(type: ProductType) {
    switch (type) {
      case "download":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-brand-violet border border-violet-200/50">
            <FileDown className="w-3 h-3" />
            Download
          </span>
        );
      case "course":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/50">
            <GraduationCap className="w-3 h-3" />
            Course
          </span>
        );
      case "booking":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            <Calendar className="w-3 h-3" />
            1:1 Session
          </span>
        );
      case "membership":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/50">
            <Crown className="w-3 h-3" />
            Membership
          </span>
        );
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4 flex items-center justify-between border-slate-border bg-card">
          <div>
            <p className="text-xs font-medium text-slate-muted">Total Products</p>
            <p className="text-2xl font-extrabold text-navy font-display mt-0.5">
              {totalProducts}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border-slate-border bg-card">
          <div>
            <p className="text-xs font-medium text-slate-muted">Active in Store</p>
            <p className="text-2xl font-extrabold text-emerald-600 font-display mt-0.5">
              {activeProducts}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border-slate-border bg-card">
          <div>
            <p className="text-xs font-medium text-slate-muted">Total Sales</p>
            <p className="text-2xl font-extrabold text-navy font-display mt-0.5">
              {totalSales}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-slate-border overflow-x-auto">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
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
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title or slug..."
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

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center border-slate-border">
          <div className="w-14 h-14 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mx-auto mb-4">
            <Package className="w-7 h-7" />
          </div>
          {products.length === 0 ? (
            <>
              <h2 className="text-lg font-bold text-navy font-display mb-2">
                No Products Created Yet
              </h2>
              <p className="text-sm text-slate-muted max-w-md mx-auto mb-6">
                Start selling digital downloads, video courses, 1:1 consultation sessions, or recurring memberships to your audience.
              </p>
              <Button
                variant="gradient"
                size="md"
                onClick={onCreateNew}
                className="gap-2 shadow-md shadow-brand-violet/20"
              >
                <Plus className="w-4 h-4" />
                Create First Product
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-base font-bold text-navy font-display mb-1">
                No Matching Products Found
              </h2>
              <p className="text-xs text-slate-muted max-w-sm mx-auto mb-4">
                No products match your current search query or active filter.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredProducts.map((product) => {
            const hasOrderBump = product.orderBump?.enabled;
            const isOnSale =
              product.compareAtPriceInr &&
              product.compareAtPriceInr > product.priceInr;
            const discountPercent = isOnSale
              ? Math.round(
                  ((product.compareAtPriceInr! - product.priceInr) /
                    product.compareAtPriceInr!) *
                    100
                )
              : 0;

            const publicUrl = username
              ? `/${username}/p/${product.slug}`
              : null;

            return (
              <Card
                key={product.id}
                className={`p-4 sm:p-5 border transition-all hover:border-brand-violet/40 hover:shadow-sm ${
                  product.isActive
                    ? "border-slate-border bg-card"
                    : "border-slate-border/50 bg-slate-subtle/30 opacity-80"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Cover Thumbnail */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-subtle border border-slate-border shrink-0 flex items-center justify-center relative">
                      {product.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.coverImage}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-slate-muted">
                          {product.type === "download" && (
                            <FileDown className="w-6 h-6" />
                          )}
                          {product.type === "course" && (
                            <GraduationCap className="w-6 h-6" />
                          )}
                          {product.type === "booking" && (
                            <Calendar className="w-6 h-6" />
                          )}
                          {product.type === "membership" && (
                            <Crown className="w-6 h-6" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {getTypeBadge(product.type)}
                        {hasOrderBump && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-coral/10 text-coral border border-coral/20">
                            <Sparkles className="w-2.5 h-2.5" />
                            Order Bump
                          </span>
                        )}
                        {!product.isActive && (
                          <Badge variant="outline" size="sm" className="text-[10px] text-slate-muted">
                            Draft / Inactive
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-navy truncate font-display">
                        {product.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-muted">
                        <span className="font-mono text-[11px] text-slate-muted truncate">
                          /{product.slug}
                        </span>

                        <span>•</span>

                        {/* Content summary */}
                        {product.type === "download" && (
                          <span>
                            {product.files?.length || 0} file
                            {(product.files?.length || 0) === 1 ? "" : "s"}
                          </span>
                        )}
                        {product.type === "course" && (
                          <span>
                            {product.courseContent?.length || 0} chapter
                            {(product.courseContent?.length || 0) === 1 ? "" : "s"}
                          </span>
                        )}
                        {product.type === "booking" && (
                          <span>
                            {product.bookingConfig?.durationMinutes || 30} min session
                          </span>
                        )}
                        {product.type === "membership" && (
                          <span className="capitalize">
                            {product.membershipConfig?.interval || "monthly"} subscription
                          </span>
                        )}

                        <span>•</span>

                        <span>{product.salesCount || 0} sales</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Price Display */}
                  <div className="flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-border/50">
                    <div className="text-left sm:text-right">
                      <div className="flex items-center gap-1.5 sm:justify-end">
                        {product.priceInr === 0 ? (
                          <span className="text-base font-extrabold text-emerald-600">
                            FREE
                          </span>
                        ) : (
                          <span className="text-lg font-extrabold text-navy font-display">
                            ₹{product.priceInr}
                          </span>
                        )}

                        {isOnSale && (
                          <>
                            <span className="text-xs line-through text-slate-muted">
                              ₹{product.compareAtPriceInr}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                              {discountPercent}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {product.type === "membership" && (
                        <p className="text-[10px] text-slate-muted">
                          billed {product.membershipConfig?.interval || "monthly"}
                        </p>
                      )}
                    </div>

                    {/* Active Switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-muted sm:hidden">
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                      <Switch
                        checked={product.isActive}
                        onCheckedChange={(checked: boolean) =>
                          onToggleActive(product.id, checked)
                        }
                        aria-label="Toggle active status"
                      />
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-border/50">
                    {/* Share / Copy link */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyProductLink(product.slug, product.id)}
                      title="Copy Public Link"
                      className="h-8 w-8 p-0 text-slate-muted hover:text-navy"
                    >
                      {copiedId === product.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>

                    {/* View public page in new tab */}
                    {publicUrl && (
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        title="View Public Page"
                        className="h-8 w-8 p-0 text-slate-muted hover:text-navy"
                      >
                        <Link href={publicUrl} target="_blank">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}

                    {/* Edit */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="h-8 px-2.5 text-xs font-semibold gap-1 text-slate-text"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </Button>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product.id)}
                      title="Delete Product"
                      className="h-8 w-8 p-0 text-slate-muted hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
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
