import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/services/buyer-auth.service";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({
    success: true,
    data: { message: "Logged out successfully." },
    error: null,
  });

  res.cookies.delete(COOKIE_NAME);
  return res;
}
