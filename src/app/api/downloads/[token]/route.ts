import { NextRequest, NextResponse } from "next/server";
import { apiError, handleApiError } from "@/lib/api-response";
import { verifyAndGetDownloadUrl } from "@/services/download.service";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { token: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const token = params.token;
    if (!token) {
      return apiError("Download token is required.", 400, "MISSING_TOKEN");
    }

    const { url } = await verifyAndGetDownloadUrl(token);

    // Redirect directly to the presigned file URL
    return NextResponse.redirect(url);
  } catch (error) {
    return handleApiError(error);
  }
}
