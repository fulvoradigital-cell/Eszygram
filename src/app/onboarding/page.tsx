"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Instagram,
  Loader2,
  Share2,
  Sparkles,
  User,
  XCircle,
  Youtube,
  Globe,
  Twitter,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import type { CreatorNiche, SocialLink } from "@/types";

const NICHES: { id: CreatorNiche; label: string; icon: string; desc: string }[] = [
  { id: "coaching", label: "Coaches & Consultants", icon: "🎯", desc: "1:1 calls, audits, strategy" },
  { id: "courses", label: "Educators & Creators", icon: "📚", desc: "Cohort courses, workshops, PDFs" },
  { id: "fitness", label: "Fitness & Wellness", icon: "💪", desc: "Workout plans, diet charts" },
  { id: "design", label: "Designers & Creatives", icon: "🎨", desc: "Templates, UI kits, presets" },
  { id: "tech", label: "Tech & Developers", icon: "💻", desc: "Code starters, tutorials, tools" },
  { id: "finance", label: "Finance & Business", icon: "📈", desc: "Models, spreadsheets, advisory" },
  { id: "content", label: "Content Creators", icon: "✨", desc: "Media kits, brand deals, guides" },
  { id: "photography", label: "Photographers", icon: "📷", desc: "Presets, bookings, prints" },
  { id: "astrology", label: "Astrology & Tarot", icon: "🔮", desc: "Birth charts, readings" },
  { id: "culinary", label: "Chefs & Food", icon: "🍳", desc: "Recipe books, meal plans" },
  { id: "other", label: "Other Business", icon: "🚀", desc: "Any skill or product to monetize" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Username
  const [username, setUsername] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{
    checked: boolean;
    available: boolean;
    reason?: string;
  }>({ checked: false, available: false });

  // Step 2: Profile
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Step 3: Niche & Socials
  const [selectedNiche, setSelectedNiche] = useState<CreatorNiche>("coaching");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");

  // Step 4: Submission & Celebration
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://ezsygram.com");

  // Prefill initial user data from NextAuth session
  useEffect(() => {
    if (session?.user?.name && !displayName) {
      setDisplayName(session.user.name);
      // Generate clean starter username from name
      const candidate = session.user.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 16);
      if (candidate.length >= 3 && !username) {
        setUsername(candidate);
      }
    }
    if (session?.user?.image && !avatarUrl) {
      setAvatarUrl(session.user.image);
    }
  }, [session, displayName, username, avatarUrl]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Live debounced username check
  useEffect(() => {
    const clean = username.trim().toLowerCase();
    if (!clean || clean.length < 3) {
      setUsernameStatus({ checked: false, available: false });
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const res = await fetch("/api/creator/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: clean }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          setUsernameStatus({
            checked: true,
            available: json.data.available,
            reason: json.data.reason,
          });
        } else {
          setUsernameStatus({
            checked: true,
            available: false,
            reason: json.error?.message || "Unavailable",
          });
        }
      } catch {
        setUsernameStatus({ checked: false, available: false });
      } finally {
        setIsCheckingUsername(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username]);

  // Submit onboarding to API
  async function handleCompleteOnboarding() {
    setIsSubmitting(true);

    const socialLinks: SocialLink[] = [];
    if (instagram.trim()) {
      const handle = instagram.trim().replace(/^@/, "");
      socialLinks.push({
        platform: "instagram",
        url: handle.startsWith("http") ? handle : `https://instagram.com/${handle}`,
      });
    }
    if (youtube.trim()) {
      socialLinks.push({ platform: "youtube", url: youtube.trim() });
    }
    if (twitter.trim()) {
      const handle = twitter.trim().replace(/^@/, "");
      socialLinks.push({
        platform: "twitter",
        url: handle.startsWith("http") ? handle : `https://x.com/${handle}`,
      });
    }
    if (website.trim()) {
      socialLinks.push({ platform: "website", url: website.trim() });
    }

    try {
      const res = await fetch("/api/creator/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.toLowerCase().trim(),
          displayName: displayName.trim(),
          bio: bio.trim(),
          avatarUrl: avatarUrl.trim(),
          niche: selectedNiche,
          socialLinks,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to complete onboarding.");
      }

      setStep(4);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving profile.";
      toast.error("Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCopyStoreLink() {
    const fullUrl = `${origin}/${username}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Link Copied!", `${fullUrl} copied to your clipboard.`);
    setTimeout(() => setCopied(false), 2500);
  }

  const storeUrl = `${origin}/${username || "yourname"}`;

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between pb-6">
        <Logo size="md" />
        {step < 4 && (
          <div className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
            Step {step} of 3
          </div>
        )}
      </div>

      {/* Progress Bar (Steps 1-3) */}
      {step < 4 && (
        <div className="max-w-xl mx-auto w-full mb-8">
          <div className="h-1.5 w-full bg-slate-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-brand transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Wizard Content Card */}
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center">
        <Card className="p-6 sm:p-10 shadow-xl border-slate-border">
          {/* STEP 1: CHOOSE USERNAME */}
          {step === 1 && (
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-violet/10 text-brand-violet mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Step 1: Your Store Link
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy font-display tracking-tight mb-2">
                Claim your unique link
              </h1>
              <p className="text-sm text-slate-muted mb-6">
                This will be your permanent link in bio where your followers buy your products.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-xs font-semibold text-slate-text uppercase tracking-wider mb-2">
                    Storefront Username
                  </label>
                  <div className="relative flex rounded-xl shadow-sm">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-border bg-slate-50 dark:bg-slate-900 text-slate-muted text-sm font-medium">
                      ezsygram.com/
                    </span>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
                      placeholder="priyasharma"
                      className="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none rounded-r-xl border border-slate-border bg-card text-slate-text text-sm font-semibold focus:ring-2 focus:ring-brand-violet focus:border-brand-violet outline-none transition-all"
                      maxLength={30}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                      {isCheckingUsername && (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-muted" />
                      )}
                      {!isCheckingUsername && usernameStatus.checked && (
                        usernameStatus.available ? (
                          <div className="flex items-center gap-1 text-mint text-xs font-semibold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Available</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-500 text-xs font-semibold">
                            <XCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Unavailable</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {usernameStatus.checked && !usernameStatus.available && (
                    <p className="mt-2 text-xs text-red-500 font-medium">
                      {usernameStatus.reason || "Username is not available. Please choose another."}
                    </p>
                  )}

                  {usernameStatus.checked && usernameStatus.available && (
                    <p className="mt-2 text-xs text-mint font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Great choice! <strong>ezsygram.com/{username}</strong> is all yours.
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-muted">
                    Only lowercase letters, numbers, underscores, and dashes. Minimum 3 characters.
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    variant="gradient"
                    className="w-full h-11 text-white font-semibold shadow-brand flex items-center justify-center gap-2"
                    onClick={() => setStep(2)}
                    disabled={!usernameStatus.available || isCheckingUsername}
                  >
                    Continue to Profile
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROFILE DETAILS */}
          {step === 2 && (
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-violet/10 text-brand-violet mb-4">
                <User className="w-3.5 h-3.5" />
                Step 2: Creator Profile
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy font-display tracking-tight mb-2">
                Set up your brand
              </h1>
              <p className="text-sm text-slate-muted mb-6">
                Tell your Instagram audience who you are and what you offer.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block text-xs font-semibold text-slate-text uppercase tracking-wider mb-1.5">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Priya Sharma | Career Coach"
                    required
                    maxLength={60}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="bio" className="block text-xs font-semibold text-slate-text uppercase tracking-wider">
                      Bio
                    </label>
                    <span className="text-xs text-slate-muted">{bio.length}/250</span>
                  </div>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Helping 10k+ professionals land dream roles in tech & product. Free resumes & 1:1 mentorship below 👇"
                    rows={3}
                    maxLength={250}
                  />
                </div>

                <div>
                  <label htmlFor="avatarUrl" className="block text-xs font-semibold text-slate-text uppercase tracking-wider mb-1.5">
                    Profile Photo URL (optional)
                  </label>
                  <Input
                    id="avatarUrl"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or your Instagram photo"
                  />
                  <p className="mt-1 text-xs text-slate-muted">
                    Paste an image link, or upload one later from your Store Settings.
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="h-11 px-4"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                  </Button>
                  <Button
                    variant="gradient"
                    className="flex-1 h-11 text-white font-semibold shadow-brand flex items-center justify-center gap-2"
                    onClick={() => setStep(3)}
                    disabled={!displayName.trim()}
                  >
                    Continue to Niche & Socials
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: NICHE & SOCIAL LINKS */}
          {step === 3 && (
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-violet/10 text-brand-violet mb-4">
                <Share2 className="w-3.5 h-3.5" />
                Step 3: Niche & Socials
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy font-display tracking-tight mb-2">
                What do you create?
              </h1>
              <p className="text-sm text-slate-muted mb-6">
                Choose your primary niche to personalize your templates and connect your socials.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-text uppercase tracking-wider mb-2.5">
                    Select Your Creator Niche
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {NICHES.map((niche) => {
                      const isSelected = selectedNiche === niche.id;
                      return (
                        <button
                          key={niche.id}
                          type="button"
                          onClick={() => setSelectedNiche(niche.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "border-brand-violet bg-brand-violet/10 shadow-sm"
                              : "border-slate-border hover:border-slate-300 dark:hover:border-slate-700 bg-card"
                          }`}
                        >
                          <span className="text-xl mb-1 block">{niche.icon}</span>
                          <span className="text-xs font-bold text-slate-text block leading-tight">
                            {niche.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-slate-text uppercase tracking-wider">
                    Connect Social Accounts
                  </label>

                  {/* Instagram */}
                  <div className="relative flex rounded-xl shadow-sm">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-border bg-slate-50 dark:bg-slate-900 text-slate-muted text-sm font-semibold">
                      <Instagram className="w-4 h-4 mr-1.5 text-pink-500" />
                      @
                    </span>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="instagram_handle"
                      className="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none rounded-r-xl border border-slate-border bg-card text-slate-text text-sm focus:ring-2 focus:ring-brand-violet focus:border-brand-violet outline-none"
                    />
                  </div>

                  {/* YouTube */}
                  <div className="relative flex rounded-xl shadow-sm">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-border bg-slate-50 dark:bg-slate-900 text-slate-muted text-sm font-semibold">
                      <Youtube className="w-4 h-4 mr-1.5 text-red-500" />
                    </span>
                    <input
                      type="text"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      placeholder="https://youtube.com/@channel"
                      className="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none rounded-r-xl border border-slate-border bg-card text-slate-text text-sm focus:ring-2 focus:ring-brand-violet focus:border-brand-violet outline-none"
                    />
                  </div>

                  {/* Twitter / X */}
                  <div className="relative flex rounded-xl shadow-sm">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-border bg-slate-50 dark:bg-slate-900 text-slate-muted text-sm font-semibold">
                      <Twitter className="w-4 h-4 mr-1.5 text-sky-500" />
                      @
                    </span>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="x_handle"
                      className="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none rounded-r-xl border border-slate-border bg-card text-slate-text text-sm focus:ring-2 focus:ring-brand-violet focus:border-brand-violet outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="h-11 px-4"
                    onClick={() => setStep(2)}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                  </Button>
                  <Button
                    variant="gradient"
                    className="flex-1 h-11 text-white font-semibold shadow-brand flex items-center justify-center gap-2"
                    onClick={handleCompleteOnboarding}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Finishing setup...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Finish & Launch Store
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CELEBRATION & LINK REVEAL */}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-brand">
                <Sparkles className="w-8 h-8" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy font-display tracking-tight mb-2">
                🎉 You&apos;re live, {displayName}!
              </h1>
              <p className="text-sm text-slate-muted max-w-sm mx-auto mb-8">
                Your Ezsygram storefront is ready to accept orders and automate your Instagram DMs.
              </p>

              {/* Highlight Store Link Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-canvas border border-slate-border mb-6">
                <div className="text-xs uppercase font-semibold text-slate-muted mb-2 tracking-wider">
                  Your Store Link
                </div>
                <div className="text-base sm:text-lg font-bold text-brand-violet break-all font-mono mb-4">
                  {storeUrl}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <Button
                    variant="default"
                    className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-2 text-sm font-semibold bg-brand-violet hover:bg-brand-violet/90 text-white"
                    onClick={handleCopyStoreLink}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Check out my new storefront: ${storeUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Share2 className="w-4 h-4 text-emerald-500" />
                      Share on WhatsApp
                    </a>
                  </Button>
                </div>
              </div>

              {/* Primary Dashboard CTA */}
              <Button
                variant="gradient"
                className="w-full h-12 text-base font-bold text-white shadow-brand flex items-center justify-center gap-2"
                onClick={() => {
                  router.push("/dashboard");
                  router.refresh();
                }}
              >
                Go to Creator Dashboard
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Footer Branding */}
      <div className="text-center pt-8 text-xs text-slate-muted">
        Ezsygram &bull; Sell. Automate. Grow. &bull; Made in India 🇮🇳
      </div>
    </div>
  );
}
