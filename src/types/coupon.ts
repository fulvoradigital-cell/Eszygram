export type CouponType = "percent" | "fixed";

export interface CouponDTO {
  id: string;
  creatorId: string;
  code: string;
  type: CouponType;
  value: number; // e.g. 20 for 20% off, or 100 for ₹100 off
  minOrderAmountPaise?: number;
  minOrderAmountInr?: number;
  maxUses?: number | null;
  usedCount: number;
  expiresAt?: string | null;
  isActive: boolean;
  createdAt: string;
}
