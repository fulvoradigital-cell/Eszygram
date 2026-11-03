"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Check,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Camera,
  Globe,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Rocket,
  ShieldCheck,
  AtSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/providers/toast-provider";

const NICHES = [
  "Tech & Coding",
  "Finance & Wealth",
  "Education & Coaching",
  "Fitness & Health",
  "Design & UI/UX",
  "Marketing & Growth",
  "Fashion & Lifestyle",
  "Content & Podcasting",
  "Other",
];

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = React.useState(1);

  // Step 1: Username State
  const [username, setUsername] = React.useState("");
  const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);
  const [usernameStatus, setUsernameStatus] = React.useState<{
    available: boolean;
    reason?: string;
  } | null>(null);

  // Step 2: Profile State
  const [displayName, setDisplayName] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("");

  // Step 3: Niche & Social Links State
  const [niche, setNiche] = React.useState("Tech & Coding");
  const [instagram, setInstagram] = React.useState("");
  const [youtube, setYoutube] = React.useState("");
  const [twitter, setTwitter] = React.useState("");
  const [linkedin, setLinkedin] = React.useState("");
  const [website, setWebsite] = React.useState("");

  // Step 4: Submission State
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Pre-fill user display name from session if available
  React.useEffect(() => {
    if (session?.user?.name && !displayName) {
      setDisplayName(session.user.name);
    }
  }, [session, displayName]);

  // Debounced Username Availability Check
  React.useEffect(() => {
    const clean = username.trim().toLowerCase();

    if (!clean || clean.length < 3) {
      setUsernameStatus(null);
      return;
    }

    setIsCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/creator/check-username?username=${encodeURIComponent(clean)}`
        );
        const json = await res.json();
        if (json.success) {
          setUsernameStatus({
            available: json.data.available,
            reason: json.data.reason,
          });
        }
      } catch {
        setUsernameStatus({
          available: false,
          reason: "Error checking username",
        });
      } finally {
        setIsCheckingUsername(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  // Handle Photo selection/preset
  const handleSelectPreset = (url: string) => {
    setAvatarUrl(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local object URL for instant preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
    }
  };

  // Step Validation Checkers
  const isStep1Valid = Boolean(
    username.trim().length >= 3 &&
      usernameStatus?.available &&
      !isCheckingUsername
  );

  const isStep2Valid = Boolean(displayName.trim().length >= 2);

  const isStep3Valid = Boolean(niche.trim().length > 0);

  // Final Submission
  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        username: username.toLowerCase().trim(),
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.startsWith("http") ? avatarUrl : "",
        niche,
        socialLinks: {
          instagram: instagram.trim(),
          youtube: youtube.trim(),
          twitter: twitter.trim(),
          linkedin: linkedin.trim(),
          website: website.trim(),
        },
        theme: {
          primaryColor: "#6366f1",
          layout: "classic",
          background: "default",
        },
      };

      const res = await fetch("/api/creator/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast({
          title: "Onboarding failed",
          description: json.error?.message || "Could not complete onboarding.",
          variant: "error",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Storefront Activated! 🚀",
        description: `Your link-in-bio is ready at creatorrevenueos.com/${username}`,
        variant: "success",
      });

      // Update client session token so middleware and UI reflect completed onboarding
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          onboardingCompleted: true,
          username: username.toLowerCase().trim(),
        },
      });

      // Redirect directly to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast({
        title: "Network Error",
        description: "Failed to connect to the server. Please try again.",
        variant: "error",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Top Header */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-20">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">
              Creator Revenue <span className="text-brand-600">OS</span>
            </span>
            <Badge variant="accent" className="ml-1 text-[11px]">
              Onboarding
            </Badge>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Step {currentStep} of 4
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-accent-500 transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-xl px-4 pt-8 sm:px-6">
        {/* Step Indicators */}
        <div className="mb-8 flex items-center justify-between">
          {[
            { num: 1, label: "Handle" },
            { num: 2, label: "Profile" },
            { num: 3, label: "Niche" },
            { num: 4, label: "Launch" },
          ].map((item) => (
            <div key={item.num} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  currentStep > item.num
                    ? "bg-emerald-600 text-white"
                    : currentStep === item.num
                    ? "bg-brand-600 text-white shadow-soft"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {currentStep > item.num ? (
                  <Check className="h-4 w-4" />
                ) : (
                  item.num
                )}
              </div>
              <span
                className={`text-[11px] font-semibold ${
                  currentStep >= item.num ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* ================================================================= */}
        {/* STEP 1: CHOOSE USERNAME */}
        {/* ================================================================= */}
        {currentStep === 1 && (
          <Card className="shadow-soft-lg animate-in fade-in duration-300">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
                  <AtSign className="h-3.5 w-3.5" />
                  <span>Step 1</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Claim your creator URL
                </h2>
                <p className="text-sm text-slate-500">
                  This will be your permanent link in bio storefront where followers can buy your digital products &amp; book sessions.
                </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Input
                    label="Username / Handle"
                    placeholder="kabirsingh"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "")
                      )
                    }
                    leftIcon={<span className="text-slate-400 font-bold">@</span>}
                    rightIcon={
                      isCheckingUsername ? (
                        <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                      ) : usernameStatus?.available ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : usernameStatus?.available === false ? (
                        <XCircle className="h-4 w-4 text-rose-600" />
                      ) : null
                    }
                  />
                </div>

                {/* Live Feedback */}
                {usernameStatus && (
                  <div
                    className={`flex items-center gap-2 rounded-xl p-3 text-xs font-medium border ${
                      usernameStatus.available
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                  >
                    {usernameStatus.available ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>@{username}</strong> is available!
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                        <span>{usernameStatus.reason || "Username is not available"}</span>
                      </>
                    )}
                  </div>
                )}

                {/* Preview Box */}
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Your store link:</span>
                  <span className="font-semibold text-brand-700">
                    creatorrevenueos.com/{username || "your-handle"}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!isStep1Valid}
                onClick={() => setCurrentStep(2)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Continue to Profile
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ================================================================= */}
        {/* STEP 2: NAME, BIO, & PHOTO */}
        {/* ================================================================= */}
        {currentStep === 2 && (
          <Card className="shadow-soft-lg animate-in fade-in duration-300">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
                  <Camera className="h-3.5 w-3.5" />
                  <span>Step 2</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Set up your brand profile
                </h2>
                <p className="text-sm text-slate-500">
                  Tell your audience who you are and what you teach or build.
                </p>
              </div>

              {/* Photo Upload / Avatar Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-brand-500 bg-slate-100 shadow-soft">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <Camera className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition">
                      <Camera className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="text-[11px] text-slate-400">
                      JPG, PNG, or select a preset below
                    </p>
                  </div>
                </div>

                {/* Preset Avatars */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Or select preset:
                  </span>
                  <div className="flex gap-2">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`h-8 w-8 rounded-full overflow-hidden border-2 transition ${
                          avatarUrl === preset
                            ? "border-brand-600 scale-105"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset}
                          alt={`Preset ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <Input
                label="Display Name"
                placeholder="e.g. Kabir Singh"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />

              {/* Bio */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Short Bio
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {bio.length} / 500
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Helping engineers build SaaS products & monetize their audience in India 🚀"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition"
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setCurrentStep(1)}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={!isStep2Valid}
                  onClick={() => setCurrentStep(3)}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Next: Socials
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================================================================= */}
        {/* STEP 3: NICHE & SOCIAL LINKS */}
        {/* ================================================================= */}
        {currentStep === 3 && (
          <Card className="shadow-soft-lg animate-in fade-in duration-300">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Step 3</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Select your niche &amp; links
                </h2>
                <p className="text-sm text-slate-500">
                  Connect your existing audience so they can discover your storefront.
                </p>
              </div>

              {/* Niche Chips */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Primary Niche
                </label>
                <div className="flex flex-wrap gap-2">
                  {NICHES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setNiche(item)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                        niche === item
                          ? "bg-brand-600 text-white shadow-soft"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-3.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Social Channels
                </label>

                <Input
                  placeholder="Instagram handle (e.g. kabir.dev)"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  leftIcon={<Instagram className="h-4 w-4 text-pink-600" />}
                />

                <Input
                  placeholder="YouTube channel or handle"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  leftIcon={<Youtube className="h-4 w-4 text-red-600" />}
                />

                <Input
                  placeholder="Twitter / X handle"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  leftIcon={<Twitter className="h-4 w-4 text-sky-500" />}
                />

                <Input
                  placeholder="LinkedIn profile URL or username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  leftIcon={<Linkedin className="h-4 w-4 text-blue-600" />}
                />

                <Input
                  placeholder="Personal website or portfolio URL"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  leftIcon={<Globe className="h-4 w-4 text-slate-500" />}
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setCurrentStep(2)}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={!isStep3Valid}
                  onClick={() => setCurrentStep(4)}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Review &amp; Finish
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================================================================= */}
        {/* STEP 4: FINISH & LAUNCH */}
        {/* ================================================================= */}
        {currentStep === 4 && (
          <Card className="shadow-soft-lg animate-in fade-in duration-300">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white shadow-soft">
                  <Rocket className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Ready to launch your OS!
                </h2>
                <p className="text-sm text-slate-500">
                  Here is a preview of your brand card before activating your dashboard.
                </p>
              </div>

              {/* Preview Card */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-brand-500 bg-slate-100 shadow-sm">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <Camera className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {displayName || "Your Name"}
                    </h3>
                    <p className="text-xs font-semibold text-brand-600">
                      @{username}
                    </p>
                    <Badge variant="accent" className="mt-1 text-[10px]">
                      {niche}
                    </Badge>
                  </div>
                </div>

                {bio && (
                  <p className="mt-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {bio}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs text-slate-500 border border-slate-100">
                  <span>Storefront URL:</span>
                  <span className="font-bold text-slate-900">
                    creatorrevenueos.com/{username}
                  </span>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2 rounded-2xl bg-brand-50/50 p-4 border border-brand-100 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>0-friction UPI instant checkout ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Mobile-optimized link in bio storefront</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Digital products, 1:1 calls, and paid communities support</span>
                </div>
              </div>

              {/* Final Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setCurrentStep(3)}
                  disabled={isSubmitting}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-brand-600 to-brand-700"
                  isLoading={isSubmitting}
                  onClick={handleCompleteOnboarding}
                  rightIcon={<Sparkles className="h-4 w-4" />}
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
