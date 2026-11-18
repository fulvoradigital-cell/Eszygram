"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Check,
  CheckCircle2,
  Copy,
  Crown,
  ExternalLink,
  Globe,
  Instagram,
  Key,
  Layers,
  Linkedin,
  Loader2,
  Lock,
  Save,
  Shield,
  ShieldCheck,
  Sparkles,
  Store,
  Twitter,
  User,
  Youtube,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/components/providers/ToastProvider";
import { PLAN_CATALOG, PLAN_LIST, type BillingCycle } from "@/lib/plans";
import type { CreatorNiche, CreatorProfileDTO, UserPlan } from "@/types";

interface SettingsManagerProps {
  initialProfile: CreatorProfileDTO;
  userEmail: string;
  userPlan: UserPlan;
  planExpiresAt?: string | null;
  initialTab?: "profile" | "security" | "billing";
}

const NICHES = [
  { id: "coaching", label: "Coaching & Consulting" },
  { id: "courses", label: "Online Courses & Education" },
  { id: "fitness", label: "Fitness, Health & Nutrition" },
  { id: "design", label: "Design, UI/UX & Art" },
  { id: "tech", label: "Tech, AI & Programming" },
  { id: "finance", label: "Personal Finance & Crypto" },
  { id: "content", label: "Content Creation & Media" },
  { id: "photography", label: "Photography & Filmmaking" },
  { id: "astrology", label: "Astrology & Tarot" },
  { id: "culinary", label: "Food, Cooking & Recipes" },
  { id: "other", label: "Other Digital Business" },
];

