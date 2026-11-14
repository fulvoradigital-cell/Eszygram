import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import {
  toCreatorProfileDTO,
  upsertCreatorOnboarding,
} from "@/services/creator.service";
import { onboardingSchema } from "@/validators/creator.validator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = onboardingSchema.parse(body);

    const profile = await upsertCreatorOnboarding(session.user.id, validated);

    return apiSuccess(toCreatorProfileDTO(profile), 200);
  } catch (error) {
    return handleApiError(error);
  }
}

