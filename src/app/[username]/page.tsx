import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicStoreByUsername } from "@/services/store.service";
import { PublicStoreView } from "@/components/store/public-store-view";

interface CreatorPageProps {
  params: {
    username: string;
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: CreatorPageProps): Promise<Metadata> {
  const store = await getPublicStoreByUsername(params.username);
  if (!store || !store.profile) {
    return {
      title: "Creator Not Found | Creator Revenue OS",
      description: "The requested creator storefront does not exist.",
    };
  }

  const { profile } = store;
  const pageTitle =
    profile.seo?.title ||
    `${profile.displayName} (@${profile.username}) | Creator Revenue OS`;
  const pageDescription =
    profile.seo?.description ||
    profile.bio ||
    `Visit @${profile.username}'s official link-in-bio storefront.`;

  const ogImage =
    profile.seo?.ogImageUrl ||
    profile.avatarUrl ||
    undefined;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/${profile.username}`,
      siteName: "Creator Revenue OS",
      images: ogImage ? [{ url: ogImage }] : [],
      type: "profile",
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: pageTitle,
      description: pageDescription,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const store = await getPublicStoreByUsername(params.username);

  // If creator profile does not exist, trigger the Next.js 404 page
  if (!store || !store.profile) {
    notFound();
  }

  const { profile, blocks } = store;

  // Serialize Mongoose documents safely to plain JSON objects for client component
  const serializedProfile = JSON.parse(JSON.stringify(profile));
  const serializedBlocks = JSON.parse(JSON.stringify(blocks));

  return (
    <PublicStoreView
      profile={serializedProfile}
      theme={serializedProfile.theme || {}}
      blocks={serializedBlocks}
    />
  );
}

