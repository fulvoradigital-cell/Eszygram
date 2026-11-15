import crypto from "crypto";
import Razorpay from "razorpay";

let razorpayInstance: Razorpay | null = null;

export function isRazorpayConfigured(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return Boolean(
    keyId &&
      keySecret &&
      !keyId.includes("placeholder") &&
      !keySecret.includes("placeholder")
  );
}

export function getRazorpayClient(): Razorpay | null {
  if (!isRazorpayConfigured()) {
    return null;
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  return razorpayInstance;
}

export async function createRazorpayOrder({
  amountPaise,
  receipt,
  notes = {},
}: {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string }> {
  const client = getRazorpayClient();

  if (!client) {
    // Graceful dev/test fallback when Razorpay credentials are not configured
    const mockId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      id: mockId,
      amount: amountPaise,
      currency: "INR",
    };
  }

  const order = await client.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
    notes,
  });

  return {
    id: order.id,
    amount: typeof order.amount === "number" ? order.amount : Number(order.amount),
    currency: order.currency || "INR",
  };
}

export function verifyPaymentSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret || !isRazorpayConfigured()) {
    // In mock/test mode without live keys, allow mock signatures
    return (
      razorpayOrderId.startsWith("order_mock_") ||
      razorpayPaymentId.startsWith("pay_mock_") ||
      razorpaySignature === "mock_signature"
    );
  }

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return expectedSignature === razorpaySignature;
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return expectedSignature === signature;
}
