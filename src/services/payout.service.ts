import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { PayoutAccount, type IPayoutAccount } from "@/models/PayoutAccount";
import { Payout, type IPayout } from "@/models/Payout";
import { Order } from "@/models/Order";
import { AppError } from "@/lib/api-response";
import type {
  PayoutAccountDTO,
  PayoutDTO,
  PayoutSummaryDTO,
} from "@/types";
import type { UpdatePayoutAccountInput } from "@/validators/payout.validator";

function maskAccountNumber(acc?: string): string {
  if (!acc || acc.length < 4) return "••••";
  return `••••••••${acc.slice(-4)}`;
}

function maskPanNumber(pan?: string): string {
  if (!pan || pan.length < 4) return "••••";
  return `•••••${pan.slice(-4)}`;
}

export function toPayoutAccountDTO(doc: IPayoutAccount): PayoutAccountDTO {
  return {
    id: doc._id.toString(),
    creatorId: doc.creatorId.toString(),
    payoutMethod: doc.payoutMethod,
    bankAccount:
      doc.payoutMethod === "bank_account" && doc.accountHolderName
        ? {
            accountHolderName: doc.accountHolderName,
            accountNumberMasked: maskAccountNumber(doc.accountNumber),
            ifscCode: doc.ifscCode || "",
            bankName: doc.bankName || "Bank Account",
            accountType: doc.accountType || "savings",
          }
        : undefined,
    upiVpa: doc.payoutMethod === "upi" ? doc.upiVpa : undefined,
    panNumberMasked: doc.panNumber ? maskPanNumber(doc.panNumber) : undefined,
    gstin: doc.gstin,
    isVerified: doc.isVerified,
    autoPayoutEnabled: doc.autoPayoutEnabled,
    minimumPayoutInr: Math.round(doc.minimumPayoutPaise / 100),
  };
}

export function toPayoutDTO(doc: IPayout): PayoutDTO {
  return {
    id: doc._id.toString(),
    payoutNumber: doc.payoutNumber,
    creatorId: doc.creatorId.toString(),
    amountPaise: doc.amountPaise,
    amountInr: Math.round(doc.amountPaise / 100),
    destinationType: doc.destinationType,
    destinationSummary: doc.destinationSummary,
    status: doc.status,
    utr: doc.utr,
    failureReason: doc.failureReason,
    settledAt: doc.settledAt?.toISOString(),
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function getPayoutAccountByCreatorId(
  creatorId: string
): Promise<PayoutAccountDTO | null> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(creatorId)) {
    return null;
  }
  await dbConnect();

  const account = await PayoutAccount.findOne({
    creatorId: new mongoose.Types.ObjectId(creatorId),
  });

  return account ? toPayoutAccountDTO(account) : null;
}

export async function upsertPayoutAccount(
  creatorId: string,
  input: UpdatePayoutAccountInput
): Promise<PayoutAccountDTO> {
  if (!isDatabaseConfigured()) {
    throw new AppError("Database not configured", 503, "DB_ERROR");
  }
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(creatorId)) {
    throw new AppError("Invalid creator ID", 400, "INVALID_ID");
  }

  const cId = new mongoose.Types.ObjectId(creatorId);
  const minimumPayoutPaise = (input.minimumPayoutInr || 500) * 100;

  const updated = await PayoutAccount.findOneAndUpdate(
    { creatorId: cId },
    {
      $set: {
        payoutMethod: input.payoutMethod,
        accountHolderName: input.accountHolderName || undefined,
        accountNumber: input.accountNumber || undefined,
        ifscCode: input.ifscCode ? input.ifscCode.toUpperCase() : undefined,
        bankName: input.bankName || undefined,
        accountType: input.accountType || "savings",
        upiVpa: input.upiVpa ? input.upiVpa.toLowerCase() : undefined,
        panNumber: input.panNumber ? input.panNumber.toUpperCase() : undefined,
        gstin: input.gstin ? input.gstin.toUpperCase() : undefined,
        autoPayoutEnabled: input.autoPayoutEnabled ?? true,
        minimumPayoutPaise,
        isVerified: true,
      },
    },
    { new: true, upsert: true }
  );

  return toPayoutAccountDTO(updated);
}

