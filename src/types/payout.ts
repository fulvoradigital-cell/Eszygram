export type PayoutMethod = "bank_account" | "upi";
export type PayoutStatus = "pending" | "processing" | "settled" | "failed";

export interface BankAccountDTO {
  accountHolderName: string;
  accountNumberMasked: string;
  ifscCode: string;
  bankName: string;
  accountType: "savings" | "current";
}

export interface PayoutAccountDTO {
  id: string;
  creatorId: string;
  payoutMethod: PayoutMethod;
  bankAccount?: BankAccountDTO;
  upiVpa?: string;
  panNumberMasked?: string;
  gstin?: string;
  isVerified: boolean;
  autoPayoutEnabled: boolean;
  minimumPayoutInr: number;
}

export interface PayoutDTO {
  id: string;
  payoutNumber: string;
  creatorId: string;
  amountPaise: number;
  amountInr: number;
  destinationType: PayoutMethod;
  destinationSummary: string;
  status: PayoutStatus;
  utr?: string;
  failureReason?: string;
  settledAt?: string;
  createdAt: string;
}

export interface PayoutSummaryDTO {
  availableBalancePaise: number;
  availableBalanceInr: number;
  pendingPayoutPaise: number;
  pendingPayoutInr: number;
  totalSettledPaise: number;
  totalSettledInr: number;
  nextSettlementDate: string;
  payoutAccountConfigured: boolean;
}
