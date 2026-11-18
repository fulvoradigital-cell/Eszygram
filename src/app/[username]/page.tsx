import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  Instagram,
  Sparkles,
  Twitter,
  Youtube,
  Globe,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { getBlocksByUserId } from "@/services/block.service";
import { getCreatorProfileByUsername } from "@/services/creator.service";
import { StorefrontBlock } from "@/components/storefront/StorefrontBlock";
import { StorefrontTracker } from "@/components/storefront/StorefrontTracker";

interface StorefrontPageProps {
  params: { username: string };
}

export async function generateMetadata({
  params,
}: StorefrontPageProps): Promise<Metadata> {
  const profile = await getCreatorProfileByUsername(params.username);

  if (!profile) {
    return {
      title: "Store Not Found | Ezsygram",
      description: "The requested creator storefront could not be located.",
    };
  }

  const title =
    profile.seo?.metaTitle ||
    `${profile.displayName} (@${profile.username}) | Ezsygram Store`;
  const description =
    profile.seo?.metaDescription ||
    profile.bio ||
    `Visit ${profile.displayName}'s official Ezsygram storefront to purchase products and book sessions.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.seo?.ogImage ? [{ url: profile.seo.ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: profile.seo?.ogImage ? [profile.seo.ogImage] : [],
    },
  };
}

export default async function StorefrontPage({ params }: StorefrontPageProps) {
  const profile = await getCreatorProfileByUsername(params.username);

  if (!profile) {
    notFound();
  }

  const blocks = await getBlocksByUserId(profile.userId.toString(), true);
  const theme = profile.theme || {
    preset: "modern-violet",
    primaryColor: "#6D28D9",
    backgroundColor: "#FAFAFB",
    font: "Inter",
    buttonRadius: "rounded-xl",
  };

  const isDark = theme.preset === "deep-cyber";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  const bioColor = isDark ? "#CBD5E1" : "#475569";

  return (
    <div
      className="min-h-screen py-10 px-4 flex flex-col justify-between transition-colors"
      style={{
        backgroundColor: theme.backgroundColor || "#FAFAFB",
        fontFamily: theme.font || "Inter",
      }}
    >
      {/* Client Analytics Tracker */}
      <StorefrontTracker username={profile.username} />

      {/* Main Storefront Column (max 520px) */}
      <div className="w-full max-w-[500px] mx-auto flex-1 flex flex-col justify-between">
        {/* Optional Storefront Cover Banner */}
        {profile.coverImageUrl && (
          <div className="w-full aspect-[2.8/1] sm:aspect-[3/1] rounded-3xl overflow-hidden mb-[-42px] relative shadow-sm border border-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.coverImageUrl}
              alt={`${profile.displayName}'s cover banner`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Creator Header */}
        <header className="text-center pt-2 pb-6 relative z-10">
          <Avatar
            name={profile.displayName}
            alt={profile.displayName}
            src={profile.avatarUrl || undefined}
            size="xl"
            className="mx-auto mb-3.5 shadow-lg ring-4 ring-white/90 dark:ring-black/60"
          />

          <h1
            className="text-xl sm:text-2xl font-black tracking-tight leading-tight"
            style={{ color: textColor }}
          >
            {profile.displayName}
          </h1>

          {profile.bio && (
            <p
              className="text-xs sm:text-sm mt-2 leading-relaxed max-w-sm mx-auto"
              style={{ color: bioColor }}
            >
              {profile.bio}
            </p>
          )}

          {/* Social Links Row */}
          {profile.socialLinks && profile.socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-2.5 mt-4">
              {profile.socialLinks.map((s, idx) => {
                const href = s.url.startsWith("http") ? s.url : `https://${s.url}`;
                return (
                  <a
                    key={idx}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all flex items-center justify-center shadow-xs"
                    style={{ color: theme.primaryColor || "#6D28D9" }}
                    aria-label={`Visit ${s.platform}`}
                  >
                    {s.platform === "instagram" && <Instagram className="w-4 h-4" />}
                    {s.platform === "youtube" && <Youtube className="w-4 h-4" />}
                    {s.platform === "twitter" && <Twitter className="w-4 h-4" />}
                    {s.platform === "website" && <Globe className="w-4 h-4" />}
                  </a>
                );
              })}
            </div>
          )}
        </header>

        {/* Active Blocks List */}
        <main className="space-y-3.5 flex-1">
          {blocks.length === 0 ? (
            <div className="py-12 text-center text-sm opacity-60">
              No products or links published yet.
            </div>
          ) : (
            blocks.map((block) => (
              <StorefrontBlock
                key={block.id}
                block={block}
                theme={theme}
                username={profile.username}
              />
            ))
          )}
        </main>

        {/* Storefront Footer */}
        <footer className="pt-10 pb-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs transition-opacity hover:opacity-100 bg-white/70 dark:bg-black/40 backdrop-blur-sm border border-black/5 dark:border-white/10 opacity-75"
            style={{ color: textColor }}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
            <span>Made with Ezsygram</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}
