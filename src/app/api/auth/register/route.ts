import { NextRequest } from "next/server";
import { registerSchema } from "@/validators/auth.validator";
import {
  findUserByEmail,
  findUserByUsername,
  createCredentialsUser,
} from "@/services/user.service";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Strict Zod validation
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(parsed.error);
    }

    const { email, username } = parsed.data;

    // 2. Uniqueness checks
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return apiError("An account with this email already exists", 409, "EMAIL_EXISTS");
    }

    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      return apiError(
        "This username is already taken. Please choose another.",
        409,
        "USERNAME_TAKEN"
      );
    }

    // 3. Create user
    const newUser = await createCredentialsUser(parsed.data);

    // 4. Return sanitized user data without exposing password or internal keys
    return apiSuccess(
      {
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role,
        },
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
