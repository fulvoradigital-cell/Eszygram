"use client";

import React, { useState } from "react";
import { ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "./CheckoutModal";
import type { ProductDTO } from "@/types";

interface ProductBuyActionsProps {
  product: ProductDTO;
  creatorDisplayName?: string;
  ctaText: string;
  isOnSale?: boolean;
  priceInr: number;
  compareAtPriceInr?: number | null;
}

export function ProductBuyActions({
  product,
  creatorDisplayName,
  ctaText,
  isOnSale,
  priceInr,
  compareAtPriceInr,
}: ProductBuyActionsProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      {/* Desktop Checkout CTA */}
      <div className="space-y-3">
        <Button
          variant="gradient"
          size="lg"
          onClick={() => setCheckoutOpen(true)}
          className="w-full text-sm font-bold shadow-lg shadow-brand-violet/25 py-3.5 h-auto transition-transform active:scale-[0.985]"
        >
          <Zap className="w-4 h-4 mr-2" />
          <span>{ctaText}</span>
        </Button>

        <p className="text-[11px] text-center text-slate-muted flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure 256-bit UPI &amp; Card Checkout</span>
        </p>
      </div>

      {/* Mobile Sticky Bottom Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/90 backdrop-blur-md border-t border-slate-border p-3.5 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-slate-muted uppercase font-bold tracking-wider">
              Total
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-navy font-display">
                {priceInr === 0 ? "FREE" : `₹${priceInr}`}
              </span>
              {isOnSale && compareAtPriceInr && (
                <span className="text-xs line-through text-slate-muted">
                  ₹{compareAtPriceInr}
                </span>
              )}
            </div>
          </div>

          <Button
            variant="gradient"
            size="md"
            onClick={() => setCheckoutOpen(true)}
            className="flex-1 max-w-[240px] text-xs font-bold shadow-md shadow-brand-violet/25"
          >
            <span>{ctaText}</span>
          </Button>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        product={product}
        creatorDisplayName={creatorDisplayName}
      />
    </>
  );
}
