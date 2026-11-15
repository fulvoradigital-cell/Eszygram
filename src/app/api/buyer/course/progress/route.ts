import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { COOKIE_NAME, verifyBuyerToken } from "@/services/buyer-auth.service";
import { courseProgressSchema } from "@/validators/buyer.validator";
import { updateCourseProgress } from "@/services/course.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return apiError("Please log in to track course progress.", 401, "UNAUTHORIZED");
    }

    const session = verifyBuyerToken(token);
    if (!session) {
      return apiError("Session expired. Please log in again.", 401, "SESSION_EXPIRED");
    }

    const body = await req.json();
    const validated = courseProgressSchema.parse(body);

    const progress = await updateCourseProgress({
      buyerEmail: session.email,
      productId: validated.productId,
      lessonId: validated.lessonId,
      completed: validated.completed,
    });

    return apiSuccess(progress);
  } catch (error) {
    return handleApiError(error);
  }
}
