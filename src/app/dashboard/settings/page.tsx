"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Settings, Save, Shield, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/providers/toast-provider";

export default function SettingsDashboardPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [name, setName] = React.useState(session?.user?.name || "");
  const [email] = React.useState(session?.user?.email || "");
  const [username, setUsername] = React.useState(session?.user?.username || "");

  React.useEffect(() => {
    if (session?.user) {
      if (!name) setName(session.user.name || "");
      if (!username) setUsername(session.user.username || "");
    }
  }, [session, name, username]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings Saved",
      description: "Profile updates will be synced across your storefront.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500">
          Manage your personal creator details, login credentials, and domain configuration.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-brand-600" />
              Creator Information
            </CardTitle>
            <CardDescription>
              Your public identification and login credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email Address"
              value={email}
              disabled
              helperText="Email is bound to your account login"
            />
            <Input
              label="Store Handle"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              helperText="Your public URL: creatorrevenueos.com/{username}"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-brand-600" />
              Custom Domain (Pro)
            </CardTitle>
            <CardDescription>
              Connect your own domain name (e.g. store.kabirsingh.in) via Cloudflare CNAME.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="e.g. store.yourbrand.in"
              helperText="Requires Creator Pro plan"
              disabled
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            leftIcon={<Save className="h-4 w-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

