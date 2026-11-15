import { NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Ensure creator is authenticated
    await requireAuthSession();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const customKey = (formData.get("key") as string) || null;

    if (!file) {
      return apiError("No file uploaded.", 400, "BAD_REQUEST");
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
    const fileKey = customKey || `local_${Date.now()}_${safeName}`;

    // Target upload directory in public/uploads for direct accessibility in dev
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileKey);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return apiSuccess({
      url: `/uploads/${fileKey}`,
      s3Key: fileKey,
      name: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
