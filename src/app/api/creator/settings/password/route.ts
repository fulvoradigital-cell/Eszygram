import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { changePasswordSchema } from "@/validators/settings.validator";
import { User } from "@/models/User";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return apiError("Unauthorized access.", 401, "UNAUTHORIZED");
    }

    if (!isDatabaseConfigured()) {
      return apiError("Database not configured.", 503, "DB_ERROR");
    }
    await dbConnect();

    const body = await req.json();
    const validated = changePasswordSchema.parse(body);

    const user = await User.findById(session.user.id);
    if (!user) {
      return apiError("User not found.", 404, "USER_NOT_FOUND");
    }

    if (!user.passwordHash) {
      return apiError(
        "This account signs in with Google OAuth. Password change is not supported.",
        400,
        "OAUTH_ACCOUNT"
      );
    }

    const isMatch = await bcrypt.compare(validated.currentPassword, user.passwordHash);
    if (!isMatch) {
      return apiError("Current password is incorrect.", 400, "INVALID_PASSWORD");
    }

    const newHash = await bcrypt.hash(validated.newPassword, 12);
    user.passwordHash = newHash;
    await user.save();

    return apiSuccess({ message: "Password updated successfully." });
  } catch (error) {
    return handleApiError(error);
  }
}
