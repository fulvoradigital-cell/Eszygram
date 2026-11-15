import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/services/product.service";
import { updateProductSchema } from "@/validators/product.validator";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuthSession();
    const product = await getProductById(params.id, session.user.id);

    if (!product) {
      return apiError("Product not found or unauthorized.", 404, "NOT_FOUND");
    }

    return apiSuccess(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = updateProductSchema.parse(body);

    const updated = await updateProduct(session.user.id, params.id, validated);
    if (!updated) {
      return apiError("Product not found or unauthorized.", 404, "NOT_FOUND");
    }

    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuthSession();
    const deleted = await deleteProduct(session.user.id, params.id);

    if (!deleted) {
      return apiError("Product not found or unauthorized.", 404, "NOT_FOUND");
    }

    return apiSuccess({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    return handleApiError(error);
  }
}
