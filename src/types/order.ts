export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "free";

export interface DownloadToken {
  token: string;
  productId: string;
  fileId: string;
  fileName: string;
  downloadCount: number;
  maxDownloads: number;
  expiresAt: string; // ISO string
}

export interface OrderDTO {
  id: string;
  invoiceNumber: string;
  creatorId: string;
  productId: string;
  productTitle: string;
  productType: string;
  productCoverImage?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  amountPaise: number; // Final charged amount in paise
  amountInr: number; // Final charged amount in INR
  basePricePaise: number;
  discountAmountPaise: number;
  orderBumpIncluded: boolean;
  orderBumpProductId?: string;
  orderBumpPricePaise: number;
  platformFeePaise: number;
  creatorEarningsPaise: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  downloadTokens: DownloadToken[];
  customAnswers?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface OrderMetricsDTO {
  totalGrossPaise: number;
  totalGrossInr: number;
  totalNetEarningsPaise: number;
  totalNetEarningsInr: number;
  totalPlatformFeePaise: number;
  totalPlatformFeeInr: number;
  totalOrdersCount: number;
  paidOrdersCount: number;
}
