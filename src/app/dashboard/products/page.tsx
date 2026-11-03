"use client";

import * as React from "react";
import { Package, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/providers/toast-provider";

export default function ProductsDashboardPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Digital Products
          </h1>
          <p className="text-sm text-slate-500">
            Manage your ebooks, video courses, downloadable templates, and 1:1 consultation slots.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() =>
            toast({
              title: "Create Product",
              description: "Product creation will be unlocked in the Commerce module.",
              variant: "info",
            })
          }
        >
          Add New Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Product Catalog</CardTitle>
          <CardDescription>
            All products currently listed on your storefront.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Package className="h-7 w-7 text-brand-600" />}
            title="No Products Created Yet"
            description="Start monetizing your knowledge by creating an e-book, Notion template, or 1:1 call slot."
            action={
              <Button
                variant="accent"
                size="sm"
                leftIcon={<Sparkles className="h-4 w-4" />}
                onClick={() =>
                  toast({
                    title: "Coming Soon",
                    description: "Product builder milestone is next up.",
                    variant: "info",
                  })
                }
              >
                Create First Product
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
