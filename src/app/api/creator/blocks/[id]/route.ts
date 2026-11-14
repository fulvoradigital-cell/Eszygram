import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { deleteBlock, updateBlock } from "@/services/block.service";
import { updateBlockSchema } from "@/validators/block.validator";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = updateBlockSchema.parse(body);

    const updated = await updateBlock(session.user.id, params.id, validated);
    if (!updated) {
      return apiError("Block not found or unauthorized.", 404, "NOT_FOUND");
    }

    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuthSession();
    const deleted = await deleteBlock(session.user.id, params.id);

    if (!deleted) {
      return apiError("Block not found or unauthorized.", 404, "NOT_FOUND");
    }

    return apiSuccess({ success: true, message: "Block deleted." });
  } catch (error) {
    return handleApiError(error);
  }
}
