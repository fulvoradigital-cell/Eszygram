"use client";

import * as React from "react";
import { IndianRupee, ArrowDownToLine, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";

export default function PayoutsDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Payouts &amp; Settlements
          </h1>
          <p className="text-sm text-slate-500">
            Real-time automated settlements directly to your registered Indian bank account or UPI VPA.
          </p>
        </div>

        <Button variant="accent" size="sm" leftIcon={<ArrowDownToLine className="h-4 w-4" />}>
          Instant Withdraw
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-brand-900 to-slate-900 text-white">
          <CardContent className="p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-300">
              Available for Payout
            </span>
            <div className="mt-2 text-3xl font-black text-white">
              {formatINR(28450)}
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Next automatic settlement: Tomorrow, 10:00 AM IST
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Razorpay T+1 Settlement Active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Registered Settlement Account
            </CardTitle>
            <CardDescription>
              Direct transfer destination for your creator earnings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Settlement Method</span>
              <span className="font-bold text-slate-900">UPI Fast Settlement (VPA)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">UPI Handle</span>
              <span className="font-mono font-semibold text-slate-800">creator@okhdfcbank</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">KYC Status</span>
              <Badge variant="success">Verified</Badge>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Platform Fee</span>
              <span className="font-semibold text-slate-700">5% per transaction</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

