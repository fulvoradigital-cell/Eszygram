"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[CRITICAL_GLOBAL_ERROR]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900 font-sans">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900">Critical Error</h2>
          <p className="mt-2 text-sm text-slate-600">
            A fatal error interrupted the application layout.
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
