"use client";

import * as React from "react";
import { ICreatorProfile, IThemeConfig } from "@/models/CreatorProfile";
import { ClientBlock } from "@/models/Block";
import { MobileStorePreview } from "./mobile-store-preview";
import { useToast } from "@/components/providers/toast-provider";

interface PublicStoreViewProps {
  profile: Partial<ICreatorProfile>;
  theme: IThemeConfig;
  blocks: Array<Partial<ClientBlock>>;
}

export function PublicStoreView({
  profile,
  theme,
  blocks,
}: PublicStoreViewProps) {
  const { toast } = useToast();

  // Record page view on load
  React.useEffect(() => {
    if (profile._id) {
      fetch("/api/analytics/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profile._id.toString() }),
      }).catch((err) => console.warn("View tracking error:", err));
    }
  }, [profile._id]);

  // Handle block click tracking
  const handleBlockClick = (blockId: string) => {
    fetch("/api/analytics/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockId }),
    }).catch((err) => console.warn("Click tracking error:", err));
  };

  // Handle lead capture form submission
  const handleLeadSubmit = async (
    blockId: string,
    data: { email?: string; phone?: string; name?: string }
  ) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileId: profile._id?.toString(),
        blockId,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
      }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      toast({
        title: "Submission Error",
        description: json.error?.message || "Failed to submit details.",
        variant: "error",
      });
      throw new Error(json.error?.message);
    }

    toast({
      title: "Success! 🎉",
      description: "Your details have been shared with the creator.",
      variant: "success",
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-6 bg-slate-100/60">
      <div className="w-full max-w-md">
        <MobileStorePreview
          profile={profile}
          theme={theme}
          blocks={blocks}
          isInteractive={true}
          onBlockClick={handleBlockClick}
          onLeadSubmit={handleLeadSubmit}
        />
      </div>
    </div>
  );
}
