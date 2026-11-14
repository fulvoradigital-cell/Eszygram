import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { PasswordResetToken } from "@/models/PasswordResetToken";
import { User } from "@/models/User";

const TOKEN_EXPIRY_HOURS = 1;

export async function createPasswordResetToken(email: string): Promise<string | null> {
  if (!isDatabaseConfigured()) return null;
  await dbConnect();

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    // Return null silently so callers don't leak user existence
    return null;
  }

  // Invalidate any existing tokens for this email
  await PasswordResetToken.deleteMany({ email: user.email });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await PasswordResetToken.create({
    email: user.email,
    token,
    expiresAt,
  });

  return token;
}

export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  if (!isDatabaseConfigured()) return null;
  await dbConnect();

  const record = await PasswordResetToken.findOne({
    token,
    expiresAt: { $gt: new Date() },
  });

  return record ? record.email : null;
}

export async function consumePasswordResetToken(
  token: string,
  newPassword: string
): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;
  await dbConnect();

  const record = await PasswordResetToken.findOne({
    token,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    return false;
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await User.updateOne(
    { email: record.email },
    { $set: { passwordHash } }
  );

  // Invalidate all tokens for this email
  await PasswordResetToken.deleteMany({ email: record.email });

  return true;
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const resetUrl = `${process.env.APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`;

  if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith("re_xxx")) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.RESEND_FROM_EMAIL || "Ezsygram <auth@ezsygram.com>";

      await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: "Reset your Ezsygram password",
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #6D28D9;">Reset Your Ezsygram Password</h2>
            <p>You requested to reset your password. Click the button below to set a new password. This link is valid for 1 hour.</p>
            <p style="margin: 32px 0;">
              <a href="${resetUrl}" style="background-color: #6D28D9; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                Reset Password
              </a>
            </p>
            <p style="color: #6B7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    } catch {
      // In dev/local without active Resend domain, fail silently
    }
  }
}

