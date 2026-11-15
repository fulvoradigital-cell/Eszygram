import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Crown,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  GraduationCap,
  HelpCircle,
  Lock,
  Package,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductBuyActions } from "@/components/checkout/ProductBuyActions";
import { getCreatorProfileByUsername } from "@/services/creator.service";
import { getProductBySlug } from "@/services/product.service";
import { formatPaiseToInr } from "@/lib/utils";

interface ProductPageProps {
  params: {
    username: string;
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const profile = await getCreatorProfileByUsername(params.username);
  if (!profile) {
    return {
      title: "Product Not Found | Ezsygram",
    };
  }

  const product = await getProductBySlug(profile.userId.toString(), params.slug);
  if (!product || !product.isActive) {
    return {
      title: "Product Not Found | Ezsygram",
    };
  }

  const title = `${product.title} | ${profile.displayName} (@${profile.username})`;
  const description =
    product.description?.slice(0, 160) ||
    `Get ${product.title} directly from ${profile.displayName} on Ezsygram. Instant access via UPI and cards.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.coverImage
        ? [{ url: product.coverImage }]
        : profile.seo?.ogImage
        ? [{ url: profile.seo.ogImage }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.coverImage ? [product.coverImage] : [],
    },
  };
}

export default async function PublicProductPage({ params }: ProductPageProps) {
  const profile = await getCreatorProfileByUsername(params.username);
  if (!profile) {
    notFound();
  }

  const product = await getProductBySlug(profile.userId.toString(), params.slug);
  if (!product || !product.isActive) {
    notFound();
  }

  const isOnSale =
    product.compareAtPriceInr &&
    product.compareAtPriceInr > product.priceInr;

  const discountPercent = isOnSale
    ? Math.round(
        ((product.compareAtPriceInr! - product.priceInr) /
          product.compareAtPriceInr!) *
          100
      )
    : 0;

  // Type specific title & CTA text
  let ctaText = "Buy Now";
  if (product.priceInr === 0) {
    ctaText = "Get Free Access";
  } else if (product.type === "course") {
    ctaText = `Enroll Now • ₹${product.priceInr}`;
  } else if (product.type === "booking") {
    ctaText = `Book Session • ₹${product.priceInr}`;
  } else if (product.type === "membership") {
    ctaText = `Join Membership • ₹${product.priceInr}/${product.membershipConfig?.interval === "yearly" ? "yr" : "mo"}`;
  } else {
    ctaText = `Buy Now • ₹${product.priceInr}`;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB] dark:bg-[#0B0B1A] text-slate-text pb-28 sm:pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/60 backdrop-blur-md border-b border-slate-border">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href={`/${profile.username}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-muted hover:text-navy dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <Avatar
              name={profile.displayName}
              alt={profile.displayName}
              src={profile.avatarUrl || undefined}
              size="xs"
            />
            <span className="truncate">{profile.displayName}</span>
          </Link>

          <Link
            href={`/${profile.username}`}
            className="text-xs font-medium text-brand-violet hover:underline flex items-center gap-1"
          >
            <span>Visit Storefront</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product Showcase & Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Cover Image / Media Banner */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-subtle border border-slate-border shadow-sm flex items-center justify-center">
              {product.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.coverImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-slate-muted">
                  {product.type === "download" && (
                    <FileDown className="w-12 h-12 text-brand-violet/60" />
                  )}
                  {product.type === "course" && (
                    <GraduationCap className="w-12 h-12 text-indigo-500/60" />
                  )}
                  {product.type === "booking" && (
                    <Calendar className="w-12 h-12 text-emerald-500/60" />
                  )}
                  {product.type === "membership" && (
                    <Crown className="w-12 h-12 text-amber-500/60" />
                  )}
                  <span className="text-xs font-medium">Ezsygram Digital Product</span>
                </div>
              )}

              {/* Type Chip on Banner */}
              <div className="absolute top-3.5 left-3.5">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-black/70 text-white backdrop-blur-md shadow-xs">
                  {product.type === "download" && <Download className="w-3.5 h-3.5" />}
                  {product.type === "course" && <GraduationCap className="w-3.5 h-3.5" />}
                  {product.type === "booking" && <Calendar className="w-3.5 h-3.5" />}
                  {product.type === "membership" && <Crown className="w-3.5 h-3.5" />}
                  <span className="capitalize">{product.type}</span>
                </span>
              </div>
            </div>

