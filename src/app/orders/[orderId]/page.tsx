import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileDown,
  GraduationCap,
  Package,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/Logo";
import { getOrderById } from "@/services/order.service";
import { getCreatorProfileByUserId } from "@/services/creator.service";
import { getProductById } from "@/services/product.service";

interface OrderReceiptPageProps {
  params: { orderId: string };
}

export async function generateMetadata({
  params,
}: OrderReceiptPageProps): Promise<Metadata> {
  const order = await getOrderById(params.orderId);
  if (!order) {
    return { title: "Order Not Found | Ezsygram" };
  }

  return {
    title: `Order Receipt #${order.invoiceNumber} | Ezsygram`,
    description: `Order confirmation for ${order.productTitle}`,
  };
}

export default async function OrderReceiptPage({ params }: OrderReceiptPageProps) {
  const order = await getOrderById(params.orderId);
  if (!order) {
    notFound();
  }

  const [creatorProfile, product] = await Promise.all([
    getCreatorProfileByUserId(order.creatorId),
    getProductById(order.productId),
  ]);

  const storefrontUrl = creatorProfile?.username
    ? `/${creatorProfile.username}`
    : "/";

  const isDownload = order.productType === "download";
  const isCourse = order.productType === "course";
  const isBooking = order.productType === "booking";
  const isMembership = order.productType === "membership";

  return (
    <div className="min-h-screen bg-[#FAFAFB] dark:bg-[#0B0B1A] text-slate-text py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link href={storefrontUrl} className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>

          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
            <Link href={storefrontUrl}>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
          </Button>
        </div>

        {/* Success Banner */}
        <Card className="p-6 sm:p-8 text-center border-slate-border bg-card shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50 dark:ring-emerald-950/20">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display mb-1">
            Payment Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted max-w-sm mx-auto">
            Thank you, <strong className="font-semibold text-navy">{order.buyerName}</strong>. Your order has been processed and access has been unlocked.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <Badge variant="brand" size="md">
              Invoice #{order.invoiceNumber}
            </Badge>
            <Badge variant="outline" size="md" className="capitalize">
              Paid via {order.paymentMethod.toUpperCase()}
            </Badge>
          </div>
        </Card>

        {/* Immediate Delivery / Access Section */}
        <Card className="p-6 sm:p-7 border-slate-border bg-card shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-border pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-violet" />
              <span>Your Access &amp; Delivery</span>
            </h2>
            <span className="text-xs text-emerald-600 font-bold">Instant Delivery</span>
          </div>

          {/* 1. DIGITAL DOWNLOAD DELIVERY */}
          {isDownload && (
            <div className="space-y-4">
              <p className="text-xs text-slate-muted">
                Your downloadable files are ready. Click below to download your purchase directly:
              </p>

              {order.downloadTokens.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-subtle text-xs text-slate-muted text-center">
                  Product files are being prepared. Check your email confirmation.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {order.downloadTokens.map((tokenObj) => (
                    <div
                      key={tokenObj.token}
                      className="p-3.5 sm:p-4 rounded-2xl border border-slate-border bg-slate-subtle/40 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center shrink-0">
                          <FileDown className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold text-navy truncate">
                            {tokenObj.fileName}
                          </p>
                          <p className="text-[11px] text-slate-muted">
                            {5 - tokenObj.downloadCount} downloads remaining • Valid for 24h
                          </p>
                        </div>
                      </div>

                      <Button
                        asChild
                        variant="gradient"
                        size="sm"
                        className="gap-1.5 text-xs font-bold shrink-0 shadow-xs"
                      >
                        <a
                          href={`/api/downloads/${tokenObj.token}`}
                          download={tokenObj.fileName}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-slate-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-muted" />
                <span>Download links will expire in 24 hours. A copy was also sent to {order.buyerEmail}.</span>
              </p>
            </div>
          )}

          {/* 2. COURSE DELIVERY */}
          {isCourse && (
            <div className="space-y-3">
              <p className="text-xs text-slate-muted">
                You have lifetime access to <strong>{order.productTitle}</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/30 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-300">
                  <GraduationCap className="w-4 h-4 text-brand-violet" />
                  <span>Curriculum Unlocked</span>
                </div>
                <p className="text-slate-muted leading-relaxed">
                  You can watch all video lessons and access course materials anytime from your buyer portal or storefront.
                </p>
                <div className="pt-2">
                  <Button asChild variant="gradient" size="sm" className="gap-2 text-xs">
                    <Link href={storefrontUrl}>
                      <span>Start Learning Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 3. 1:1 BOOKING DELIVERY */}
          {isBooking && (
            <div className="space-y-3">
              <p className="text-xs text-slate-muted">
                Your 1:1 consultation session with <strong>{creatorProfile?.displayName}</strong> has been secured!
              </p>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Calendar Confirmation Sent</span>
                </div>
                <p className="text-slate-muted leading-relaxed">
                  A Google Meet / calendar invite link and calendar scheduling details have been forwarded to{" "}
                  <strong>{order.buyerEmail}</strong>.
                </p>
                {product?.bookingConfig?.calendarUrl && (
                  <div className="pt-2">
                    <Button asChild variant="gradient" size="sm" className="gap-1.5 text-xs">
                      <a
                        href={product.bookingConfig.calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Schedule Call Slot</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. MEMBERSHIP DELIVERY */}
          {isMembership && (
            <div className="space-y-3">
              <p className="text-xs text-slate-muted">
                Your membership is now active! You will enjoy all creator perks and member-only updates.
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-xs space-y-1.5">
                <p className="font-bold text-amber-900 dark:text-amber-300">
                  Active Subscription ({order.productTitle})
                </p>
                <p className="text-slate-muted">
                  Receipt and portal management instructions were sent to {order.buyerEmail}.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Order Receipt Details */}
        <Card className="p-6 border-slate-border bg-card shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-muted font-display">
            Receipt Summary
          </h3>

          <div className="divide-y divide-slate-border text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-muted">Product</span>
              <span className="font-semibold text-navy text-right">
                {order.productTitle}
              </span>
            </div>

            {order.orderBumpIncluded && (
              <div className="py-2.5 flex justify-between text-coral">
                <span>Included Add-On</span>
                <span className="font-semibold">
                  +₹{Math.round(order.orderBumpPricePaise / 100)}
                </span>
              </div>
            )}

            {order.discountAmountPaise > 0 && (
              <div className="py-2.5 flex justify-between text-emerald-600">
                <span>Coupon Discount ({order.couponCode})</span>
                <span className="font-semibold">
                  -₹{Math.round(order.discountAmountPaise / 100)}
                </span>
              </div>
            )}

            <div className="py-2.5 flex justify-between">
              <span className="text-slate-muted">Delivered To</span>
              <span className="font-mono text-[11px] text-navy">
                {order.buyerEmail}
              </span>
            </div>

            <div className="py-2.5 flex justify-between">
              <span className="text-slate-muted">Payment Reference</span>
              <span className="font-mono text-[11px] text-slate-muted">
                {order.razorpayPaymentId || "FREE_ORDER"}
              </span>
            </div>

            <div className="pt-3 flex justify-between font-bold text-sm text-navy font-display">
              <span>Total Paid</span>
              <span className="text-base text-brand-violet">
                {order.amountInr === 0 ? "FREE" : `₹${order.amountInr}`}
              </span>
            </div>
          </div>
        </Card>

        {/* Footer Trust Bar */}
        <div className="text-center pt-2 text-xs text-slate-muted flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Need help? Contact the creator at their storefront page.</span>
        </div>
      </div>
    </div>
  );
}
