"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to submit request.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-canvas">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 focus-visible:outline-brand-violet">
          <Logo size="lg" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy font-display tracking-tight">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-slate-muted">
          Enter your registered email address and we&apos;ll send you a recovery link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-6 py-8 sm:px-10 shadow-xl border-slate-border">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-mint/15 rounded-full flex items-center justify-center mx-auto mb-4 text-mint">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-navy font-display mb-2">Check your email</h2>
              <p className="text-sm text-slate-muted leading-relaxed mb-6">
                If an account exists for <span className="font-semibold text-slate-text">{email}</span>,
                we have dispatched a password reset link. Please check your inbox and spam folder.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/login">Back to log in</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-text uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="priya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full h-11 font-semibold text-white shadow-brand mt-2"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send reset link
                  </>
                )}
              </Button>

              <div className="pt-4 text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-xs font-semibold text-slate-muted hover:text-slate-text transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  Return to log in
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

