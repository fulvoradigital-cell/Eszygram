"use client";

import * as React from "react";
import QRCode from "qrcode";
import { Download, QrCode, Check, Copy } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  username: string;
}

export function QrCodeModal({
  isOpen,
  onClose,
  url,
  username,
}: QrCodeModalProps) {
  const [dataUrl, setDataUrl] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (url && isOpen) {
      QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      })
        .then((uri) => setDataUrl(uri))
        .catch((err) => console.error("QR Code generation error:", err));
    }
  }, [url, isOpen]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${username}-store-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast({
      title: "QR Code Downloaded",
      description: "Saved as PNG image for your social media & posters.",
      variant: "success",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({
      title: "Store Link Copied",
      description: url,
      variant: "success",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Storefront QR Code"
      description="Print on posters, packaging, YouTube thumbnails, or WhatsApp statuses."
    >
      <div className="flex flex-col items-center justify-center space-y-4 py-2">
        <div className="flex h-64 w-64 items-center justify-center rounded-3xl border border-slate-100 bg-white p-4 shadow-soft">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dataUrl}
              alt={`QR Code for ${username}`}
              className="h-full w-full object-contain rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center text-slate-400">
              <QrCode className="h-10 w-10 animate-pulse" />
              <span className="mt-2 text-xs">Generating QR...</span>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-slate-900">@{username}</p>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{url}</p>
        </div>

        <div className="flex w-full gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          >
            {copied ? "Copied" : "Copy Link"}
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            size="sm"
            onClick={handleDownload}
            disabled={!dataUrl}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Download PNG
          </Button>
        </div>
      </div>
    </Modal>
  );
}

