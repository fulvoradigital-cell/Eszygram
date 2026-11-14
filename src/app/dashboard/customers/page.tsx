import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
              Customers & Leads
            </h1>
            <Badge variant="brand" size="sm">Phase 7</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted">
            Audience contact list, lead magnet subscribers, and CSV export.
          </p>
        </div>
      </div>

      <Card className="p-8 sm:p-12 text-center border-slate-border">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <Users className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-navy font-display mb-2">
          Audience & Customer Management
        </h2>
        <p className="text-sm text-slate-muted max-w-md mx-auto mb-6">
          Phase 7 builds your unified buyer list, captured WhatsApp & email leads, purchase histories, and one-click CSV export.
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

