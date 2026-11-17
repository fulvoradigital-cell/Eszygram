import crypto from "crypto";
import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { Order, type IOrder } from "@/models/Order";
import { Product, type IProduct } from "@/models/Product";
import type { DownloadToken, OrderDTO, OrderMetricsDTO, OrderStatus, PaymentMethod } from "@/types";
import type { CheckoutInitiateInput } from "@/validators/order.validator";
import { createRazorpayOrder, verifyPaymentSignature } from "./razorpay.service";
import { incrementCouponUses, validateAndApplyCoupon } from "./coupon.service";
import { sendOrderConfirmationEmail } from "./email.service";
import { AppError } from "@/lib/api-response";

export function toOrderDTO(doc: IOrder): OrderDTO {
  const plain =
    typeof (doc as { toObject?: () => Record<string, unknown> }).toObject === "function"
      ? (doc as { toObject: () => Record<string, unknown> }).toObject()
      : (doc as unknown as Record<string, unknown>);

  const amountPaise = Number(plain.amountPaise || 0);
  const amountInr = Math.round(amountPaise / 100);
  const downloadTokensRaw = Array.isArray(plain.downloadTokens) ? plain.downloadTokens : [];

  return {
    id: (plain._id || doc._id).toString(),
    invoiceNumber: String(plain.invoiceNumber || ""),
    creatorId: (plain.creatorId || doc.creatorId).toString(),
    productId: (plain.productId || doc.productId).toString(),
    productTitle: String(plain.productTitle || ""),
    productType: plain.productType as OrderDTO["productType"],
    productCoverImage: String(plain.productCoverImage || ""),
    buyerName: String(plain.buyerName || ""),
    buyerEmail: String(plain.buyerEmail || ""),
    buyerPhone: String(plain.buyerPhone || ""),
    amountPaise,
    amountInr,
    basePricePaise: Number(plain.basePricePaise || 0),
    discountAmountPaise: Number(plain.discountAmountPaise || 0),
    orderBumpIncluded: Boolean(plain.orderBumpIncluded),
    orderBumpProductId: plain.orderBumpProductId ? String(plain.orderBumpProductId) : undefined,
    orderBumpPricePaise: Number(plain.orderBumpPricePaise || 0),
    platformFeePaise: Number(plain.platformFeePaise || 0),
    creatorEarningsPaise: Number(plain.creatorEarningsPaise || 0),
    couponCode: plain.couponCode ? String(plain.couponCode) : undefined,
    status: plain.status as OrderDTO["status"],
    paymentMethod: (plain.paymentMethod as OrderDTO["paymentMethod"]) || "upi",
    razorpayOrderId: plain.razorpayOrderId ? String(plain.razorpayOrderId) : undefined,
    razorpayPaymentId: plain.razorpayPaymentId ? String(plain.razorpayPaymentId) : undefined,
    downloadTokens: downloadTokensRaw.map((t: unknown) => {
      const token = (t as Record<string, unknown>) || {};
      return {
        token: String(token.token || ""),
        productId: String(token.productId || plain.productId || doc.productId || ""),
        fileId: String(token.fileId || ""),
        fileName: String(token.fileName || ""),
        expiresAt: token.expiresAt
          ? new Date(token.expiresAt as string | number | Date).toISOString()
          : new Date().toISOString(),
        downloadCount: Number(token.downloadCount || 0),
        maxDownloads: Number(token.maxDownloads || 5),
      };
    }),
    customAnswers: plain.customAnswers
      ? JSON.parse(JSON.stringify(plain.customAnswers))
      : undefined,
    createdAt: plain.createdAt
      ? new Date(plain.createdAt as string | number | Date).toISOString()
      : new Date().toISOString(),
    updatedAt: plain.updatedAt
      ? new Date(plain.updatedAt as string | number | Date).toISOString()
      : new Date().toISOString(),
  };
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `EZ-${year}-${randomSuffix}`;
}

export function generateDownloadTokens(product: IProduct): DownloadToken[] {
  if (product.type !== "download" || !product.files || product.files.length === 0) {
    return [];
  }
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
  return product.files.map((file) => ({
    token: crypto.randomBytes(24).toString("hex"),
    productId: product._id.toString(),
    fileId: file.id,
    fileName: file.name,
    downloadCount: 0,
    maxDownloads: 5,
    expiresAt,
  }));
}

