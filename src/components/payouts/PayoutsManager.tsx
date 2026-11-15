"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Building,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  HelpCircle,
  IndianRupee,
  Info,
  Loader2,
  Lock,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Smartphone,
  Wallet,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/providers/ToastProvider";
import type {
  PayoutAccountDTO,
  PayoutDTO,
  PayoutMethod,
  PayoutSummaryDTO,
} from "@/types";

interface PayoutsManagerProps {
  initialAccount: PayoutAccountDTO | null;
  initialSummary: PayoutSummaryDTO;
  initialPayouts: PayoutDTO[];
  creatorUsername: string;
}

export function PayoutsManager({
  initialAccount,
  initialSummary,
  initialPayouts,
  creatorUsername,
}: PayoutsManagerProps) {
  const { toast } = useToast();
  const [account, setAccount] = useState<PayoutAccountDTO | null>(initialAccount);
  const [summary, setSummary] = useState<PayoutSummaryDTO>(initialSummary);
  const [payouts, setPayouts] = useState<PayoutDTO[]>(initialPayouts);

  // Form State
  const [method, setMethod] = useState<PayoutMethod>(
    initialAccount?.payoutMethod || "bank_account"
  );
  const [holderName, setHolderName] = useState(
    initialAccount?.bankAccount?.accountHolderName || ""
  );
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState(
    initialAccount?.bankAccount?.ifscCode || ""
  );
  const [bankName, setBankName] = useState(
    initialAccount?.bankAccount?.bankName || ""
  );
  const [accountType, setAccountType] = useState<"savings" | "current">(
    initialAccount?.bankAccount?.accountType || "savings"
  );
  const [upiVpa, setUpiVpa] = useState(initialAccount?.upiVpa || "");
  const [panNumber, setPanNumber] = useState("");
  const [gstin, setGstin] = useState(initialAccount?.gstin || "");
  const [autoPayout, setAutoPayout] = useState(
    initialAccount?.autoPayoutEnabled ?? true
  );

  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(
    summary.availableBalanceInr > 0 ? String(summary.availableBalanceInr) : "500"
  );
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (method === "bank_account") {
      if (accountNumber && accountNumber !== confirmAccountNumber) {
        toast.error("Account Mismatch", "Bank account numbers do not match.");
        return;
      }
      if (!account?.bankAccount && !accountNumber) {
        toast.error("Account Required", "Please enter your bank account number.");
        return;
      }
    }

    try {
      setIsSavingAccount(true);
      const payload: Record<string, unknown> = {
        payoutMethod: method,
        autoPayoutEnabled: autoPayout,
        minimumPayoutInr: 500,
      };

      if (method === "bank_account") {
        payload.accountHolderName = holderName.trim();
        if (accountNumber) payload.accountNumber = accountNumber.trim();
        payload.ifscCode = ifscCode.trim().toUpperCase();
        payload.bankName = bankName.trim();
        payload.accountType = accountType;
      } else {
        payload.upiVpa = upiVpa.trim().toLowerCase();
      }

      if (panNumber) payload.panNumber = panNumber.trim().toUpperCase();
      if (gstin) payload.gstin = gstin.trim().toUpperCase();

      const res = await fetch("/api/creator/payouts/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update payout account.");
      }

      setAccount(json.data);
      setAccountNumber("");
      setConfirmAccountNumber("");
      setPanNumber("");
      toast.success(
        "Payout Settings Saved",
        "Your bank/UPI settlement details have been updated."
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error saving account";
      toast.error("Failed to save", message);
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(withdrawAmount, 10);
    if (isNaN(amount) || amount < 100) {
      toast.error("Invalid Amount", "Minimum payout request is ₹100.");
      return;
    }

    try {
      setIsSubmittingWithdraw(true);
      const res = await fetch("/api/creator/payouts/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInr: amount }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to submit payout request.");
      }

      setPayouts((prev) => [json.data, ...prev]);
      setSummary((prev) => ({
        ...prev,
        availableBalancePaise: Math.max(0, prev.availableBalancePaise - amount * 100),
        availableBalanceInr: Math.max(0, prev.availableBalanceInr - amount),
        pendingPayoutPaise: prev.pendingPayoutPaise + amount * 100,
        pendingPayoutInr: prev.pendingPayoutInr + amount,
      }));

      setIsWithdrawModalOpen(false);
      toast.success(
        "Payout Requested",
        `₹${amount.toLocaleString("en-IN")} will be transferred to your account via T+1 settlement.`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Payout request failed";
      toast.error("Request Failed", message);
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
              Payouts &amp; Bank Settlements
            </h1>
            <Badge variant="success" size="sm">T+1 Auto-Route</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted">
            Manage your Indian bank account or UPI VPA for daily automated payouts from UPI store sales.
          </p>
        </div>

        <Button
          onClick={() => setIsWithdrawModalOpen(true)}
          disabled={summary.availableBalanceInr < 100 || !summary.payoutAccountConfigured}
          size="sm"
          className="bg-brand-violet hover:bg-brand-violet/90 text-white font-semibold text-xs min-h-[40px] shadow-sm"
        >
          <IndianRupee className="w-3.5 h-3.5 mr-1" />
          Request Withdrawal
        </Button>
      </div>

      {/* 3 Settlement Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Available Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-navy font-display">
            ₹{summary.availableBalanceInr.toLocaleString("en-IN")}
          </div>
          <div className="mt-2 text-[11px] text-slate-muted flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Next settlement: {summary.nextSettlementDate}</span>
          </div>
        </Card>

        <Card className="p-5 border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              In-Transit Payouts
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-navy font-display">
            ₹{summary.pendingPayoutInr.toLocaleString("en-IN")}
          </div>
          <div className="mt-2 text-[11px] text-slate-muted">
            <span>Processing via Razorpay Route</span>
          </div>
        </Card>

        <Card className="p-5 border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Lifetime Settled
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-violet/10 text-brand-violet flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-navy font-display">
            ₹{summary.totalSettledInr.toLocaleString("en-IN")}
          </div>
          <div className="mt-2 text-[11px] text-slate-muted">
            <span>Directly deposited to bank account</span>
          </div>
        </Card>
      </div>

      {/* Payout Account Configuration Form */}
      <Card className="p-6 border-slate-border">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-border">
          <div>
            <h2 className="text-base font-bold text-navy font-display flex items-center gap-2">
              <Building className="w-4 h-4 text-brand-violet" />
              Settlement Destination
            </h2>
            <p className="text-xs text-slate-muted mt-0.5">
              Choose how you want to receive your earnings in India
            </p>
          </div>
          {account?.isVerified && (
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Verified
            </Badge>
          )}
        </div>

        {/* Method Toggle Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6 max-w-md">
          <button
            type="button"
            onClick={() => setMethod("bank_account")}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              method === "bank_account"
                ? "border-brand-violet bg-brand-violet/5 ring-1 ring-brand-violet text-brand-violet"
                : "border-slate-border text-slate-muted hover:border-slate-border-hover"
            }`}
          >
            <Building className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-navy">Bank Account</div>
              <div className="text-[11px] text-slate-muted">NEFT / IMPS Transfer</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMethod("upi")}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              method === "upi"
                ? "border-brand-violet bg-brand-violet/5 ring-1 ring-brand-violet text-brand-violet"
                : "border-slate-border text-slate-muted hover:border-slate-border-hover"
            }`}
          >
            <Smartphone className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-navy">UPI VPA</div>
              <div className="text-[11px] text-slate-muted">Instant Virtual Address</div>
            </div>
          </button>
        </div>

        <form onSubmit={handleSaveAccount} className="space-y-4">
          {method === "bank_account" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="As per bank passbook"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">
                  Account Number {account?.bankAccount && <span className="text-slate-muted font-normal">(Current: {account.bankAccount.accountNumberMasked})</span>}
                </label>
                <input
                  type="password"
                  placeholder={account?.bankAccount ? "Enter new number to change" : "9 to 18 digit account number"}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">
                  Confirm Account Number
                </label>
                <input
                  type="text"
                  placeholder="Re-enter bank account number"
                  value={confirmAccountNumber}
                  onChange={(e) => setConfirmAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">
                  IFSC Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC0001234"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  maxLength={11}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">
                  Account Type
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as "savings" | "current")}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20 font-medium"
                >
                  <option value="savings">Savings Account</option>
                  <option value="current">Current Account</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="max-w-md">
              <label className="block text-xs font-bold text-navy mb-1.5">
                UPI ID (Virtual Payment Address)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. username@okhdfcbank or 9876543210@paytm"
                  value={upiVpa}
                  onChange={(e) => setUpiVpa(e.target.value.toLowerCase())}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-muted mt-1">
                Settlements will be transferred automatically to this UPI handle.
              </p>
            </div>
          )}

          {/* Tax Compliance Section (Optional) */}
          <div className="pt-4 mt-4 border-t border-slate-border">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-3">
              Tax &amp; Compliance Details (Optional)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">
                  PAN Number {account?.panNumberMasked && <span className="text-slate-muted font-normal">({account.panNumberMasked})</span>}
                </label>
                <input
                  type="text"
                  placeholder="10-digit PAN (e.g. ABCDE1234F)"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20 font-mono uppercase"
                />
                <span className="text-[10px] text-slate-muted mt-0.5 block">
                  Required for TDS 194O tax credit reconciliation.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">
                  GSTIN (If registered)
                </label>
                <input
                  type="text"
                  placeholder="15-character GSTIN"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  maxLength={15}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20 font-mono uppercase"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={autoPayout}
                onChange={(e) => setAutoPayout(e.target.checked)}
                className="w-4 h-4 rounded text-brand-violet border-slate-border focus:ring-brand-violet/20"
              />
              <span className="font-semibold text-navy">
                Enable automated T+1 daily settlements
              </span>
            </label>

            <Button
              type="submit"
              disabled={isSavingAccount}
              size="sm"
              className="bg-brand-violet hover:bg-brand-violet/90 text-white font-semibold text-xs"
            >
              {isSavingAccount ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
              )}
              Save Settlement Details
            </Button>
          </div>
        </form>
      </Card>

      {/* Settlement History Table */}
      <Card className="p-6 border-slate-border">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-border">
          <div>
            <h2 className="text-base font-bold text-navy font-display">Payout History</h2>
            <p className="text-xs text-slate-muted">Record of transfers sent to your bank account or UPI</p>
          </div>
        </div>

        {payouts.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-2xl bg-canvas border border-slate-border flex items-center justify-center mx-auto mb-3 text-slate-muted">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-navy font-display mb-1">
              No settlements yet
            </h3>
            <p className="text-xs text-slate-muted max-w-sm mx-auto">
              Once you receive customer payments, automated payouts will be logged here with banking UTR numbers.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas border-b border-slate-border text-slate-muted uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Payout ID</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Bank UTR</th>
                  <th className="py-2.5 px-3 text-right">Settled Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-border">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-canvas/50">
                    <td className="py-3 px-3 font-mono text-[11px] font-semibold text-slate-muted">
                      #{p.payoutNumber}
                    </td>
                    <td className="py-3 px-3 font-bold text-navy">
                      ₹{p.amountInr.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 text-slate-text">
                      {p.destinationSummary}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          p.status === "settled"
                            ? "success"
                            : p.status === "failed"
                            ? "danger"
                            : "accent"
                        }
                        size="sm"
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-muted">
                      {p.utr || "Pending Bank Ref"}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-muted text-[11px]">
                      {p.settledAt
                        ? new Date(p.settledAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Request Payout Modal */}
      <Modal
        open={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Request Manual Payout"
        size="sm"
      >
        <form onSubmit={handleRequestPayout} className="space-y-4">
          <p className="text-xs text-slate-muted leading-relaxed">
            Withdraw your available store earnings to your configured destination. Standard T+1 processing applies.
          </p>

          <div>
            <label className="block text-xs font-bold text-navy mb-1.5">
              Withdrawal Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted font-bold text-xs">
                ₹
              </span>
              <input
                type="number"
                min="100"
                max={summary.availableBalanceInr}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-border bg-canvas focus:outline-none focus:ring-2 focus:ring-brand-violet/20 font-bold text-navy"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-muted mt-1.5">
              <span>Min withdrawal: ₹100</span>
              <span className="font-semibold text-brand-violet">
                Available: ₹{summary.availableBalanceInr.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-canvas border border-slate-border text-xs space-y-1">
            <div className="text-slate-muted">Destination:</div>
            <div className="font-bold text-navy">
              {account?.payoutMethod === "bank_account"
                ? `${account.bankAccount?.bankName || "Bank Account"} (${account.bankAccount?.accountNumberMasked})`
                : `UPI (${account?.upiVpa})`}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsWithdrawModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmittingWithdraw}
              size="sm"
              className="bg-brand-violet hover:bg-brand-violet/90 text-white font-semibold"
            >
              {isSubmittingWithdraw ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 mr-1.5" />
              )}
              Confirm Withdrawal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
