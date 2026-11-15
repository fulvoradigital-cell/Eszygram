"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart3,
  ExternalLink,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Users,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const DASHBOARD_NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/store", label: "Store", icon: Store },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/automations", label: "Automations", icon: Zap, badge: "New" },
  { href: "/dashboard/payouts", label: "Payouts", icon: IndianRupee },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user;
  const plan = user?.plan || "free";

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-slate-border z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size="md" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-bold text-slate-muted uppercase tracking-wider px-3 mb-2">
          Creator Studio
        </div>
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-brand-violet text-white shadow-brand"
                  : "text-slate-text hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-muted"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-brand-violet/10 text-brand-violet"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile & Plan */}
      <div className="p-4 border-t border-slate-border space-y-3">
        <div className="p-3 rounded-xl bg-canvas border border-slate-border flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar
              name={user?.name || "Creator"}
              alt={user?.name || "Creator"}
              src={user?.image || undefined}
              size="sm"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-text truncate">
                {user?.name || "Creator"}
              </div>
              <div className="text-[11px] text-slate-muted truncate capitalize">
                {plan} Plan
              </div>
            </div>
          </div>
          <Badge
            variant={plan === "business" ? "accent" : plan === "pro" ? "brand" : "neutral"}
            size="sm"
            className="uppercase text-[9px] font-extrabold"
          >
            {plan}
          </Badge>
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