/**
 * Authoritative Server Price Calculation
 * Stored strictly in paise: never trust client numbers.
 */
export async function calculateCheckoutPrices({
  product,
  includeOrderBump = false,
  couponCode,
}: {
  product: IProduct;
  includeOrderBump?: boolean;
  couponCode?: string;
}): Promise<{
  basePricePaise: number;
  orderBumpPricePaise: number;
  orderBumpProductId?: mongoose.Types.ObjectId;
  discountAmountPaise: number;
  totalPaise: number;
  platformFeePaise: number;
  creatorEarningsPaise: number;
  couponId?: string;
  appliedCouponCode?: string;
}> {
  const basePricePaise = product.price; // authoritative from DB
  let orderBumpPricePaise = 0;
  let orderBumpProductId: mongoose.Types.ObjectId | undefined = undefined;

  // Calculate order bump strictly if enabled on product
  if (includeOrderBump && product.orderBump?.enabled && product.orderBump.productId) {
    const bumpProd = await Product.findById(product.orderBump.productId);
    if (bumpProd && bumpProd.isActive) {
      orderBumpProductId = bumpProd._id;
      // Discounted bump price if set, else full product price
      orderBumpPricePaise =
        product.orderBump.discountPricePaise && product.orderBump.discountPricePaise > 0
          ? product.orderBump.discountPricePaise
          : bumpProd.price;
    }
  }

  // Calculate coupon discount
  let discountAmountPaise = 0;
  let couponId: string | undefined = undefined;
  let appliedCouponCode: string | undefined = undefined;

  if (couponCode) {
    const couponRes = await validateAndApplyCoupon({
      creatorId: product.creatorId.toString(),
      code: couponCode,
      basePricePaise,
    });
    if (couponRes.valid) {
      discountAmountPaise = couponRes.discountPaise;
      couponId = couponRes.couponId;
      appliedCouponCode = couponRes.code;
    }
  }

  // Final amount to be charged
  const subtotalPaise = basePricePaise + orderBumpPricePaise;
  const totalPaise = Math.max(0, subtotalPaise - discountAmountPaise);

  // Platform fee (e.g. 5% configured in env)
  const feePercent = Number(process.env.PLATFORM_FEE_PERCENT) || 5;
  const platformFeePaise = Math.round(totalPaise * (feePercent / 100));
  const creatorEarningsPaise = totalPaise - platformFeePaise;

  return {
    basePricePaise,
    orderBumpPricePaise,
    orderBumpProductId,
    discountAmountPaise,
    totalPaise,
    platformFeePaise,
    creatorEarningsPaise,
    couponId,
    appliedCouponCode,
  };
}

