import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { onboardingSchema } from "@/validators/auth.validator";
import { completeCreatorOnboarding } from "@/services/user.service";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return apiError("Unauthorized. Please log in first.", 401, "UNAUTHORIZED");
    }

    const body = await req.json();

    // 2. Strict Zod validation
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(parsed.error);
    }

    // 3. Complete onboarding
    const profile = await completeCreatorOnboarding(
      session.user.id,
      parsed.data
    );

    return apiSuccess(
      {
        profile: {
          id: profile._id.toString(),
          username: profile.username,
          displayName: profile.displayName,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          niche: profile.niche,
          socialLinks: profile.socialLinks,
          theme: profile.theme,
        },
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
