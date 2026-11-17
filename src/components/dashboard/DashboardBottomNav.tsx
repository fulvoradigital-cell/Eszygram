"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Zap,
} from "lucide-react";

const MOBILE_NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/store", label: "Store", icon: Store },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/automations", label: "Automations", icon: Zap },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardBottomNav() {
  const pathname = usePathname() || "";

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-card/95 backdrop-blur-md border-t border-slate-border px-1 py-1.5 flex items-center justify-around">
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-1.5 sm:px-3 rounded-xl transition-all min-w-[48px] min-h-[44px] ${
              isActive
                ? "text-brand-violet"
                : "text-slate-muted hover:text-slate-text"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
            <span className={`text-[10px] mt-0.5 ${isActive ? "font-bold" : "font-medium"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

