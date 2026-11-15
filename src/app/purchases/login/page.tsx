"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2, KeyRound, Loader2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/brand/Logo";
import { useToast } from "@/components/providers/ToastProvider";

export default function BuyerLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Send OTP
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Email Required", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/buyer/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to send verification code.");
      }

      toast.success("Code Sent!", `We sent a 6-digit login code to ${email}.`);
      setStep("otp");
      startCooldown();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error sending code.";
      toast.error("Error", msg);
    } finally {
      setIsLoading(false);
    }
  }

  // Verify OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || code.trim().length !== 6) {
      toast.error("Code Required", "Please enter the 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/buyer/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Invalid or expired code.");
      }

      toast.success("Welcome Back!", "Entering your purchases library...");
      router.push("/purchases");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed.";
      toast.error("Invalid Code", msg);
    } finally {
      setIsLoading(false);
    }
  }

  function startCooldown() {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB] dark:bg-[#0B0B1A] flex flex-col justify-between py-12 px-4">
      {/* Top Navbar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>

        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs">
          <Link href="/">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </Button>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <Card className="p-6 sm:p-8 border-slate-border bg-card shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
              My Purchases &amp; Library
            </h1>
            <p className="text-xs text-slate-muted max-w-xs mx-auto">
              Access your digital downloads, courses, bookings, and invoices without a password.
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-text mb-1.5">
                  Enter Your Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 h-11 text-xs"
                  />
                </div>
                <p className="text-[11px] text-slate-muted mt-1.5">
                  Use the same email address you entered during checkout.
                </p>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                disabled={isLoading}
                className="w-full text-xs sm:text-sm font-bold shadow-md shadow-brand-violet/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Send Login Code</span>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-text">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-[11px] text-brand-violet hover:underline"
                  >
                    Change Email
                  </button>
                </div>

                <Input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  required
                  className="h-12 text-center text-lg font-mono tracking-widest font-bold"
                  autoFocus
                />
                <p className="text-[11px] text-slate-muted text-center mt-1.5">
                  Sent to <strong className="text-navy">{email}</strong>
                </p>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                disabled={isLoading || code.length !== 6}
                className="w-full text-xs sm:text-sm font-bold shadow-md shadow-brand-violet/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <span>Verify &amp; View Purchases</span>
                )}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={handleSendOtp}
                  className="text-xs text-slate-muted hover:text-navy disabled:opacity-50"
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Didn't receive the code? Resend"}
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 border-t border-slate-border text-center">
            <p className="text-[11px] text-slate-muted flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Passwordless, secure email authentication</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-muted">
        <span>Are you a creator? </span>
        <Link href="/auth/login" className="text-brand-violet font-semibold hover:underline">
          Creator Dashboard Login
        </Link>
      </div>
    </div>
  );
}
