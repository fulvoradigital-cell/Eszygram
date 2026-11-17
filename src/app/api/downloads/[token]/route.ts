import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import { apiError, handleApiError } from "@/lib/api-response";
import { verifyAndGetDownloadUrl } from "@/services/download.service";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { token: string };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const token = params.token;
    if (!token) {
      return apiError("Download token is required.", 400, "MISSING_TOKEN");
    }

    const result = await verifyAndGetDownloadUrl(token);

    // If file is stored on local disk, stream it directly for native browser download
    if (result.isLocal && result.localPath) {
      const fileBuffer = await fs.readFile(result.localPath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": result.mimeType || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(result.fileName)}"`,
          "Content-Length": fileBuffer.length.toString(),
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      });
    }

    // Remote presigned URL (S3) or fallback redirect:
    // Ensure URL is strictly absolute to comply with Next.js App Router rules
    const absoluteUrl = result.url.startsWith("http")
      ? result.url
      : new URL(result.url, req.url).toString();

    return NextResponse.redirect(absoluteUrl, 302);
  } catch (error) {
    return handleApiError(error);
  }
}
