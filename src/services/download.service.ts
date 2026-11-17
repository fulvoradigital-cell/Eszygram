import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { getExpiringDownloadUrl, getMimeType } from "./storage.service";
import { AppError } from "@/lib/api-response";

export interface VerifyDownloadResult {
  isLocal: boolean;
  localPath?: string;
  url: string;
  fileName: string;
  mimeType: string;
  remainingDownloads: number;
}

export async function verifyAndGetDownloadUrl(token: string): Promise<VerifyDownloadResult> {
  if (!isDatabaseConfigured()) {
    throw new AppError("Database not connected.", 503, "DB_UNAVAILABLE");
  }
  await dbConnect();

  const cleanToken = token.trim();
  if (!cleanToken) {
    throw new AppError("Invalid download token.", 400, "INVALID_TOKEN");
  }

  // Find order containing this token
  const order = await Order.findOne({
    "downloadTokens.token": cleanToken,
    status: "paid",
  });

  if (!order) {
    throw new AppError("Download link not found or purchase not verified.", 404, "TOKEN_NOT_FOUND");
  }

  const tokenObj = order.downloadTokens.find((t) => t.token === cleanToken);
  if (!tokenObj) {
    throw new AppError("Download token not found.", 404, "TOKEN_NOT_FOUND");
  }

  // Check token expiration (24h default)
  const expiresAt = new Date(tokenObj.expiresAt);
  if (expiresAt.getTime() < Date.now()) {
    throw new AppError("This download link has expired. Please request a new link from your library.", 410, "TOKEN_EXPIRED");
  }

  // Check download count limit
  // In development mode, allow up to 50 downloads so testing is never blocked by retries
  const isDev = process.env.NODE_ENV !== "production";
  const effectiveMaxDownloads = isDev ? Math.max(tokenObj.maxDownloads || 5, 50) : (tokenObj.maxDownloads || 5);
  if (tokenObj.downloadCount >= effectiveMaxDownloads) {
    throw new AppError(
      `Download limit reached (${tokenObj.maxDownloads} downloads used). You can renew links anytime in your Buyer Portal.`,
      403,
      "LIMIT_REACHED"
    );
  }

  // Fetch product to retrieve s3Key
  const product = await Product.findById(tokenObj.productId);
  if (!product) {
    throw new AppError("Associated product file could not be found.", 404, "PRODUCT_NOT_FOUND");
  }

  const file = product.files.find((f) => f.id === tokenObj.fileId);
  if (!file || !file.s3Key) {
    throw new AppError("File record missing in product.", 404, "FILE_NOT_FOUND");
  }

  const safeBasename = path.basename(file.s3Key);
  const localFilePath = path.join(process.cwd(), "public", "uploads", safeBasename);

  let isLocal = false;
  let localPath: string | undefined = undefined;
  let downloadUrl: string = "";

  try {
    await fs.access(localFilePath);
    isLocal = true;
    localPath = localFilePath;
    downloadUrl = `/api/storage/download/${encodeURIComponent(safeBasename)}`;
  } catch {
    // If local file does not exist, use S3 presigned URL
    downloadUrl = await getExpiringDownloadUrl(file.s3Key, 3600); // 1 hour valid link
  }

  // Increment download count atomically only after verifying file existence
  await Order.updateOne(
    { _id: order._id, "downloadTokens.token": cleanToken },
    { $inc: { "downloadTokens.$.downloadCount": 1 } }
  );

  const remaining = effectiveMaxDownloads - (tokenObj.downloadCount + 1);

  return {
    isLocal,
    localPath,
    url: downloadUrl,
    fileName: file.name,
    mimeType: getMimeType(file.name),
    remainingDownloads: Math.max(0, remaining),
  };
}