export async function getPayoutSummary(
  creatorId: string
): Promise<PayoutSummaryDTO> {
  const emptySummary: PayoutSummaryDTO = {
    availableBalancePaise: 0,
    availableBalanceInr: 0,
    pendingPayoutPaise: 0,
    pendingPayoutInr: 0,
    totalSettledPaise: 0,
    totalSettledInr: 0,
    nextSettlementDate: "T+1 Business Day (by 5 PM IST)",
    payoutAccountConfigured: false,
  };

  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(creatorId)) {
    return emptySummary;
  }
  await dbConnect();

  const cId = new mongoose.Types.ObjectId(creatorId);

  // 1. Check if payout account is configured
  const account = await PayoutAccount.findOne({ creatorId: cId });
  const isConfigured = Boolean(
    account &&
      ((account.payoutMethod === "bank_account" && account.accountNumber) ||
        (account.payoutMethod === "upi" && account.upiVpa))
  );

  // 2. Sum creator net earnings from paid orders
  const paidOrders = await Order.find({
    creatorId: cId,
    status: "paid",
  });
  const totalEarningsPaise = paidOrders.reduce(
    (sum, o) => sum + (o.creatorEarningsPaise || o.amountPaise || 0),
    0
  );

  // 3. Sum existing payouts
  const payouts = await Payout.find({ creatorId: cId });
  const pendingPayoutPaise = payouts
    .filter((p) => p.status === "pending" || p.status === "processing")
    .reduce((sum, p) => sum + p.amountPaise, 0);

  const totalSettledPaise = payouts
    .filter((p) => p.status === "settled")
    .reduce((sum, p) => sum + p.amountPaise, 0);

  // Available balance is net earnings minus (settled + pending)
  const availableBalancePaise = Math.max(
    0,
    totalEarningsPaise - (totalSettledPaise + pendingPayoutPaise)
  );

  return {
    availableBalancePaise,
    availableBalanceInr: Math.round(availableBalancePaise / 100),
    pendingPayoutPaise,
    pendingPayoutInr: Math.round(pendingPayoutPaise / 100),
    totalSettledPaise,
    totalSettledInr: Math.round(totalSettledPaise / 100),
    nextSettlementDate: "T+1 Business Day (by 5 PM IST)",
    payoutAccountConfigured: isConfigured,
  };
}

export async function getPayoutsByCreatorId(
  creatorId: string,
  limit = 50
): Promise<PayoutDTO[]> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(creatorId)) {
    return [];
  }
  await dbConnect();

  const payouts = await Payout.find({
    creatorId: new mongoose.Types.ObjectId(creatorId),
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  return payouts.map(toPayoutDTO);
}

export async function requestManualPayout(
  creatorId: string,
  amountInr: number
): Promise<PayoutDTO> {
  if (!isDatabaseConfigured()) {
    throw new AppError("Database not configured", 503, "DB_ERROR");
  }
  await dbConnect();

  const cId = new mongoose.Types.ObjectId(creatorId);
  const account = await PayoutAccount.findOne({ creatorId: cId });

  if (
    !account ||
    (account.payoutMethod === "bank_account" && !account.accountNumber) ||
    (account.payoutMethod === "upi" && !account.upiVpa)
  ) {
    throw new AppError(
      "Please configure your Bank Account or UPI VPA before requesting a payout.",
      400,
      "PAYOUT_ACCOUNT_NOT_CONFIGURED"
    );
  }

  const requestedPaise = amountInr * 100;
  const summary = await getPayoutSummary(creatorId);

  if (requestedPaise > summary.availableBalancePaise) {
    throw new AppError(
      `Insufficient available balance. You have ₹${summary.availableBalanceInr} available to withdraw.`,
      400,
      "INSUFFICIENT_BALANCE"
    );
  }

  const destinationSummary =
    account.payoutMethod === "bank_account"
      ? `${account.bankName || "Bank Account"} (${maskAccountNumber(account.accountNumber)})`
      : `UPI (${account.upiVpa})`;

  const dateSlug = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  const payoutNumber = `PAY-${dateSlug}-${randSuffix}`;

  const payout = await Payout.create({
    payoutNumber,
    creatorId: cId,
    amountPaise: requestedPaise,
    destinationType: account.payoutMethod,
    destinationSummary,
    status: "pending",
  });

  return toPayoutDTO(payout);
}
