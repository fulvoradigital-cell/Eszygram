import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { generatePresignedUploadUrl } from "@/services/storage.service";
import { uploadPresignSchema } from "@/validators/product.validator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = uploadPresignSchema.parse(body);

    const result = await generatePresignedUploadUrl({
      userId: session.user.id,
      filename: validated.filename,
      mimeType: validated.mimeType,
      size: validated.size,
      category: validated.category,
    });

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
