import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-response";
import { verifyOtpSchema } from "@/validators/buyer.validator";
import { COOKIE_NAME, verifyBuyerOtp } from "@/services/buyer-auth.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = verifyOtpSchema.parse(body);

    const { token, email } = await verifyBuyerOtp(
      validated.email,
      validated.code
    );

    const res = NextResponse.json({
      success: true,
      data: { verified: true, email },
      error: null,
    });

    // Set 30-day HTTP-only secure cookie
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return res;
  } catch (error) {
    return handleApiError(error);
  }
}
