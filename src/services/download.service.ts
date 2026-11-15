import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { getExpiringDownloadUrl } from "./storage.service";
import { AppError } from "@/lib/api-response";

export async function verifyAndGetDownloadUrl(token: string): Promise<{
  url: string;
  fileName: string;
  remainingDownloads: number;
}> {
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
    throw new AppError("This download link has expired. Please request a new link.", 410, "TOKEN_EXPIRED");
  }

  // Check download count limit
  if (tokenObj.downloadCount >= tokenObj.maxDownloads) {
    throw new AppError(
      `Download limit reached (${tokenObj.maxDownloads} downloads used).`,
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

  // Increment download count atomically
  await Order.updateOne(
    { _id: order._id, "downloadTokens.token": cleanToken },
    { $inc: { "downloadTokens.$.downloadCount": 1 } }
  );

  // Generate signed download URL from storage service
  const downloadUrl = await getExpiringDownloadUrl(file.s3Key, 3600); // 1 hour valid link
  const remaining = tokenObj.maxDownloads - (tokenObj.downloadCount + 1);

  return {
    url: downloadUrl,
    fileName: file.name,
    remainingDownloads: Math.max(0, remaining),
  };
}
