import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createBlock } from "@/services/store.service";
import { createBlockSchema } from "@/validators/store.validator";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return apiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const parsed = createBlockSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(parsed.error);
    }

    const block = await createBlock(session.user.id, parsed.data);
    return apiSuccess({ block }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

