import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { validateCouponSchema } from "@/validators/order.validator";
import { validateAndApplyCoupon } from "@/services/coupon.service";
import { Product } from "@/models/Product";
import { dbConnect } from "@/lib/db";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = validateCouponSchema.parse(body);

    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(validated.productId)) {
      return apiError("Invalid product ID", 400, "INVALID_PRODUCT");
    }

    const product = await Product.findById(validated.productId);
    if (!product) {
      return apiError("Product not found", 404, "NOT_FOUND");
    }

    const result = await validateAndApplyCoupon({
      creatorId: product.creatorId.toString(),
      code: validated.code,
      basePricePaise: product.price,
    });

    if (!result.valid) {
      return apiError(result.message, 400, "INVALID_COUPON");
    }

    return apiSuccess({
      valid: true,
      code: result.code,
      discountPaise: result.discountPaise,
      discountInr: Math.round(result.discountPaise / 100),
      message: result.message,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
