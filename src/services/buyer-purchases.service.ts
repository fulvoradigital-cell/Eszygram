import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { CreatorProfile } from "@/models/CreatorProfile";
import { generateDownloadTokens } from "./order.service";
import { AppError } from "@/lib/api-response";
import type { BuyerPurchaseDTO } from "@/types";

export async function getBuyerPurchases(
  buyerEmail: string
): Promise<BuyerPurchaseDTO[]> {
  if (!isDatabaseConfigured()) return [];
  await dbConnect();

  const cleanEmail = buyerEmail.toLowerCase().trim();

  const orders = await Order.find({
    buyerEmail: cleanEmail,
    status: "paid",
  }).sort({ createdAt: -1 });

  if (orders.length === 0) return [];

  // Collect creator IDs and product IDs for batch lookup
  const creatorIds = Array.from(new Set(orders.map((o) => o.creatorId.toString())));
  const productIds = Array.from(new Set(orders.map((o) => o.productId.toString())));

  const [creatorProfiles, products] = await Promise.all([
    CreatorProfile.find({
      userId: { $in: creatorIds.map((id) => new mongoose.Types.ObjectId(id)) },
    }),
    Product.find({
      _id: { $in: productIds.map((id) => new mongoose.Types.ObjectId(id)) },
    }),
  ]);

  const creatorMap = new Map(creatorProfiles.map((p) => [p.userId.toString(), p]));
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const now = Date.now();

  return orders.map((order) => {
    const creator = creatorMap.get(order.creatorId.toString());
    const prod = productMap.get(order.productId.toString());

    const downloadTokens = (order.downloadTokens || []).map((t) => ({
      token: t.token,
      fileName: t.fileName,
      downloadCount: t.downloadCount,
      maxDownloads: t.maxDownloads,
      expiresAt: t.expiresAt,
      isExpired: new Date(t.expiresAt).getTime() < now || t.downloadCount >= t.maxDownloads,
    }));

    return {
      orderId: order._id.toString(),
      invoiceNumber: order.invoiceNumber,
      productId: order.productId.toString(),
      productTitle: order.productTitle,
      productType: order.productType,
      productCoverImage: order.productCoverImage || prod?.coverImage || "",
      creatorId: order.creatorId.toString(),
      creatorDisplayName: creator?.displayName || "Verified Creator",
      creatorUsername: creator?.username || "creator",
      creatorAvatarUrl: creator?.avatarUrl || undefined,
      amountInr: Math.round(order.amountPaise / 100),
      purchaseDate: order.createdAt.toISOString(),
      downloadTokens,
      bookingConfig: prod?.bookingConfig
        ? {
            durationMinutes: prod.bookingConfig.durationMinutes,
            calendarUrl: prod.bookingConfig.calendarUrl,
            timezone: prod.bookingConfig.timezone,
          }
        : undefined,
      membershipConfig: prod?.membershipConfig
        ? {
            interval: prod.membershipConfig.interval,
            features: prod.membershipConfig.features,
          }
        : undefined,
    };
  });
}

export async function regenerateDownloadTokensForOrder(
  buyerEmail: string,
  orderId: string
): Promise<Array<{ token: string; fileName: string; expiresAt: string }>> {
  if (!isDatabaseConfigured()) {
    throw new AppError("Database not connected.", 503, "DB_UNAVAILABLE");
  }
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new AppError("Invalid order ID", 400, "INVALID_ORDER");
  }

  const order = await Order.findOne({
    _id: new mongoose.Types.ObjectId(orderId),
    buyerEmail: buyerEmail.toLowerCase().trim(),
    status: "paid",
  });

  if (!order) {
    throw new AppError("Order not found or unauthorized.", 404, "ORDER_NOT_FOUND");
  }

  const product = await Product.findById(order.productId);
  if (!product) {
    throw new AppError("Product record not found.", 404, "PRODUCT_NOT_FOUND");
  }

  const newTokens = generateDownloadTokens(product);
  order.downloadTokens = newTokens;
  await order.save();

  return newTokens.map((t) => ({
    token: t.token,
    fileName: t.fileName,
    expiresAt: t.expiresAt,
  }));
}
