import Link from "next/link";
import { ArrowLeft, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AutomationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
              Instagram Automations
            </h1>
            <Badge variant="accent" size="sm">Phase 6</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted">
            Auto-reply to Instagram post comments and automatically DM product buy links.
          </p>
        </div>
      </div>

      <Card className="p-8 sm:p-12 text-center border-slate-border">
        <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center mx-auto mb-4">
          <Zap className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-navy font-display mb-2">
          Instagram Comment-to-DM Engine
        </h2>
        <p className="text-sm text-slate-muted max-w-md mx-auto mb-6">
          Phase 6 connects your Instagram Business account via Meta Graph API, listens to live webhook comments, filters trigger keywords (e.g. &quot;LINK&quot; or &quot;COURSE&quot;), and instantly dispatches DM checkout cards.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Dashboard
          </Link>
        </Button>
      </Card>
    </div>
  );
}

