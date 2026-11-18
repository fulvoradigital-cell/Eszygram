import { z } from "zod";

export const upgradePlanInitiateSchema = z.object({
  plan: z.enum(["free", "pro", "business"]),
  billingCycle: z.enum(["monthly", "yearly"]).default("monthly"),
});

export const upgradePlanVerifySchema = z.object({
  plan: z.enum(["pro", "business"]),
  billingCycle: z.enum(["monthly", "yearly"]).default("monthly"),
  razorpay_order_id: z.string().trim().min(1, "Order ID is required"),
  razorpay_payment_id: z.string().trim().min(1, "Payment ID is required"),
  razorpay_signature: z.string().trim().min(1, "Payment signature is required"),
});

export type UpgradePlanInitiateInput = z.infer<typeof upgradePlanInitiateSchema>;
export type UpgradePlanVerifyInput = z.infer<typeof upgradePlanVerifySchema>;
