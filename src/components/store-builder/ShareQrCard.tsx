"use client";

import React, { useState, useEffect } from "react";
import { Check, Copy, Download, ExternalLink, QrCode, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/providers/ToastProvider";

interface ShareQrCardProps {
  username: string;
}

export function ShareQrCard({ username }: ShareQrCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [origin, setOrigin] = useState("https://ezsygram.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const storeUrl = `${origin}/${username}`;

  useEffect(() => {
    async function fetchQr() {
      try {
        const res = await fetch("/api/creator/qr");
        const json = await res.json();
        if (json.success && json.data?.qrDataUrl) {
          setQrDataUrl(json.data.qrDataUrl);
        }
      } catch {
        // fallback
      }
    }
    fetchQr();
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    toast.success("Link Copied!", `${storeUrl} copied to clipboard.`);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleDownloadQr() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `ezsygram-${username}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("QR Code Downloaded", "Ready for print or social stories!");
  }

  return (
    <Card className="p-5 sm:p-6 border-slate-border">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-border">
        <Share2 className="w-4 h-4 text-brand-violet" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-text">
          Share Your Storefront
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Store Link & Copy */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-text uppercase">
            Your Public Store URL
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-canvas border border-slate-border text-xs font-mono">
            <span className="text-slate-text truncate flex-1">{storeUrl}</span>
            <Button
              size="xs"
              variant="outline"
              onClick={handleCopy}
              className="h-8 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-mint" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              asChild
              variant="outline"
              size="xs"
              className="h-8 text-xs font-semibold"
            >
              <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Visit Store
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="xs"
              className="h-8 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out my storefront on Ezsygram: ${storeUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Share on WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* Right: QR Code Visual Card */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-canvas border border-slate-border text-center">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt={`QR Code for ${storeUrl}`}
              className="w-36 h-36 rounded-xl shadow-xs bg-white p-2 border border-slate-border"
            />
          ) : (
            <div className="w-36 h-36 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <QrCode className="w-12 h-12" />
            </div>
          )}
          <div className="mt-3">
            <Button
              size="xs"
              variant="primary"
              onClick={handleDownloadQr}
              disabled={!qrDataUrl}
              className="shadow-brand"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download QR Code (PNG)
            </Button>
          </div>
          <p className="text-[10px] text-slate-muted mt-2">
            Perfect for your Instagram Stories, business cards, & print flyers.
          </p>
        </div>
      </div>
    </Card>
  );
}
