"use client";

import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[APP_ROUTE_ERROR]", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 shadow-soft">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">
        Something went wrong!
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
        {error.message ||
          "An unexpected error occurred while processing your request. Please try again or return home."}
      </p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Button
          variant="primary"
          onClick={() => reset()}
          leftIcon={<RotateCcw className="h-4 w-4" />}
        >
          Try Again
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