export async function initializeCheckout(
  input: CheckoutInitiateInput
): Promise<{
  orderId: string;
  isFree: boolean;
  razorpayOrderId?: string;
  amountPaise: number;
  amountInr: number;
  keyId?: string;
  redirectUrl?: string;
}> {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(input.productId)) {
    throw new AppError("Invalid product ID", 400, "INVALID_PRODUCT");
  }

  const product = await Product.findById(input.productId);
  if (!product || !product.isActive) {
    throw new AppError("This product is no longer available for purchase.", 404, "PRODUCT_UNAVAILABLE");
  }

  const pricing = await calculateCheckoutPrices({
    product,
    includeOrderBump: input.includeOrderBump,
    couponCode: input.couponCode,
  });

  const invoiceNumber = generateInvoiceNumber();

  // If free product or 100% coupon discount: bypass Razorpay and fulfill immediately
  if (pricing.totalPaise === 0) {
    const downloadTokens = generateDownloadTokens(product);

    const order = await Order.create({
      invoiceNumber,
      creatorId: product.creatorId,
      productId: product._id,
      productTitle: product.title,
      productType: product.type,
      productCoverImage: product.coverImage || "",
      buyerName: input.buyerName.trim(),
      buyerEmail: input.buyerEmail.toLowerCase().trim(),
      buyerPhone: input.buyerPhone.trim(),
      amountPaise: 0,
      basePricePaise: pricing.basePricePaise,
      discountAmountPaise: pricing.discountAmountPaise,
      orderBumpIncluded: Boolean(pricing.orderBumpProductId),
      orderBumpProductId: pricing.orderBumpProductId,
      orderBumpPricePaise: pricing.orderBumpPricePaise,
      platformFeePaise: 0,
      creatorEarningsPaise: 0,
      couponCode: pricing.appliedCouponCode,
      status: "paid",
      paymentMethod: "free",
      downloadTokens,
      customAnswers: input.customAnswers,
    });

    // Increment sales count
    await Product.findByIdAndUpdate(product._id, { $inc: { salesCount: 1 } });

    // Increment coupon uses if applicable
    if (pricing.couponId) {
      await incrementCouponUses(pricing.couponId);
    }

    // Trigger order confirmation email asynchronously
    sendOrderConfirmationEmail({
      email: order.buyerEmail,
      buyerName: order.buyerName,
      productTitle: order.productTitle,
      amountInr: 0,
      orderId: order._id.toString(),
      invoiceNumber: order.invoiceNumber,
    }).catch((err) => console.error("Order confirmation email failed:", err));

    return {
      orderId: order._id.toString(),
      isFree: true,
      amountPaise: 0,
      amountInr: 0,
      redirectUrl: `/orders/${order._id}`,
    };
  }

  // Create pending order
  const rzpOrder = await createRazorpayOrder({
    amountPaise: pricing.totalPaise,
    receipt: invoiceNumber,
    notes: {
      productId: product._id.toString(),
      creatorId: product.creatorId.toString(),
      buyerEmail: input.buyerEmail,
    },
  });

  const order = await Order.create({
    invoiceNumber,
    creatorId: product.creatorId,
    productId: product._id,
    productTitle: product.title,
    productType: product.type,
    productCoverImage: product.coverImage || "",
    buyerName: input.buyerName.trim(),
    buyerEmail: input.buyerEmail.toLowerCase().trim(),
    buyerPhone: input.buyerPhone.trim(),
    amountPaise: pricing.totalPaise,
    basePricePaise: pricing.basePricePaise,
    discountAmountPaise: pricing.discountAmountPaise,
    orderBumpIncluded: Boolean(pricing.orderBumpProductId),
    orderBumpProductId: pricing.orderBumpProductId,
    orderBumpPricePaise: pricing.orderBumpPricePaise,
    platformFeePaise: pricing.platformFeePaise,
    creatorEarningsPaise: pricing.creatorEarningsPaise,
    couponCode: pricing.appliedCouponCode,
    status: "pending",
    paymentMethod: "upi",
    razorpayOrderId: rzpOrder.id,
    customAnswers: input.customAnswers,
  });

  const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_mock";

  return {
    orderId: order._id.toString(),
    isFree: false,
    razorpayOrderId: rzpOrder.id,
    amountPaise: pricing.totalPaise,
    amountInr: Math.round(pricing.totalPaise / 100),
    keyId,
  };
}

export async function verifyAndFulfillOrder({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  paymentMethod = "upi",
}: {
  orderId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentMethod?: PaymentMethod;
}): Promise<OrderDTO> {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new AppError("Invalid order ID", 400, "INVALID_ORDER");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");
  }

  // Idempotency: if order is already fulfilled, return it
  if (order.status === "paid") {
    return toOrderDTO(order);
  }

  // Verify signature if Razorpay order
  if (order.amountPaise > 0) {
    const effectiveOrderId = razorpayOrderId || order.razorpayOrderId;
    if (!effectiveOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new AppError("Missing payment verification details.", 400, "MISSING_VERIFICATION");
    }

    const isValid = verifyPaymentSignature({
      razorpayOrderId: effectiveOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      order.status = "failed";
      await order.save();
      throw new AppError("Payment signature verification failed.", 400, "INVALID_SIGNATURE");
    }
  }

  // Generate expiring download tokens if digital download
  const product = await Product.findById(order.productId);
  const downloadTokens = product ? generateDownloadTokens(product) : [];

  order.status = "paid";
  order.paymentMethod = paymentMethod;
  if (razorpayPaymentId) order.razorpayPaymentId = razorpayPaymentId;
  if (razorpaySignature) order.razorpaySignature = razorpaySignature;
  order.downloadTokens = downloadTokens;
  await order.save();

  // Increment sales count on product
  if (product) {
    await Product.findByIdAndUpdate(product._id, { $inc: { salesCount: 1 } });
  }

  // Trigger confirmation email asynchronously
  sendOrderConfirmationEmail({
    email: order.buyerEmail,
    buyerName: order.buyerName,
    productTitle: order.productTitle,
    amountInr: Math.round(order.amountPaise / 100),
    orderId: order._id.toString(),
    invoiceNumber: order.invoiceNumber,
  }).catch((err) => console.error("Order confirmation email failed:", err));

  return toOrderDTO(order);
}

