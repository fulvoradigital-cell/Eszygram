"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function QueryAlerts({
  onError,
}: {
  onError: (msg: string) => void;
}) {
  const searchParams = useSearchParams();
  const registered = searchParams?.get("registered");
  const authError = searchParams?.get("error");

  return (
    <>
      {registered && (
        <div className="mb-6 p-3.5 rounded-xl bg-mint/10 border border-mint/30 text-mint text-sm font-medium">
          Account created successfully! Please sign in with your email and password.
        </div>
      )}
      {authError && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-sm">
          Authentication failed. Please check your credentials.
        </div>
      )}
    </>
  );
}

function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const params = new URLSearchParams(search);
      const callbackUrl = params.get("callbackUrl") || "/dashboard";

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email address or password.");
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("An unexpected error occurred during sign in. Please try again.");
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const params = new URLSearchParams(search);
      const callbackUrl = params.get("callbackUrl") || "/dashboard";
      await signIn("google", { callbackUrl });
    } catch {
      setError("Unable to connect with Google. Please try again or use email.");
      setIsGoogleLoading(false);
    }
  }

  return (
    <Card className="px-6 py-8 sm:px-10 shadow-xl border-slate-border">
      <Suspense fallback={null}>
        <QueryAlerts onError={setError} />
      </Suspense>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full h-11 flex items-center justify-center gap-3 font-medium text-slate-text"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-slate-muted" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        )}
        Continue with Google
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-canvas px-3 text-slate-muted">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-text uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-brand-violet hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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

        <Button
          type="submit"
          variant="primary"
          className="w-full h-11 font-semibold text-white shadow-brand mt-2"
          disabled={isLoading || isGoogleLoading || !email || !password}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign in to Dashboard
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-border text-center text-sm text-slate-muted">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-semibold text-brand-violet hover:underline">
          Create an account
        </Link>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-canvas">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 focus-visible:outline-brand-violet">
          <Logo size="lg" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy font-display tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-muted">
          Log in to manage your link-in-bio storefront and automations.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
