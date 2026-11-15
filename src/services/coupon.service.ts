import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { Coupon, type ICoupon } from "@/models/Coupon";
import type { CouponDTO } from "@/types";
import type { CreateCouponInput } from "@/validators/order.validator";

export function toCouponDTO(doc: ICoupon): CouponDTO {
  const minOrderAmountPaise = doc.minOrderAmountPaise || 0;
  const minOrderAmountInr = Math.round(minOrderAmountPaise / 100);

  return {
    id: doc._id.toString(),
    creatorId: doc.creatorId.toString(),
    code: doc.code,
    type: doc.type,
    value: doc.type === "fixed" ? Math.round(doc.value / 100) : doc.value,
    minOrderAmountPaise,
    minOrderAmountInr,
    maxUses: doc.maxUses ?? null,
    usedCount: doc.usedCount || 0,
    expiresAt: doc.expiresAt ? doc.expiresAt.toISOString() : null,
    isActive: doc.isActive,
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function validateAndApplyCoupon({
  creatorId,
  code,
  basePricePaise,
}: {
  creatorId: string;
  code: string;
  basePricePaise: number;
}): Promise<{
  valid: boolean;
  discountPaise: number;
  couponId?: string;
  code?: string;
  message: string;
}> {
  if (!isDatabaseConfigured()) {
    return { valid: false, discountPaise: 0, message: "Database not connected." };
  }
  await dbConnect();

  const cleanCode = code.toUpperCase().trim();
  if (!cleanCode) {
    return { valid: false, discountPaise: 0, message: "Please provide a coupon code." };
  }

  const coupon = await Coupon.findOne({
    creatorId: new mongoose.Types.ObjectId(creatorId),
    code: cleanCode,
  });

  if (!coupon) {
    return { valid: false, discountPaise: 0, message: "Invalid coupon code." };
  }

  if (!coupon.isActive) {
    return { valid: false, discountPaise: 0, message: "This coupon is no longer active." };
  }

  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return { valid: false, discountPaise: 0, message: "This coupon has expired." };
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, discountPaise: 0, message: "This coupon has reached its usage limit." };
  }

  if (coupon.minOrderAmountPaise && basePricePaise < coupon.minOrderAmountPaise) {
    const minInr = Math.round(coupon.minOrderAmountPaise / 100);
    return {
      valid: false,
      discountPaise: 0,
      message: `Minimum order amount of ₹${minInr} required for this coupon.`,
    };
  }

  let discountPaise = 0;
  if (coupon.type === "percent") {
    discountPaise = Math.round((basePricePaise * coupon.value) / 100);
  } else {
    discountPaise = coupon.value; // Stored in paise
  }

  // Discount cannot exceed the base price
  discountPaise = Math.min(discountPaise, basePricePaise);

  return {
    valid: true,
    discountPaise,
    couponId: coupon._id.toString(),
    code: coupon.code,
    message: `Coupon "${coupon.code}" applied!`,
  };
}

export async function incrementCouponUses(couponId: string): Promise<void> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(couponId)) return;
  await dbConnect();

  await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
}

export async function getCouponsByCreatorId(creatorId: string): Promise<CouponDTO[]> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(creatorId)) return [];
  await dbConnect();

  const coupons = await Coupon.find({
    creatorId: new mongoose.Types.ObjectId(creatorId),
  }).sort({ createdAt: -1 });

  return coupons.map(toCouponDTO);
}

export async function createCoupon(
  creatorId: string,
  input: CreateCouponInput
): Promise<CouponDTO> {
  await dbConnect();

  const creatorObjectId = new mongoose.Types.ObjectId(creatorId);
  const cleanCode = input.code.toUpperCase().trim();

  // If fixed discount, convert INR to paise for storage
  const value =
    input.type === "fixed" ? Math.round(input.value * 100) : input.value;
  const minOrderAmountPaise = input.minOrderAmountInr
    ? Math.round(input.minOrderAmountInr * 100)
    : 0;

  const coupon = await Coupon.create({
    creatorId: creatorObjectId,
    code: cleanCode,
    type: input.type,
    value,
    minOrderAmountPaise,
    maxUses: input.maxUses ?? null,
    usedCount: 0,
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    isActive: input.isActive ?? true,
  });

  return toCouponDTO(coupon);
}

export async function deleteCoupon(
  creatorId: string,
  couponId: string
): Promise<boolean> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(couponId)) return false;
  await dbConnect();

  const res = await Coupon.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(couponId),
    creatorId: new mongoose.Types.ObjectId(creatorId),
  });

  return Boolean(res);
}
