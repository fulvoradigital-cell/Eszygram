"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Store,
  Package,
  Receipt,
  Users,
  Zap,
  IndianRupee,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Store", href: "/dashboard/store", icon: Store },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Orders", href: "/dashboard/orders", icon: Receipt },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Automations", href: "/dashboard/automations", icon: Zap },
  { name: "Payouts", href: "/dashboard/payouts", icon: IndianRupee },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const creatorName = session?.user?.name || "Creator";
  const username = session?.user?.username || "creator";
  const userAvatar = session?.user?.image;

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col md:flex-row">
      {/* =================================================================== */}
      {/* DESKTOP SIDEBAR (md:flex) */}
      {/* =================================================================== */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30 border-r border-slate-200/80 bg-white shadow-soft">
        {/* Brand Header */}
        <div className="flex h-16 items-center px-6 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white shadow-soft">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-none">
                Creator Revenue
              </span>
              <span className="text-[10px] font-bold tracking-wider text-brand-600 uppercase">
                Operating System
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 py-5 space-y-6">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-brand-50 text-brand-700 font-bold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-brand-600" : "text-slate-400"
                    )}
                  />
                  <span>{item.name}</span>
                  {item.name === "Payouts" && (
                    <Badge variant="accent" className="ml-auto text-[9px] py-0 px-1.5">
                      UPI
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Public Store Link Card */}
          <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-brand-900">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-accent-500" />
                Live Storefront
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5 font-bold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono truncate">
              /{username}
            </p>
            <a
              href={`/${username}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 transition pt-1"
            >
              <span>View Store</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Creator Profile & Sign Out Footer */}
        <div className="border-t border-slate-100 p-4 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0 border border-brand-200 overflow-hidden text-xs">
                {userAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userAvatar}
                    alt={creatorName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  creatorName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {creatorName}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  @{username}
                </p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* MOBILE TOP BAR (< md) */}
      {/* =================================================================== */}
      <div className="md:hidden sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white shadow-soft">
            <Zap className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900">
            Creator Revenue <span className="text-brand-600">OS</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={`/${username}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 inline-flex items-center gap-1"
          >
            <span>Store</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MOBILE DRAWER MODAL */}
      {/* =================================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute right-0 top-0 bottom-0 w-3/4 max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-extrabold text-slate-900">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition",
                        isActive
                          ? "bg-brand-50 text-brand-700 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            isActive ? "text-brand-600" : "text-slate-400"
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0">
                  {userAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={userAvatar}
                      alt={creatorName}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    creatorName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {creatorName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">@{username}</p>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/50 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* =================================================================== */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen pb-24 md:pb-8">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* =================================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (< md) */}
      {/* =================================================================== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1 shadow-lg">
        <div className="grid grid-cols-5 items-center">
          {[
            { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
            { name: "Store", href: "/dashboard/store", icon: Store },
            { name: "Products", href: "/dashboard/products", icon: Package },
            { name: "Orders", href: "/dashboard/orders", icon: Receipt },
            { name: "Payouts", href: "/dashboard/payouts", icon: IndianRupee },
          ].map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 text-center transition-all select-none",
                  isActive
                    ? "text-brand-600 font-bold scale-105"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                <Icon className={cn("h-5 w-5 mb-1", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px] leading-none tracking-tight">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

