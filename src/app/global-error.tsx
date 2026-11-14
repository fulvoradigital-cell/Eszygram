"use client";

import React from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#FAFAFB] px-4 text-slate-900 antialiased">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold tracking-tight">
            Ezsygram hit an unexpected error
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Please reload the page to continue.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#6D28D9] to-[#4F46E5] px-6 text-sm font-semibold text-white shadow-lg"
          >
            Reload Ezsygram
          </button>
        </div>
      </body>
    </html>
  );
}

