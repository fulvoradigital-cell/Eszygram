"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Copy,
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
import { useToast } from "@/components/providers/ToastProvider";
import type { CreatorNiche, CreatorProfileDTO } from "@/types";

interface SettingsManagerProps {
  initialProfile: CreatorProfileDTO;
  userEmail: string;
  userPlan: string;
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
}: SettingsManagerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "billing">("profile");

  // Profile Form
  const [displayName, setDisplayName] = useState(initialProfile.displayName || "");
  const [bio, setBio] = useState(initialProfile.bio || "");
  const [niche, setNiche] = useState<CreatorNiche>(initialProfile.niche || "other");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl || "");

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

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">
                  Avatar / Profile Picture URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={`p-6 border-slate-border relative overflow-hidden ${userPlan === "free" ? "ring-2 ring-brand-violet" : ""}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-navy font-display">Starter Plan</h3>
                <p className="text-xs text-slate-muted">Ideal for new Indian creators &amp; coaches</p>
              </div>
              <Badge variant="neutral" size="sm">₹0 / month</Badge>
            </div>

            <div className="text-2xl font-extrabold text-navy font-display mb-4">
              5% <span className="text-xs font-normal text-slate-muted">platform fee per sale</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-muted mb-6">
              <li className="flex items-center gap-2 text-navy">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Unlimited digital products &amp; courses
              </li>
              <li className="flex items-center gap-2 text-navy">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Instant UPI &amp; card payment checkout
              </li>
              <li className="flex items-center gap-2 text-navy">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Automated T+1 daily bank settlements
              </li>
              <li className="flex items-center gap-2 text-navy">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Up to 3 active Instagram comment triggers
              </li>
            </ul>

            {userPlan === "free" ? (
              <Badge variant="brand" className="w-full justify-center py-2">
                Current Active Plan
              </Badge>
            ) : (
              <Button variant="outline" size="sm" className="w-full text-xs">
                Downgrade
              </Button>
            )}
          </Card>

          <Card className="p-6 border-slate-border bg-gradient-to-br from-brand-violet/5 via-card to-canvas relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-navy font-display flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-violet" />
                  Creator Pro
                </h3>
                <p className="text-xs text-slate-muted">For scaling coaches, educators &amp; stores</p>
              </div>
              <Badge variant="brand" size="sm">₹999 / mo</Badge>
            </div>

            <div className="text-2xl font-extrabold text-brand-violet font-display mb-4">
              0% <span className="text-xs font-normal text-slate-muted">platform fee (Keep 100% of sales)</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-muted mb-6">
              <li className="flex items-center gap-2 text-navy">
                <Check className="w-4 h-4 text-brand-violet" />
                0% platform fee on all sales
              </li>
              <li className="flex items-center gap-2 text-navy">
                <Check className="w-4 h-4 text-brand-violet" />
                Unlimited Instagram comment-to-DM triggers
              </li>
              <li className="flex items-center gap-2 text-navy">
                <Check className="w-4 h-4 text-brand-violet" />
                Priority T+0 same-day settlement routing
              </li>
              <li className="flex items-center gap-2 text-navy">
                <Check className="w-4 h-4 text-brand-violet" />
                Custom domain mapping (e.g. store.yourbrand.com)
              </li>
            </ul>

            <Button size="sm" className="w-full bg-brand-violet hover:bg-brand-violet/90 text-white font-semibold text-xs">
              Upgrade to Pro (₹999/mo)
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