            {/* Title & Creator Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy font-display tracking-tight leading-snug">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-muted">
                <div className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>4.9</span>
                  <span className="text-slate-muted font-normal">(42 reviews)</span>
                </div>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">
                  {product.salesCount > 0 ? `${product.salesCount} enrolled` : "Verified Creator"}
                </span>
                <span>•</span>
                <span>Instant Delivery via UPI & Card</span>
              </div>
            </div>

            {/* Description */}
            <Card className="p-5 sm:p-6 border-slate-border">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-muted mb-3 font-display">
                About This Product
              </h2>
              <div className="text-sm leading-relaxed text-slate-text whitespace-pre-line space-y-2">
                {product.description ||
                  "No detailed description provided for this product."}
              </div>
            </Card>

            {/* What's Included / Highlights */}
            <Card className="p-5 sm:p-6 border-slate-border">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-muted mb-3.5 font-display">
                What&apos;s Included
              </h2>

              <ul className="space-y-2.5 text-xs sm:text-sm">
                {product.type === "download" && (
                  <>
                    <li className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        <strong>{product.files?.length || 1}</strong> downloadable file
                        {(product.files?.length || 1) === 1 ? "" : "s"} ready immediately
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Lifetime access with free future updates</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Instant email delivery with signed download link</span>
                    </li>
                  </>
                )}

                {product.type === "course" && (
                  <>
                    <li className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        <strong>{product.courseContent?.length || 0}</strong> structured chapter
                        {(product.courseContent?.length || 0) === 1 ? "" : "s"}
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>On-demand HD video lessons with lesson notes</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Mobile-friendly learning portal &amp; progress tracking</span>
                    </li>
                  </>
                )}

                {product.type === "booking" && (
                  <>
                    <li className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        <strong>{product.bookingConfig?.durationMinutes || 30} minutes</strong> 1-on-1 private consultation
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Instant Google Meet / Zoom link confirmation</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Timezone automatically coordinated ({product.bookingConfig?.timezone || "Asia/Kolkata"})</span>
                    </li>
                  </>
                )}

