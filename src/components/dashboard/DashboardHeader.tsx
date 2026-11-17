"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  ExternalLink,
  LogOut,
  Menu,
  Moon,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DASHBOARD_NAV_ITEMS } from "./DashboardSidebar";

interface DashboardHeaderProps {
  username?: string;
}

export function DashboardHeader({ username }: DashboardHeaderProps) {
  const pathname = usePathname() || "";
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = session?.user;
  const storeUrl = username ? `/${username}` : "/dashboard/store";

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-card/90 backdrop-blur-md border-b border-slate-border px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Mobile hamburger & Logo (on mobile), or Breadcrumb / Store CTA (on desktop) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl text-slate-text hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="lg:hidden">
            <Link href="/dashboard">
              <Logo size="sm" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-muted">
            <span>Ezsygram</span>
            <span>/</span>
            <span className="text-slate-text capitalize">
              {pathname === "/dashboard"
                ? "Overview"
                : pathname.replace("/dashboard/", "").replace("-", " ")}
            </span>
          </div>
        </div>

        {/* Right: View Live Store + ThemeToggle + Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 px-3 text-xs font-semibold flex items-center gap-1.5 border-brand-violet/30 text-brand-violet hover:bg-brand-violet/10"
          >
            <Link href={storeUrl} target={username ? "_blank" : undefined} className="inline-flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">View Live Store</span>
              <span className="sm:hidden">Store</span>
            </Link>
          </Button>

          <ThemeToggle />

          <div className="flex items-center gap-2 pl-2 border-l border-slate-border">
            <Avatar
              name={user?.name || "Creator"}
              alt={user?.name || "Creator"}
              src={user?.image || undefined}
              size="sm"
            />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-card p-6 shadow-2xl flex flex-col justify-between border-r border-slate-border animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-border">
                <Logo size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-muted hover:text-slate-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-canvas border border-slate-border flex items-center gap-3">
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
                  <div className="text-[11px] text-slate-muted truncate">
                    {user?.email}
                  </div>
                </div>
              </div>

              <nav className="mt-6 space-y-1">
                {DASHBOARD_NAV_ITEMS.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-brand-violet text-white shadow-brand"
                          : "text-slate-text hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-muted"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase bg-brand-violet/20 text-brand-violet">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-border">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
