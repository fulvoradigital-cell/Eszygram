"use client";

import React, { useState } from "react";
import { Globe, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import type { ProfileSeo } from "@/types";

interface SeoCustomizerProps {
  currentSeo: ProfileSeo;
  onUpdateSeo: (seo: Partial<ProfileSeo>) => Promise<void>;
}

export function SeoCustomizer({ currentSeo, onUpdateSeo }: SeoCustomizerProps) {
  const [metaTitle, setMetaTitle] = useState(currentSeo.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(currentSeo.metaDescription || "");
  const [ogImage, setOgImage] = useState(currentSeo.ogImage || "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateSeo({
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        ogImage: ogImage.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="p-5 sm:p-6 border-slate-border">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-border">
        <Globe className="w-4 h-4 text-brand-violet" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-text">
          Search & Social Sharing (SEO)
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="metaTitle" className="block text-xs font-semibold text-slate-text uppercase">
              Meta Title (Browser Tab & Google)
            </label>
            <span className="text-[11px] text-slate-muted">{metaTitle.length}/80</span>
          </div>
          <Input
            id="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Priya Sharma | Career Coach & Templates"
            maxLength={80}
          />
          <p className="mt-1 text-[11px] text-slate-muted">
            Recommended length: 50-60 characters for best display on Google.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="metaDescription" className="block text-xs font-semibold text-slate-text uppercase">
              Meta Description
            </label>
            <span className="text-[11px] text-slate-muted">{metaDescription.length}/200</span>
          </div>
          <Textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Turn your resume into job offers. Browse my premium resume templates, 1:1 strategy calls, and free resources."
            rows={3}
            maxLength={200}
          />
          <p className="mt-1 text-[11px] text-slate-muted">
            Appears below your link in Google search results and WhatsApp previews.
          </p>
        </div>

        <div>
          <label htmlFor="ogImage" className="block text-xs font-semibold text-slate-text uppercase mb-1.5">
            Social Share Image URL (OG Image)
          </label>
          <Input
            id="ogImage"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            placeholder="https://images.unsplash.com/... or your custom 1200x630 banner"
          />
          <p className="mt-1 text-[11px] text-slate-muted">
            The preview image shown when your link is shared on WhatsApp, Twitter, and LinkedIn.
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSaving}
            className="shadow-brand"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Saving SEO Settings...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save SEO Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