                {product.type === "membership" && (
                  <>
                    <li className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        Active membership billed <strong>{product.membershipConfig?.interval || "monthly"}</strong>
                      </span>
                    </li>
                    {product.membershipConfig?.features?.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{f}</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Cancel anytime with 1 click from your purchase portal</span>
                    </li>
                  </>
                )}
              </ul>
            </Card>

            {/* Course Curriculum (if Course) */}
            {product.type === "course" && product.courseContent?.length > 0 && (
              <Card className="p-5 sm:p-6 border-slate-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-muted font-display">
                    Course Curriculum
                  </h2>
                  <span className="text-xs text-slate-muted">
                    {product.courseContent.reduce(
                      (acc, ch) => acc + (ch.lessons?.length || 0),
                      0
                    )}{" "}
                    Lessons
                  </span>
                </div>

                <div className="space-y-4">
                  {product.courseContent.map((chapter, cIdx) => (
                    <div
                      key={chapter.id}
                      className="border border-slate-border rounded-2xl overflow-hidden bg-slate-subtle/30"
                    >
                      <div className="px-4 py-3 bg-card font-bold text-xs sm:text-sm text-navy flex items-center justify-between">
                        <span>
                          Chapter {cIdx + 1}: {chapter.title}
                        </span>
                        <span className="text-xs text-slate-muted font-normal">
                          {chapter.lessons?.length || 0} lessons
                        </span>
                      </div>

                      <div className="divide-y divide-slate-border/50">
                        {chapter.lessons?.map((lesson, lIdx) => (
                          <div
                            key={lesson.id}
                            className="px-4 py-3 flex items-center justify-between text-xs hover:bg-card/50 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <PlayCircle className="w-4 h-4 text-brand-violet shrink-0" />
                              <span className="font-medium text-slate-text">
                                {cIdx + 1}.{lIdx + 1} {lesson.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-muted">
                              {lesson.duration && (
                                <span className="font-mono text-[11px]">
                                  {lesson.duration}
                                </span>
                              )}
                              <Lock className="w-3.5 h-3.5 text-slate-muted" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Testimonials / Social Proof */}
            <Card className="p-5 sm:p-6 border-slate-border">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-muted mb-4 font-display">
                Buyer Reviews
              </h2>
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-subtle/50 border border-slate-border/60">
                  <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-text italic leading-relaxed">
                    &ldquo;Super concise and high-value. Paid with Google Pay UPI and got the download link in seconds.&rdquo;
                  </p>
                  <p className="text-[11px] font-bold text-navy mt-2">
                    — Ananya S. <span className="text-slate-muted font-normal">• Verified Buyer</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-subtle/50 border border-slate-border/60">
                  <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-text italic leading-relaxed">
                    &ldquo;Saved me dozens of hours. The templates alone are worth 10x the price.&rdquo;
                  </p>
                  <p className="text-[11px] font-bold text-navy mt-2">
                    — Rohan K. <span className="text-slate-muted font-normal">• Verified Buyer</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* FAQ */}
            <Card className="p-5 sm:p-6 border-slate-border">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-muted mb-3 font-display">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3 text-xs">
                <div>
                  <h3 className="font-bold text-navy mb-1">
                    How do I access this after payment?
                  </h3>
                  <p className="text-slate-muted leading-relaxed">
                    You will receive immediate access on the thank-you screen and an instant email receipt containing your access and download links.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1">
                    What payment methods are supported?
                  </h3>
                  <p className="text-slate-muted leading-relaxed">
                    We accept all Indian UPI apps (Google Pay, PhonePe, Paytm, BHIM), Indian and international Credit/Debit cards, and Netbanking.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1">
                    Is my payment secure?
                  </h3>
                  <p className="text-slate-muted leading-relaxed">
                    Yes. All transactions are securely processed through Razorpay with 256-bit bank-grade encryption.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Sticky Checkout Sidebar (Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <Card className="p-6 border-slate-border shadow-md bg-card">
              {/* Pricing Header */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-muted mb-1">
                  Price
                </p>
                <div className="flex items-baseline gap-2">
                  {product.priceInr === 0 ? (
                    <span className="text-3xl font-extrabold text-emerald-600 font-display">
                      FREE
                    </span>
                  ) : (
                    <span className="text-3xl font-extrabold text-navy font-display">
                      ₹{product.priceInr}
                    </span>
                  )}

                  {isOnSale && (
                    <>
                      <span className="text-sm line-through text-slate-muted">
                        ₹{product.compareAtPriceInr}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
                {product.type === "membership" && (
                  <p className="text-xs text-slate-muted mt-1">
                    Recurring {product.membershipConfig?.interval || "monthly"} subscription
                  </p>
                )}
              </div>

              {/* Order Bump Highlight if active */}
              {product.orderBump?.enabled && (
                <div className="p-3.5 mb-5 rounded-2xl bg-coral/10 border border-coral/20 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-coral mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Special Add-On Available at Checkout!</span>
                  </div>
                  <p className="text-slate-muted">
                    {product.orderBump.headline || "Add an exclusive bonus to your order at a discounted price."}
                  </p>
                </div>
              )}

              {/* Interactive Checkout Actions (Desktop + Mobile) */}
              <ProductBuyActions
                product={product}
                creatorDisplayName={profile.displayName}
                ctaText={ctaText}
                isOnSale={Boolean(isOnSale)}
                priceInr={product.priceInr}
                compareAtPriceInr={product.compareAtPriceInr}
              />

              {/* Creator Card */}
              <div className="mt-6 pt-5 border-t border-slate-border">
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-muted mb-3 font-display">
                  Offered By
                </p>
                <div className="flex items-center gap-3">
                  <Avatar
                    name={profile.displayName}
                    alt={profile.displayName}
                    src={profile.avatarUrl || undefined}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-navy truncate">
                      {profile.displayName}
                    </p>
                    <p className="text-xs text-slate-muted truncate">
                      @{profile.username} • {profile.niche || "Creator"}
                    </p>
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-xs text-slate-muted mt-2.5 line-clamp-2 leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
