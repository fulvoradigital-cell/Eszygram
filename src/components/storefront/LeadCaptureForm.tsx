"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LeadCaptureFormProps {
  username: string;
  blockId: string;
  headline: string;
  subheadline?: string;
  captureType: "email" | "whatsapp" | "both";
  buttonText?: string;
  primaryColor: string;
  buttonRadius: string;
  cardBackground: string;
  textColor: string;
}

export function LeadCaptureForm({
  username,
  blockId,
  headline,
  subheadline,
  captureType,
  buttonText = "Get Free Access",
  primaryColor,
  buttonRadius,
  cardBackground,
  textColor,
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/store/${encodeURIComponent(username)}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockId,
          email: email.trim() || undefined,
          whatsapp: whatsapp.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to submit. Please try again.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="w-full p-6 rounded-3xl border border-black/5 shadow-md text-center animate-in fade-in zoom-in-95 duration-200"
        style={{ backgroundColor: cardBackground }}
      >
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h4 className="text-base font-bold mb-1" style={{ color: textColor }}>
          You&apos;re on the list!
        </h4>
        <p className="text-xs opacity-75 max-w-xs mx-auto" style={{ color: textColor }}>
          Thank you for subscribing. Check your inbox or WhatsApp for access details.
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full p-5 sm:p-6 rounded-3xl border border-black/5 shadow-md text-center"
      style={{ backgroundColor: cardBackground }}
    >
      <h3 className="text-base sm:text-lg font-bold mb-1" style={{ color: textColor }}>
        {headline}
      </h3>
      {subheadline && (
        <p className="text-xs opacity-80 mb-4 max-w-sm mx-auto" style={{ color: textColor }}>
          {subheadline}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5 max-w-md mx-auto text-left">
        {error && (
          <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
            {error}
          </div>
        )}

        {(captureType === "email" || captureType === "both") && (
          <div>
            <Input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={captureType === "email"}
              disabled={isSubmitting}
              className="h-11 bg-white/80 dark:bg-black/30 border-black/10 text-xs"
            />
          </div>
        )}

        {(captureType === "whatsapp" || captureType === "both") && (
          <div>
            <Input
              type="tel"
              placeholder="WhatsApp number (+91...)"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required={captureType === "whatsapp"}
              disabled={isSubmitting}
              className="h-11 bg-white/80 dark:bg-black/30 border-black/10 text-xs"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-11 text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${buttonRadius}`}
          style={{ backgroundColor: primaryColor }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              {buttonText}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
