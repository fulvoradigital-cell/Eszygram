import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getCreatorProfileByUserId } from "@/services/creator.service";
import { getProductsByCreatorId } from "@/services/product.service";
import { ProductManager } from "@/components/products/ProductManager";

export const metadata: Metadata = {
  title: "Products & Services | Ezsygram Creator Dashboard",
  description: "Manage your digital downloads, courses, bookings, and memberships.",
};

export const dynamic = "force-dynamic";

export default async function ProductsDashboardPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/products");
  }

  const profile = await getCreatorProfileByUserId(session.user.id);
  if (!profile) {
    redirect("/onboarding");
  }

  const initialProducts = await getProductsByCreatorId(session.user.id);

  return (
    <div className="max-w-6xl mx-auto py-2">
      <ProductManager
        initialProducts={initialProducts}
        username={profile.username}
      />
    </div>
  );
}