export function SettingsManager({
  initialProfile,
  userEmail,
  userPlan,
  planExpiresAt: initialPlanExpiresAt = null,
  initialTab = "profile",
}: SettingsManagerProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "billing">(initialTab);

  // Plan & Billing state
  const [currentPlan, setCurrentPlan] = useState<UserPlan>(userPlan);
  const [currentPlanExpiresAt, setCurrentPlanExpiresAt] = useState<string | null>(
    initialPlanExpiresAt
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [upgradingPlan, setUpgradingPlan] = useState<UserPlan | null>(null);
  const [mockUpgradeModal, setMockUpgradeModal] = useState<{
    plan: "pro" | "business";
    billingCycle: BillingCycle;
    razorpayOrderId: string;
    amountInr: number;
  } | null>(null);
  const [isVerifyingUpgrade, setIsVerifyingUpgrade] = useState(false);

  // Load Razorpay Checkout script when on billing tab
  useEffect(() => {
    if (activeTab === "billing" && typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [activeTab]);

  // Profile Form
  const [displayName, setDisplayName] = useState(initialProfile.displayName || "");
  const [bio, setBio] = useState(initialProfile.bio || "");
  const [niche, setNiche] = useState<CreatorNiche>(initialProfile.niche || "other");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl || "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialProfile.coverImageUrl || "");

  // Social Links
  const getSocialUrl = (platform: string) => {
    return initialProfile.socialLinks?.find((s) => s.platform === platform)?.url || "";
  };
  const [instagramUrl, setInstagramUrl] = useState(getSocialUrl("instagram"));
  const [youtubeUrl, setYoutubeUrl] = useState(getSocialUrl("youtube"));
  const [twitterUrl, setTwitterUrl] = useState(getSocialUrl("twitter"));
  const [linkedinUrl, setLinkedinUrl] = useState(getSocialUrl("linkedin"));
  const [websiteUrl, setWebsiteUrl] = useState(getSocialUrl("website"));

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleCopyStoreLink = async () => {
    const fullUrl = `https://ezsygram.com/${initialProfile.username}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast.success("Link Copied", "Storefront URL copied to clipboard.");
    } catch {
      toast.error("Copy Failed", "Please copy manually.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);

      const socialLinks = [
        { platform: "instagram", url: instagramUrl },
        { platform: "youtube", url: youtubeUrl },
        { platform: "twitter", url: twitterUrl },
        { platform: "linkedin", url: linkedinUrl },
        { platform: "website", url: websiteUrl },
      ].filter((s) => s.url.trim().length > 0);

      const res = await fetch("/api/creator/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          bio: bio.trim(),
          niche,
          avatarUrl: avatarUrl.trim(),
          coverImageUrl: coverImageUrl.trim(),
          socialLinks,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update profile.");
      }

      toast.success(
        "Profile Updated",
        "Your public creator profile details have been saved."
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error saving profile";
      toast.error("Update Failed", message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password Length", "New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Password Mismatch", "New passwords do not match.");
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await fetch("/api/creator/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to change password.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(
        "Password Changed",
        "Your account password has been updated successfully."
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error changing password";
      toast.error("Password Error", message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const verifyPlanPayment = async (payload: {
    plan: "pro" | "business";
    billingCycle: BillingCycle;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    const verifyRes = await fetch("/api/creator/billing/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const verifyJson = await verifyRes.json();
    if (!verifyRes.ok || !verifyJson.success) {
      throw new Error(verifyJson.error?.message || "Payment verification failed.");
    }

    setCurrentPlan(verifyJson.data.plan);
    setCurrentPlanExpiresAt(verifyJson.data.planExpiresAt);
    await updateSession();
    router.refresh();
    toast.success(
      `Upgraded to ${verifyJson.data.planName}!`,
      "Your new plan features and lower platform fees are now active."
    );
  };

  const handleSelectPlan = async (targetPlan: UserPlan) => {
    if (targetPlan === currentPlan) return;

    if (
      targetPlan === "free" &&
      !confirm(
        "Are you sure you want to downgrade to the Starter (Free) plan? Your existing products stay safe, and standard platform fees will apply."
      )
    ) {
      return;
    }

    try {
      setUpgradingPlan(targetPlan);
      const res = await fetch("/api/creator/billing/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: targetPlan,
          billingCycle,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to initiate plan change.");
      }

      const data = json.data;

      // Immediate activation (e.g. downgrade to Free)
      if (data.activated) {
        setCurrentPlan(data.plan);
        setCurrentPlanExpiresAt(data.planExpiresAt);
        await updateSession();
        router.refresh();
        toast.success("Plan Updated", `You are now on the ${PLAN_CATALOG[targetPlan].name} plan.`);
        return;
      }

      const paidPlan = targetPlan as "pro" | "business";
      const { razorpayOrderId, amountPaise, amountInr, keyId } = data;

      // Use Razorpay live checkout if real keys and SDK are loaded
      if (
        typeof window !== "undefined" &&
        window.Razorpay &&
        keyId &&
        !keyId.includes("mock") &&
        razorpayOrderId &&
        !razorpayOrderId.includes("mock")
      ) {
        const options = {
          key: keyId,
          amount: amountPaise,
          currency: "INR",
          name: "Ezsygram",
          description: `${PLAN_CATALOG[paidPlan].name} (${billingCycle === "yearly" ? "Annual" : "Monthly"})`,
          order_id: razorpayOrderId,
          prefill: {
            name: displayName || initialProfile.displayName,
            email: userEmail,
          },
          theme: { color: "#6D28D9" },
          handler: async (response: {
            razorpay_order_id?: string;
            razorpay_payment_id?: string;
            razorpay_signature?: string;
          }) => {
            try {
              setIsVerifyingUpgrade(true);
              await verifyPlanPayment({
                plan: paidPlan,
                billingCycle,
                razorpay_order_id: response.razorpay_order_id || razorpayOrderId,
                razorpay_payment_id: response.razorpay_payment_id || "",
                razorpay_signature: response.razorpay_signature || "",
              });
            } catch (err: unknown) {
              toast.error(
                "Verification Error",
                err instanceof Error ? err.message : "Could not verify payment."
              );
            } finally {
              setIsVerifyingUpgrade(false);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Test / dev mode confirmation dialog
        setMockUpgradeModal({
          plan: paidPlan,
          billingCycle,
          razorpayOrderId: razorpayOrderId || `order_mock_${Date.now()}`,
          amountInr,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Plan upgrade failed.";
      toast.error("Upgrade Error", msg);
    } finally {
      setUpgradingPlan(null);
    }
  };

  const handleCompleteMockUpgrade = async () => {
    if (!mockUpgradeModal) return;
    try {
      setIsVerifyingUpgrade(true);
      await verifyPlanPayment({
        plan: mockUpgradeModal.plan,
        billingCycle: mockUpgradeModal.billingCycle,
        razorpay_order_id: mockUpgradeModal.razorpayOrderId,
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_signature: "mock_signature",
      });
      setMockUpgradeModal(null);
    } catch (err: unknown) {
      toast.error(
        "Upgrade Failed",
        err instanceof Error ? err.message : "Could not activate plan."
      );
    } finally {
      setIsVerifyingUpgrade(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display mb-1">
          Account &amp; Store Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted">
          Manage your creator profile, bio links, security credentials, and plan subscription.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-border pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 min-h-[36px] ${
            activeTab === "profile"
              ? "bg-brand-violet text-white"
              : "text-slate-muted hover:text-slate-text"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Profile &amp; Bio
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 min-h-[36px] ${
            activeTab === "security"
              ? "bg-brand-violet text-white"
              : "text-slate-muted hover:text-slate-text"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          Security &amp; Password
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("billing")}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 min-h-[36px] ${
            activeTab === "billing"
              ? "bg-brand-violet text-white"
              : "text-slate-muted hover:text-slate-text"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Plan &amp; Fees
        </button>
      </div>

      {/* TAB 1: Profile & Bio */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Storefront Link Callout Card */}
          <Card className="p-4 sm:p-5 border-slate-border bg-canvas/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-navy">Your Live Storefront URL</div>
                <div className="text-xs font-mono text-brand-violet mt-0.5">
                  https://ezsygram.com/{initialProfile.username}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopyStoreLink}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-semibold"
                >
                  {copiedLink ? (
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 mr-1" />
                  )}
                  {copiedLink ? "Copied" : "Copy Link"}
                </Button>
                <Button asChild size="sm" variant="default" className="h-8 text-xs font-semibold bg-brand-violet">
                  <Link href={`/${initialProfile.username}`} target="_blank">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    Visit
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Edit Profile Form */}
          <Card className="p-6 border-slate-border">
            <h2 className="text-base font-bold text-navy font-display mb-4">
              Creator Profile Information
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1.5">
                    Creator Niche
                  </label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value as CreatorNiche)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20 font-medium"
                  >
                    {NICHES.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-navy">
                    Bio Description
                  </label>
                  <span className="text-[11px] text-slate-muted">
                    {bio.length}/250 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={250}
                  placeholder="Share a short headline about what you create or teach..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20 leading-relaxed"
                />
              </div>

              <div className="space-y-4 pt-1">
                <ImageUpload
                  label="Profile Picture / Avatar"
                  description="Your avatar appears on your storefront header, mobile preview, and customer order receipts."
                  variant="avatar"
                  value={avatarUrl}
                  onChange={setAvatarUrl}
                />

                <ImageUpload
                  label="Storefront Cover Banner (Optional)"
                  description="A prominent cover banner displayed at the top of your public storefront behind your profile avatar (1200×630 recommended)."
                  variant="cover"
                  value={coverImageUrl}
                  onChange={setCoverImageUrl}
                />
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-border">
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-3">
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-muted mb-1 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-500" />
                      Instagram Handle / URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/..."
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-muted mb-1 flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-red-500" />
                      YouTube Channel
                    </label>
                    <input
                      type="text"
                      placeholder="https://youtube.com/@..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-muted mb-1 flex items-center gap-1.5">
                      <Twitter className="w-3.5 h-3.5 text-sky-500" />
                      X (Twitter)
                    </label>
                    <input
                      type="text"
                      placeholder="https://x.com/..."
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-muted mb-1 flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                      LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/..."
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSavingProfile}
                  size="sm"
                  className="bg-brand-violet hover:bg-brand-violet/90 text-white font-semibold text-xs"
                >
                  {isSavingProfile ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* TAB 2: Security & Password */}
      {activeTab === "security" && (
        <div className="max-w-xl space-y-6">
          <Card className="p-6 border-slate-border">
            <h2 className="text-base font-bold text-navy font-display mb-1">
              Account Credentials
            </h2>
            <p className="text-xs text-slate-muted mb-4">
              Registered email: <span className="font-semibold text-navy">{userEmail}</span>
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  size="sm"
                  className="bg-brand-violet hover:bg-brand-violet/90 text-white font-semibold text-xs"
                >
                  {isChangingPassword ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Key className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* TAB 3: Plan & Fees */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          {/* Active Subscription Banner + Billing Cycle Toggle */}
          <Card className="p-5 border-slate-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-navy font-display">
                  Current Plan: {PLAN_CATALOG[currentPlan].name}
                </span>
                <Badge
                  variant={
                    currentPlan === "business"
                      ? "accent"
                      : currentPlan === "pro"
                      ? "brand"
                      : "neutral"
                  }
                  size="sm"
                  className="uppercase"
                >
                  {currentPlan}
                </Badge>
              </div>
              <p className="text-xs text-slate-muted">
                {PLAN_CATALOG[currentPlan].feeLabel}
                {currentPlanExpiresAt && currentPlan !== "free" && (
                  <>
                    {" "}
                    • Renews on{" "}
                    <span className="font-semibold text-navy">
                      {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                        new Date(currentPlanExpiresAt)
                      )}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Monthly / Yearly Toggle */}
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-canvas border border-slate-border self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-brand-violet text-white shadow-xs"
                    : "text-slate-muted hover:text-navy"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-brand-violet text-white shadow-xs"
                    : "text-slate-muted hover:text-navy"
                }`}
              >
                <span>Yearly</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    billingCycle === "yearly"
                      ? "bg-white/20 text-white"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  2 mo free
                </span>
              </button>
            </div>
          </Card>

          {/* 3-Tier Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {PLAN_LIST.map((planDef) => {
              const isCurrent = currentPlan === planDef.id;
              const price =
                billingCycle === "yearly"
                  ? planDef.yearlyPriceInr
                  : planDef.monthlyPriceInr;
              const periodLabel = billingCycle === "yearly" ? "/yr" : "/mo";
              const isBusy = upgradingPlan === planDef.id;
              const planOrder: Record<UserPlan, number> = { free: 0, pro: 1, business: 2 };
              const isDowngrade = planOrder[planDef.id] < planOrder[currentPlan];

              return (
                <Card
                  key={planDef.id}
                  className={`p-5 sm:p-6 border-slate-border flex flex-col justify-between relative overflow-hidden ${
                    isCurrent
                      ? "ring-2 ring-brand-violet"
                      : planDef.popular
                      ? "bg-gradient-to-br from-brand-violet/5 via-card to-canvas border-brand-violet/40"
                      : ""
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-base font-bold text-navy font-display flex items-center gap-1.5">
                          {planDef.id === "pro" && (
                            <Sparkles className="w-4 h-4 text-brand-violet shrink-0" />
                          )}
                          {planDef.id === "business" && (
                            <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          <span>{planDef.name}</span>
                        </h3>
                        <p className="text-xs text-slate-muted mt-0.5">{planDef.tagline}</p>
                      </div>
                      {planDef.popular && !isCurrent && (
                        <Badge variant="brand" size="sm">
                          Popular
                        </Badge>
                      )}
                    </div>

                    <div className="mb-1">
                      <span className="text-3xl font-extrabold text-navy font-display">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      {price > 0 && (
                        <span className="text-xs font-semibold text-slate-muted ml-1">
                          {periodLabel}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-brand-violet mb-5">
                      {planDef.feeLabel}
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-muted mb-6">
                      {planDef.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-navy">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    {isCurrent ? (
                      <Badge variant="brand" className="w-full justify-center py-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Current Active Plan</span>
                      </Badge>
                    ) : (
                      <Button
                        type="button"
                        variant={isDowngrade ? "outline" : "primary"}
                        size="sm"
                        disabled={Boolean(upgradingPlan) || isVerifyingUpgrade}
                        onClick={() => handleSelectPlan(planDef.id)}
                        className={`w-full text-xs font-semibold ${
                          !isDowngrade
                            ? "bg-brand-violet hover:bg-brand-violet/90 text-white shadow-brand"
                            : ""
                        }`}
                      >
                        {isBusy ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : isDowngrade ? (
                          <span>Downgrade to {planDef.name}</span>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" />
                            <span>
                              Upgrade to {planDef.name} (₹{price.toLocaleString("en-IN")}
                              {periodLabel})
                            </span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Test Mode Plan Upgrade Confirmation Modal */}
      <Modal
        open={Boolean(mockUpgradeModal)}
        onClose={() => !isVerifyingUpgrade && setMockUpgradeModal(null)}
        title="Confirm Plan Upgrade (Test Mode)"
        description="Razorpay live keys are not configured. Simulate payment below to activate your upgraded plan immediately."
        size="sm"
      >
        {mockUpgradeModal && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-subtle border border-slate-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-muted">Selected Plan</span>
                <span className="font-bold text-navy">
                  {PLAN_CATALOG[mockUpgradeModal.plan].name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-muted">Billing Cycle</span>
                <span className="font-semibold text-navy capitalize">
                  {mockUpgradeModal.billingCycle}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-border">
                <span className="font-bold text-navy">Total Amount</span>
                <span className="text-base font-extrabold text-brand-violet">
                  ₹{mockUpgradeModal.amountInr.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-muted">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Instant activation • Your session and platform fee update right away.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isVerifyingUpgrade}
                onClick={() => setMockUpgradeModal(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={isVerifyingUpgrade}
                onClick={handleCompleteMockUpgrade}
                className="shadow-brand"
              >
                {isVerifyingUpgrade ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Activating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Complete Upgrade</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