export async function fulfillOrderByRazorpayOrderId(
  razorpayOrderId: string,
  paymentId?: string
): Promise<OrderDTO | null> {
  await dbConnect();

  const order = await Order.findOne({ razorpayOrderId });
  if (!order) return null;

  if (order.status === "paid") {
    return toOrderDTO(order);
  }

  const product = await Product.findById(order.productId);
  const downloadTokens = product ? generateDownloadTokens(product) : [];

  order.status = "paid";
  if (paymentId) order.razorpayPaymentId = paymentId;
  order.downloadTokens = downloadTokens;
  await order.save();

  if (product) {
    await Product.findByIdAndUpdate(product._id, { $inc: { salesCount: 1 } });
  }

  // Trigger confirmation email asynchronously
  sendOrderConfirmationEmail({
    email: order.buyerEmail,
    buyerName: order.buyerName,
    productTitle: order.productTitle,
    amountInr: Math.round(order.amountPaise / 100),
    orderId: order._id.toString(),
    invoiceNumber: order.invoiceNumber,
  }).catch((err) => console.error("Order confirmation email failed:", err));

  return toOrderDTO(order);
}

export async function getOrderById(orderId: string): Promise<OrderDTO | null> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(orderId)) return null;
  await dbConnect();

  const order = await Order.findById(orderId);
  return order ? toOrderDTO(order) : null;
}

export async function getOrdersByCreatorId(
  creatorId: string,
  options: {
    status?: OrderStatus;
    search?: string;
    limit?: number;
    skip?: number;
  } = {}
): Promise<{ orders: OrderDTO[]; total: number }> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(creatorId)) {
    return { orders: [], total: 0 };
  }
  await dbConnect();

  const query: Record<string, unknown> = {
    creatorId: new mongoose.Types.ObjectId(creatorId),
  };

  if (options.status) {
    query.status = options.status;
  }

  if (options.search) {
    const searchRegex = new RegExp(options.search.trim(), "i");
    query.$or = [
      { buyerName: searchRegex },
      { buyerEmail: searchRegex },
      { invoiceNumber: searchRegex },
      { productTitle: searchRegex },
    ];
  }

  const limit = options.limit || 50;
  const skip = options.skip || 0;

  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(query),
  ]);

  return {
    orders: orders.map(toOrderDTO),
    total,
  };
}

export async function getOrderMetrics(creatorId: string): Promise<OrderMetricsDTO> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(creatorId)) {
    return {
      totalGrossPaise: 0,
      totalGrossInr: 0,
      totalNetEarningsPaise: 0,
      totalNetEarningsInr: 0,
      totalPlatformFeePaise: 0,
      totalPlatformFeeInr: 0,
      totalOrdersCount: 0,
      paidOrdersCount: 0,
    };
  }
  await dbConnect();

  const creatorObjectId = new mongoose.Types.ObjectId(creatorId);

  const aggregate = await Order.aggregate([
    { $match: { creatorId: creatorObjectId } },
    {
      $group: {
        _id: null,
        totalOrdersCount: { $sum: 1 },
        paidOrdersCount: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
        },
        totalGrossPaise: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amountPaise", 0] },
        },
        totalNetEarningsPaise: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$creatorEarningsPaise", 0] },
        },
        totalPlatformFeePaise: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$platformFeePaise", 0] },
        },
      },
    },
  ]);

  const row = aggregate[0] || {};
  const totalGrossPaise = row.totalGrossPaise || 0;
  const totalNetEarningsPaise = row.totalNetEarningsPaise || 0;
  const totalPlatformFeePaise = row.totalPlatformFeePaise || 0;

  return {
    totalGrossPaise,
    totalGrossInr: Math.round(totalGrossPaise / 100),
    totalNetEarningsPaise,
    totalNetEarningsInr: Math.round(totalNetEarningsPaise / 100),
    totalPlatformFeePaise,
    totalPlatformFeeInr: Math.round(totalPlatformFeePaise / 100),
    totalOrdersCount: row.totalOrdersCount || 0,
    paidOrdersCount: row.paidOrdersCount || 0,
  };
}
