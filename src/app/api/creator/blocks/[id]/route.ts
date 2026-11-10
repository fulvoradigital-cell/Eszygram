import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateBlock, deleteBlock } from "@/services/store.service";
import { updateBlockSchema } from "@/validators/store.validator";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return apiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const parsed = updateBlockSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(parsed.error);
    }

    const updated = await updateBlock(session.user.id, params.id, parsed.data);
    if (!updated) {
      return apiError("Block not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ block: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return apiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const success = await deleteBlock(session.user.id, params.id);
    if (!success) {
      return apiError("Block not found or could not be deleted", 404, "NOT_FOUND");
    }

    return apiSuccess({ message: "Block deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

