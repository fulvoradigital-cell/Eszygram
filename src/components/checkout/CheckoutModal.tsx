"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Lock,
  Plus,
  ShieldCheck,
  Sparkles,
  Tag,
  X,
  Zap,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/providers/ToastProvider";
import type { ProductDTO } from "@/types";

interface RazorpayResponse {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (res: { error?: { description?: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  product: ProductDTO;
  creatorDisplayName?: string;
}

export function CheckoutModal({
  open,
  onClose,
  product,
  creatorDisplayName,
}: CheckoutModalProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [includeBump, setIncludeBump] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountInr: number;
    discountPaise: number;
  } | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [mockConfirmOpen, setMockConfirmOpen] = useState(false);
  const [mockOrderData, setMockOrderData] = useState<{
    orderId: string;
    razorpayOrderId: string;
  } | null>(null);

  // Load Razorpay script dynamically
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Pricing calculations
  const basePriceInr = product.priceInr;
  const bumpPriceInr =
    includeBump && product.orderBump?.enabled
      ? product.orderBump.discountPricePaise
        ? Math.round(product.orderBump.discountPricePaise / 100)
        : 0
      : 0;

  const discountInr = appliedCoupon ? appliedCoupon.discountInr : 0;
  const totalInr = Math.max(0, basePriceInr + bumpPriceInr - discountInr);
  const isFree = totalInr === 0;

  // Apply Coupon
  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);

    try {
      const res = await fetch("/api/checkout/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          code: couponCode.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Invalid coupon code.");
      }

      setAppliedCoupon({
        code: json.data.code,
        discountInr: json.data.discountInr,
        discountPaise: json.data.discountPaise,
      });
      toast.success("Coupon Applied!", json.data.message);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to apply coupon.";
      toast.error("Coupon Error", msg);
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
  }

