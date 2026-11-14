import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { createBlock, getBlocksByUserId } from "@/services/block.service";
import { createBlockSchema } from "@/validators/block.validator";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const blocks = await getBlocksByUserId(session.user.id);
    return apiSuccess(blocks);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = createBlockSchema.parse(body);

    const block = await createBlock(session.user.id, validated);
    return apiSuccess(block, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
