import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { reorderBlocks } from "@/services/block.service";
import { reorderBlocksSchema } from "@/validators/block.validator";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = reorderBlocksSchema.parse(body);

    await reorderBlocks(session.user.id, validated.items);
    return apiSuccess({ success: true, message: "Blocks reordered." });
  } catch (error) {
    return handleApiError(error);
  }
}
