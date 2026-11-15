import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { createProduct, getProductsByCreatorId } from "@/services/product.service";
import type { ProductType } from "@/types";
import { createProductSchema } from "@/validators/product.validator";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const searchParams = req.nextUrl.searchParams;

    const type = (searchParams.get("type") as ProductType) || undefined;
    const search = searchParams.get("search") || undefined;
    const activeParam = searchParams.get("active");
    const isActive = activeParam !== null ? activeParam === "true" : undefined;

    const products = await getProductsByCreatorId(session.user.id, {
      type,
      search,
      isActive,
    });

    return apiSuccess(products);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = createProductSchema.parse(body);

    const product = await createProduct(session.user.id, validated);
    return apiSuccess(product, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
