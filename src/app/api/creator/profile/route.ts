import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import {
  getCreatorProfileByUserId,
  toCreatorProfileDTO,
} from "@/services/creator.service";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const profile = await getCreatorProfileByUserId(session.user.id);

    if (!profile) {
      return apiSuccess({
        profile: null,
        onboardingCompleted: false,
      });
    }

    return apiSuccess({
      profile: toCreatorProfileDTO(profile),
      onboardingCompleted: profile.onboardingCompleted,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

