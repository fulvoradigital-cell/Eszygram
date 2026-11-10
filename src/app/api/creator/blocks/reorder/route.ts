import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { reorderBlocks } from "@/services/store.service";
import { reorderBlocksSchema } from "@/validators/store.validator";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return apiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const parsed = reorderBlocksSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(parsed.error);
    }

    await reorderBlocks(session.user.id, parsed.data);
    return apiSuccess({ message: "Blocks reordered successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

