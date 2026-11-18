import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { AppError } from "@/lib/api-response";
import { User } from "@/models/User";
import { getPlanPricePaise, PLAN_CATALOG, type BillingCycle } from "@/lib/plans";
import { createRazorpayOrder, verifyPaymentSignature } from "./razorpay.service";
import type { UserPlan } from "@/types";

export interface UpgradeInitiateResult {
  activated: boolean;
  plan: UserPlan;
  billingCycle: BillingCycle;
  planExpiresAt: string | null;
  razorpayOrderId?: string;
  amountPaise: number;
  amountInr: number;
  keyId?: string;
}

export async function initiatePlanUpgrade(
  userId: string,
  targetPlan: UserPlan,
  billingCycle: BillingCycle
): Promise<UpgradeInitiateResult> {
  if (!isDatabaseConfigured()) {
    throw new AppError("Database not configured.", 503, "DB_UNAVAILABLE");
  }
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID.", 400, "INVALID_USER");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User account not found.", 404, "USER_NOT_FOUND");
  }

  // Downgrade to free plan immediately
  if (targetPlan === "free") {
    user.plan = "free";
    user.planExpiresAt = null;
    await user.save();

    return {
      activated: true,
      plan: "free",
      billingCycle: "monthly",
      planExpiresAt: null,
      amountPaise: 0,
      amountInr: 0,
    };
  }

  // Authoritative server-side price in paise
  const amountPaise = getPlanPricePaise(targetPlan, billingCycle);
  if (amountPaise <= 0) {
    throw new AppError("Invalid plan pricing configuration.", 500, "INVALID_PLAN_PRICE");
  }

  const receipt = `PLAN-${targetPlan.toUpperCase()}-${Date.now().toString().slice(-6)}`;
  const rzpOrder = await createRazorpayOrder({
    amountPaise,
    receipt,
    notes: {
      userId: user._id.toString(),
      plan: targetPlan,
      billingCycle,
      email: user.email,
    },
  });

  const isMockOrder = rzpOrder.id.startsWith("order_mock_");
  const keyId = isMockOrder
    ? "rzp_test_mock"
    : process.env.RAZORPAY_KEY_ID || "rzp_test_mock";

  return {
    activated: false,
    plan: targetPlan,
    billingCycle,
    planExpiresAt: user.planExpiresAt ? user.planExpiresAt.toISOString() : null,
    razorpayOrderId: rzpOrder.id,
    amountPaise,
    amountInr: Math.round(amountPaise / 100),
    keyId,
  };
}

export async function verifyAndActivatePlanUpgrade({
  userId,
  plan,
  billingCycle,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  userId: string;
  plan: "pro" | "business";
  billingCycle: BillingCycle;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<{
  plan: UserPlan;
  planName: string;
  planExpiresAt: string;
}> {
  if (!isDatabaseConfigured()) {
    throw new AppError("Database not configured.", 503, "DB_UNAVAILABLE");
  }
  await dbConnect();

  const isValid = verifyPaymentSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  if (!isValid) {
    throw new AppError("Payment verification signature is invalid.", 400, "INVALID_SIGNATURE");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User account not found.", 404, "USER_NOT_FOUND");
  }

  const durationDays = billingCycle === "yearly" ? 365 : 30;
  const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

  user.plan = plan;
  user.planExpiresAt = expiresAt;
  await user.save();

  return {
    plan: user.plan,
    planName: PLAN_CATALOG[plan].name,
    planExpiresAt: expiresAt.toISOString(),
  };
}
