import Link from "next/link";
import { ArrowLeft, Settings, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
              Settings
            </h1>
            <Badge variant="neutral" size="sm">Account & Store</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted">
            Manage your creator profile, subscription plan, notifications, and security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-6 border-slate-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-navy font-display">Profile & Bio</h2>
              <p className="text-xs text-slate-muted">Display name, bio, and social links</p>
            </div>
          </div>
          <p className="text-xs text-slate-muted mb-4 leading-relaxed">
            Update your public profile details, social icons, and niche preferences configured during onboarding.
          </p>
          <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold">
            <Link href="/onboarding">Edit Onboarding Profile</Link>
          </Button>
        </Card>

        <Card className="p-6 border-slate-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-navy font-display">Security & Auth</h2>
              <p className="text-xs text-slate-muted">Password and Google login</p>
            </div>
          </div>
          <p className="text-xs text-slate-muted mb-4 leading-relaxed">
            Your account is secured with Auth.js JWT sessions and bcrypt-hashed password protection.
          </p>
          <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold">
            <Link href="/auth/forgot-password">Reset Password</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}

