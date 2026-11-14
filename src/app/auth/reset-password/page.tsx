"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function TokenReader({
  onToken,
}: {
  onToken: (t: string) => void;
}) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  useEffect(() => {
    if (token) {
      onToken(token);
    }
  }, [token, onToken]);

  return null;
}

export default function ResetPasswordPage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("Password reset token is missing.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to reset password.");
      }

      setSuccess(true);
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
      <Suspense fallback={null}>
        <TokenReader onToken={setToken} />
      </Suspense>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 focus-visible:outline-brand-violet">
          <Logo size="lg" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy font-display tracking-tight">
          Set new password
        </h1>
        <p className="mt-2 text-sm text-slate-muted">
          Choose a secure password with at least 8 characters.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-6 py-8 sm:px-10 shadow-xl border-slate-border">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-mint/15 rounded-full flex items-center justify-center mx-auto mb-4 text-mint">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-navy font-display mb-2">Password Updated</h2>
              <p className="text-sm text-slate-muted leading-relaxed mb-6">
                Your password has been successfully updated. You can now log in with your new credentials.
              </p>
              <Button
                variant="primary"
                className="w-full h-11 text-white font-semibold shadow-brand"
                onClick={() => router.push("/auth/login")}
              >
                Sign in to your account
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
                <label htmlFor="password" className="block text-xs font-semibold text-slate-text uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-muted hover:text-slate-text transition-colors p-1"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-text uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-11 font-semibold text-white shadow-brand mt-2"
                disabled={isLoading || password.length < 8 || !confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 mr-2" />
                    Reset password
                  </>
                )}
              </Button>

              <div className="pt-4 text-center">
                <Link
                  href="/auth/login"
                  className="text-xs font-semibold text-brand-violet hover:underline"
                >
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
