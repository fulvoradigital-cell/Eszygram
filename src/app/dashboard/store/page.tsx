import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import {
  getCreatorProfileByUserId,
  toCreatorProfileDTO,
} from "@/services/creator.service";
import { getBlocksByUserId } from "@/services/block.service";
import { StoreBuilder } from "@/components/store-builder/StoreBuilder";

export const metadata = {
  title: "Storefront Builder | Ezsygram",
  description: "Customize your link-in-bio storefront blocks, theme colors, and SEO.",
};

export default async function DashboardStorePage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/store");
  }

  const profile = await getCreatorProfileByUserId(session.user.id);
  if (!profile || !profile.onboardingCompleted) {
    redirect("/onboarding");
  }

  const blocks = await getBlocksByUserId(session.user.id);

  return (
    <StoreBuilder
      initialProfile={toCreatorProfileDTO(profile)}
      initialBlocks={blocks}
    />
  );
}
