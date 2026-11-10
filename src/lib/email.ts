import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom =
  process.env.EMAIL_FROM || "Creator Revenue OS <onboarding@resend.dev>";
const appUrl = process.env.APP_URL || "http://localhost:3000";

const resend = resendApiKey && !resendApiKey.startsWith("re_mock")
  ? new Resend(resendApiKey)
  : null;

/**
 * Sends a password reset email with secure token link.
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  name: string,
  token: string
) {
  const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="margin-bottom: 24px;">
        <h2 style="color: #4f46e5; margin: 0; font-size: 22px; font-weight: 800;">Creator Revenue OS</h2>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Password Reset Request</p>
      </div>

      <p style="color: #1e293b; font-size: 15px; line-height: 1.6;">Hi ${name || "Creator"},</p>
      <p style="color: #475569; font-size: 14px; line-height: 1.6;">
        We received a request to reset your password. Click the button below to choose a new password. This link is valid for 1 hour.
      </p>

      <div style="margin: 28px 0; text-align: center;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: 600; font-size: 14px; display: inline-block;">
          Reset My Password
        </a>
      </div>

      <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
        Or copy and paste this link in your browser:<br/>
        <a href="${resetUrl}" style="color: #6366f1; word-break: break-all;">${resetUrl}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
        If you did not request a password reset, you can safely ignore this email.
      </p>
    </div>
  `;

  if (resend) {
    try {
      await resend.emails.send({
        from: emailFrom,
        to: toEmail,
        subject: "Reset your Creator Revenue OS password",
        html: htmlContent,
      });
      return { success: true };
    } catch (error) {
      console.error("[RESEND_EMAIL_ERROR]", error);
      // Fallback in case of domain verification issues on trial accounts
      console.log(`[LOCAL_RESET_URL] Password reset link for ${toEmail}: ${resetUrl}`);
      return { success: true, fallback: true };
    }
  } else {
    // Development / mock fallback logging
    console.log(`\n======================================================`);
    console.log(`📧 [MOCK RESEND EMAIL] Password Reset Email`);
    console.log(`To: ${toEmail}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`======================================================\n`);
    return { success: true, mock: true };
  }
}

