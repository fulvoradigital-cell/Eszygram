import Link from "next/link";
import { ArrowLeft, IndianRupee, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PayoutsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
              Payouts & Bank Transfers
            </h1>
            <Badge variant="brand" size="sm">Phase 5</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted">
            Bank account details, settlement cycles, and Razorpay Route transfers.
          </p>
        </div>
      </div>

      <Card className="p-8 sm:p-12 text-center border-slate-border">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
          <IndianRupee className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-navy font-display mb-2">
          Payouts & Banking Settlements
        </h2>
        <p className="text-sm text-slate-muted max-w-md mx-auto mb-6">
          Phase 5 configures your Indian bank account / UPI VPA for T+1 automatic settlements through Razorpay Route and platform fee reconciliation.
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

