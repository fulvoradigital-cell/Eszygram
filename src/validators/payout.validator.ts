import { z } from "zod";

const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const upiRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const updatePayoutAccountSchema = z
  .object({
    payoutMethod: z.enum(["bank_account", "upi"]),
    accountHolderName: z.string().trim().max(100).optional().or(z.literal("")),
    accountNumber: z
      .string()
      .trim()
      .regex(/^[0-9]{9,18}$/, "Bank account number must be 9 to 18 digits")
      .optional()
      .or(z.literal("")),
    ifscCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(ifscRegex, "Invalid Indian IFSC code format (e.g. HDFC0001234)")
      .optional()
      .or(z.literal("")),
    bankName: z.string().trim().max(100).optional().or(z.literal("")),
    accountType: z.enum(["savings", "current"]).default("savings"),
    upiVpa: z
      .string()
      .trim()
      .toLowerCase()
      .regex(upiRegex, "Invalid UPI VPA (e.g. username@okhdfcbank)")
      .optional()
      .or(z.literal("")),
    panNumber: z
      .string()
      .trim()
      .toUpperCase()
      .regex(panRegex, "Invalid 10-character PAN format (e.g. ABCDE1234F)")
      .optional()
      .or(z.literal("")),
    gstin: z
      .string()
      .trim()
      .toUpperCase()
      .regex(gstinRegex, "Invalid 15-character GSTIN format")
      .optional()
      .or(z.literal("")),
    autoPayoutEnabled: z.boolean().default(true),
    minimumPayoutInr: z.number().int().min(100).max(50000).default(500),
  })
  .superRefine((data, ctx) => {
    if (data.payoutMethod === "bank_account") {
      if (!data.accountHolderName || data.accountHolderName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Account holder name is required for bank transfer",
          path: ["accountHolderName"],
        });
      }
      if (!data.accountNumber || data.accountNumber.trim().length < 9) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valid account number is required for bank transfer",
          path: ["accountNumber"],
        });
      }
      if (!data.ifscCode || !ifscRegex.test(data.ifscCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valid 11-character IFSC code is required (e.g. HDFC0001234)",
          path: ["ifscCode"],
        });
      }
    } else if (data.payoutMethod === "upi") {
      if (!data.upiVpa || !upiRegex.test(data.upiVpa)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valid UPI VPA is required (e.g. name@okhdfcbank)",
          path: ["upiVpa"],
        });
      }
    }
  });

export const requestPayoutSchema = z.object({
  amountInr: z.number().int().min(100, "Minimum withdrawal amount is ₹100"),
});

export type UpdatePayoutAccountInput = z.infer<typeof updatePayoutAccountSchema>;
export type RequestPayoutInput = z.infer<typeof requestPayoutSchema>;