  // Handle Checkout Submission
  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name Required", "Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Email Required", "Please enter a valid email address.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Valid Phone Required", "Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Initialize checkout on server
      const initRes = await fetch("/api/checkout/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          buyerName: name.trim(),
          buyerEmail: email.trim().toLowerCase(),
          buyerPhone: cleanPhone.slice(-10),
          includeOrderBump: includeBump,
          couponCode: appliedCoupon?.code || undefined,
        }),
      });

      const initJson = await initRes.json();
      if (!initRes.ok || !initJson.success) {
        throw new Error(initJson.error?.message || "Checkout initialization failed.");
      }

      const { orderId, isFree, razorpayOrderId, amountPaise, keyId, redirectUrl } =
        initJson.data;

      // 2. Free product or 100% coupon: immediate fulfillment
      if (isFree) {
        toast.success("Access Granted!", "Your order was processed successfully.");
        onClose();
        router.push(redirectUrl || `/orders/${orderId}`);
        return;
      }

      // 3. Paid product: check if Razorpay SDK is available
      if (
        window.Razorpay &&
        keyId &&
        !keyId.includes("mock") &&
        razorpayOrderId &&
        !razorpayOrderId.includes("mock")
      ) {
        const options = {
          key: keyId,
          amount: amountPaise,
          currency: "INR",
          name: "Ezsygram",
          description: product.title,
          order_id: razorpayOrderId,
          prefill: {
            name: name.trim(),
            email: email.trim(),
            contact: `+91${cleanPhone.slice(-10)}`,
          },
          theme: {
            color: "#6D28D9",
          },
          handler: async (response: RazorpayResponse) => {
            try {
              const verifyRes = await fetch("/api/checkout/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyJson = await verifyRes.json();
              if (!verifyRes.ok || !verifyJson.success) {
                throw new Error(verifyJson.error?.message || "Payment verification failed.");
              }

              toast.success("Payment Successful!", "Your access is now available.");
              onClose();
              router.push(`/orders/${orderId}`);
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : "Payment verification failed.";
              toast.error("Verification Error", msg);
            }
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response) => {
          toast.error("Payment Failed", response.error?.description || "Payment could not be completed.");
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Dev/Mock fallback mode: simulate payment completion
        setMockOrderData({ orderId, razorpayOrderId: razorpayOrderId || `order_mock_${Date.now()}` });
        setMockConfirmOpen(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout error occurred.";
      toast.error("Checkout Failed", msg);
      setIsProcessing(false);
    }
  }

  // Complete simulated mock checkout
  async function completeMockPayment() {
    if (!mockOrderData) return;
    setIsProcessing(true);

    try {
      const verifyRes = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: mockOrderData.orderId,
          razorpay_order_id: mockOrderData.razorpayOrderId,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: "mock_signature",
        }),
      });

      const verifyJson = await verifyRes.json();
      if (!verifyRes.ok || !verifyJson.success) {
        throw new Error(verifyJson.error?.message || "Mock verification failed.");
      }

      toast.success("Payment Verified (Test Mode)", "Order fulfilled successfully.");
      setMockConfirmOpen(false);
      onClose();
      router.push(`/orders/${mockOrderData.orderId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Mock payment error.";
      toast.error("Payment Failed", msg);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <>
      <Modal
        open={open && !mockConfirmOpen}
        onClose={() => !isProcessing && onClose()}
        title="Complete Checkout"
        size="md"
      >
        <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-1">
          {/* Product Summary Header */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-subtle/60 border border-slate-border">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-border shrink-0 flex items-center justify-center">
              {product.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.coverImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Sparkles className="w-5 h-5 text-brand-violet" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-navy truncate font-display">
                {product.title}
              </h4>
              <p className="text-[11px] text-slate-muted truncate">
                by {creatorDisplayName || "Verified Creator"}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm sm:text-base font-extrabold text-navy font-display">
                {basePriceInr === 0 ? "FREE" : `₹${basePriceInr}`}
              </span>
            </div>
          </div>

          {/* Buyer Details Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-text mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-text mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-text mb-1">
                  Mobile / WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-muted">
                    +91
                  </span>
                  <Input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-10 text-xs pl-11"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Bump (if product has one enabled) */}
          {product.orderBump?.enabled && (
            <div
              onClick={() => setIncludeBump(!includeBump)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                includeBump
                  ? "bg-coral/10 border-coral/50 shadow-xs"
                  : "bg-card border-slate-border hover:border-slate-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={includeBump}
                  onChange={() => {}} // handled by parent div
                  className="mt-0.5 rounded text-coral focus:ring-coral w-4 h-4 cursor-pointer"
                />
                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-bold text-navy flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-coral shrink-0" />
                      <span>{product.orderBump.productTitle || "Special Add-on"}</span>
                    </span>
                    <span className="font-bold text-coral shrink-0">
                      +₹{bumpPriceInr}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-muted leading-relaxed">
                    {product.orderBump.headline || "Check to add this exclusive add-on to your purchase."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Coupon Code Input */}
          <div className="pt-1">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {appliedCoupon.code} (-₹{appliedCoupon.discountInr})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-slate-muted hover:text-red-500 text-xs font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Coupon code (optional)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="h-9 text-xs font-mono uppercase"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  onClick={handleApplyCoupon}
                  className="h-9 px-3 text-xs shrink-0"
                >
                  {isApplyingCoupon ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="p-3 rounded-2xl bg-slate-subtle/40 border border-slate-border/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-muted">
              <span>{product.title}</span>
              <span>₹{basePriceInr}</span>
            </div>

            {includeBump && (
              <div className="flex justify-between text-coral font-medium">
                <span>Add-on: {product.orderBump?.productTitle || "Order Bump"}</span>
                <span>+₹{bumpPriceInr}</span>
              </div>
            )}

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon ({appliedCoupon.code})</span>
                <span>-₹{discountInr}</span>
              </div>
            )}

            <div className="border-t border-slate-border pt-1.5 flex justify-between font-bold text-sm text-navy font-display">
              <span>Total Amount</span>
              <span className="text-base text-brand-violet">
                {totalInr === 0 ? "FREE" : `₹${totalInr}`}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 space-y-2">
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              disabled={isProcessing}
              className="w-full text-sm font-bold py-3.5 h-auto shadow-md shadow-brand-violet/20"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Processing Checkout...</span>
                </>
              ) : isFree ? (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  <span>Get Instant Access (Free)</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  <span>Pay ₹{totalInr} via UPI / Card</span>
                </>
              )}
            </Button>

            <p className="text-[11px] text-center text-slate-muted flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant access. 256-bit bank-grade encryption.</span>
            </p>
          </div>
        </form>
      </Modal>

      {/* Simulated Dev Payment Modal (when Razorpay credentials are test/unconfigured) */}
      <Modal
        open={mockConfirmOpen}
        onClose={() => !isProcessing && setMockConfirmOpen(false)}
        title="Simulate UPI Payment (Test Mode)"
        size="sm"
      >
        <div className="space-y-4 pt-1 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mx-auto">
            <Zap className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-navy font-display">
              Simulate UPI Payment
            </h3>
            <p className="text-xs text-slate-muted mt-1">
              You are in local/test mode without production Razorpay keys. Click below to simulate an instant UPI payment of{" "}
              <strong className="text-navy font-semibold">₹{totalInr}</strong>.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-subtle border border-slate-border text-xs text-left space-y-1">
            <div className="flex justify-between text-slate-muted">
              <span>Customer:</span>
              <span className="font-semibold text-navy">{name}</span>
            </div>
            <div className="flex justify-between text-slate-muted">
              <span>Amount:</span>
              <span className="font-semibold text-emerald-600">₹{totalInr}</span>
            </div>
            <div className="flex justify-between text-slate-muted">
              <span>Simulated Method:</span>
              <span className="font-semibold text-navy">Google Pay / PhonePe UPI</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isProcessing}
              onClick={() => setMockConfirmOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="gradient"
              size="sm"
              disabled={isProcessing}
              onClick={completeMockPayment}
              className="flex-1 gap-1.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Authorizing...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve ₹{totalInr}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
