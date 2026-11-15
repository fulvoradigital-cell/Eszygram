import crypto from "crypto";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { BuyerOtp } from "@/models/BuyerOtp";
import { sendBuyerOtpEmail } from "./email.service";
import { AppError } from "@/lib/api-response";
import type { BuyerSession } from "@/types";

const COOKIE_NAME = "ezsygram_buyer_token";

function getSecretKey(): string {
  return (
    process.env.NEXTAUTH_SECRET ||
    process.env.ENCRYPTION_KEY ||
    "ezsygram-default-buyer-jwt-secret-key-32b"
  );
}

/**
 * Creates a lightweight HMAC-SHA256 signed session token for buyers.
 */
export function signBuyerToken(email: string): string {
  const payload: BuyerSession = {
    email: email.toLowerCase().trim(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
  };

  const secret = getSecretKey();
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

/**
 * Verifies the HMAC-SHA256 signed session token.
 */
export function verifyBuyerToken(token: string): BuyerSession | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const header = parts[0];
    const body = parts[1];
    const signature = parts[2];
    if (!header || !body || !signature) return null;

    const secret = getSecretKey();
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${header}.${body}`)
      .digest("base64url");

    if (expectedSignature !== signature) return null;

    const payload: BuyerSession = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    );

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Generates and sends a 6-digit numeric OTP to the buyer's email.
 */
export async function sendBuyerOtp(email: string): Promise<{ success: boolean }> {
  if (!isDatabaseConfigured()) {
    throw new AppError("Database not connected.", 503, "DB_UNAVAILABLE");
  }
  await dbConnect();

  const cleanEmail = email.toLowerCase().trim();

  // Generate 6-digit numeric code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Delete any prior OTPs for this email
  await BuyerOtp.deleteMany({ email: cleanEmail });

  // Save new OTP
  await BuyerOtp.create({
    email: cleanEmail,
    code,
    attempts: 0,
    expiresAt,
  });

  // Send via email service
  await sendBuyerOtpEmail({ email: cleanEmail, code });

  return { success: true };
}

/**
 * Verifies the OTP and returns a signed session token.
 */
export async function verifyBuyerOtp(
  email: string,
  code: string
): Promise<{ token: string; email: string }> {
  if (!isDatabaseConfigured()) {
    throw new AppError("Database not connected.", 503, "DB_UNAVAILABLE");
  }
  await dbConnect();

  const cleanEmail = email.toLowerCase().trim();
  const cleanCode = code.trim();

  const otpRecord = await BuyerOtp.findOne({ email: cleanEmail });

  if (!otpRecord) {
    throw new AppError("Verification code not found or expired. Please request a new code.", 400, "INVALID_OTP");
  }

  if (otpRecord.expiresAt.getTime() < Date.now()) {
    await BuyerOtp.deleteOne({ _id: otpRecord._id });
    throw new AppError("Verification code has expired. Please request a new code.", 400, "EXPIRED_OTP");
  }

  if (otpRecord.attempts >= 5) {
    await BuyerOtp.deleteOne({ _id: otpRecord._id });
    throw new AppError("Too many incorrect attempts. Please request a new code.", 429, "TOO_MANY_ATTEMPTS");
  }

  if (otpRecord.code !== cleanCode) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new AppError("Incorrect verification code.", 400, "INCORRECT_CODE");
  }

  // Delete used OTP
  await BuyerOtp.deleteOne({ _id: otpRecord._id });

  // Generate session token
  const token = signBuyerToken(cleanEmail);

  return { token, email: cleanEmail };
}

export { COOKIE_NAME };
