"use client";

import * as React from "react";
import { Store, Palette, Layout, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useSession } from "next-auth/react";

export default function StoreDashboardPage() {
  const { data: session } = useSession();
  const username = session?.user?.username || "creator";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Storefront Builder
          </h1>
          <p className="text-sm text-slate-500">
            Customize your public link in bio, theme, bio banner, and digital product shelf.
          </p>
        </div>

        <a
          href={`/${username}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5"
        >
          <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
            Open Live Store
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4 text-brand-600" />
              Storefront Theme &amp; Layout
            </CardTitle>
            <CardDescription>
              Choose your colors, brand aesthetic, and block arrangement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Store className="h-7 w-7 text-brand-600" />}
              title="Storefront Customizer"
              description="Visual builder with real-time mobile preview will be available in the Store Customizer module."
              action={
                <Button variant="accent" size="sm" leftIcon={<Sparkles className="h-4 w-4" />}>
                  Explore Themes
                </Button>
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layout className="h-4 w-4 text-brand-600" />
              Active Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Store Status</span>
              <Badge variant="success">Published</Badge>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Theme</span>
              <span className="font-semibold text-slate-900">Indigo Minimal</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Layout</span>
              <span className="font-semibold text-slate-900">Classic Stack</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Payment Mode</span>
              <span className="font-semibold text-emerald-700">UPI Instant</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
