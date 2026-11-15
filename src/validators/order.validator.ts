import { z } from "zod";

export const checkoutInitiateSchema = z.object({
  productId: z.string().trim().min(1, "Product ID is required"),
  buyerName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),
  buyerEmail: z.string().trim().email("Please enter a valid email address"),
  buyerPhone: z
    .string()
    .trim()
    .regex(
      /^(?:\+91|91)?[6-9]\d{9}$/,
      "Please enter a valid 10-digit Indian phone number"
    ),
  includeOrderBump: z.boolean().optional().default(false),
  couponCode: z.string().trim().optional(),
  customAnswers: z.record(z.string()).optional(),
});

export const checkoutVerifySchema = z.object({
  orderId: z.string().trim().min(1, "Order ID is required"),
  razorpay_order_id: z.string().trim().optional(),
  razorpay_payment_id: z.string().trim().optional(),
  razorpay_signature: z.string().trim().optional(),
});

export const validateCouponSchema = z.object({
  productId: z.string().trim().min(1, "Product ID is required"),
  code: z.string().trim().min(1, "Coupon code is required"),
});

export const createCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(2, "Code must be at least 2 characters")
    .max(20, "Code cannot exceed 20 characters")
    .regex(/^[A-Z0-9_-]+$/, "Code can only contain uppercase letters, numbers, and hyphens"),
  type: z.enum(["percent", "fixed"]).default("percent"),
  value: z.number().positive("Discount value must be greater than 0"),
  minOrderAmountInr: z.number().nonnegative().optional().default(0),
  maxUses: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CheckoutInitiateInput = z.infer<typeof checkoutInitiateSchema>;
export type CheckoutVerifyInput = z.infer<typeof checkoutVerifySchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
