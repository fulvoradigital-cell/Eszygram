import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { apiError, handleApiError } from "@/lib/api-response";
import { getMimeType } from "@/services/storage.service";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { key: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const rawKey = params.key;
    if (!rawKey) {
      return apiError("File key is required.", 400, "MISSING_KEY");
    }

    // Sanitize filename to prevent directory traversal
    const safeKey = path.basename(decodeURIComponent(rawKey));
    const filePath = path.join(process.cwd(), "public", "uploads", safeKey);

    try {
      await fs.access(filePath);
    } catch {
      return apiError("File not found on server.", 404, "FILE_NOT_FOUND");
    }

    const fileBuffer = await fs.readFile(filePath);
    const mimeType = getMimeType(safeKey);

    // Remove local_timestamp_ prefix for human-friendly downloaded filename if present
    const cleanFileName = safeKey.replace(/^local_\d+_/, "");

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(cleanFileName)}"`,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
