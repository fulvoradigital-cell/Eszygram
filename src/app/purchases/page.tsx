import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { COOKIE_NAME, verifyBuyerToken } from "@/services/buyer-auth.service";
import { getBuyerPurchases } from "@/services/buyer-purchases.service";
import { PurchasesClient } from "@/components/purchases/PurchasesClient";

export const metadata: Metadata = {
  title: "My Purchases & Library | Ezsygram",
  description: "View and access all your digital downloads, courses, and booking sessions.",
};

export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/purchases/login");
  }

  const session = verifyBuyerToken(token);
  if (!session) {
    redirect("/purchases/login");
  }

  const purchases = await getBuyerPurchases(session.email);

  return (
    <div className="min-h-screen bg-[#FAFAFB] dark:bg-[#0B0B1A] text-slate-text pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/60 backdrop-blur-md border-b border-slate-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>

          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs">
            <Link href="/">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Ezsygram</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-8">
        <PurchasesClient
          initialPurchases={purchases}
          buyerEmail={session.email}
        />
      </main>
    </div>
  );
}
