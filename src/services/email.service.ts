import { Resend } from "resend";
import { getAppUrl } from "@/lib/utils";

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("your-") || apiKey.includes("placeholder")) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendBuyerOtpEmail({
  email,
  code,
}: {
  email: string;
  code: string;
}): Promise<{ success: boolean; id?: string }> {
  const appUrl = getAppUrl();
  const resend = getResendClient();

  if (!resend) {
    console.log(
      `\n📧 [DEV MOCK EMAIL] Buyer OTP for ${email}: ${code} (Expires in 10 minutes)\n`
    );
    return { success: true, id: `mock_email_${Date.now()}` };
  }

  try {
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "Ezsygram <noreply@ezsygram.com>";

    const result = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `Your Ezsygram verification code: ${code}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 20px; color: #0F172A;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 800; color: #6D28D9; letter-spacing: -0.5px;">Ezsygram</span>
          </div>
          <h2 style="font-size: 22px; font-weight: 800; color: #0B0B1A; margin-bottom: 8px;">
            Access Your Purchases
          </h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.5; margin-bottom: 24px;">
            Enter the 6-digit code below to view and download all your purchases and courses on Ezsygram:
          </p>
          <div style="background: #F1F5F9; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #6D28D9; font-family: monospace;">
              ${code}
            </span>
          </div>
          <p style="font-size: 12px; color: #94A3B8; line-height: 1.5;">
            This code expires in 10 minutes. If you did not request this login, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Failed to send buyer OTP email:", error);
    return { success: false };
  }
}

export async function sendOrderConfirmationEmail({
  email,
  buyerName,
  productTitle,
  amountInr,
  orderId,
  invoiceNumber,
}: {
  email: string;
  buyerName: string;
  productTitle: string;
  amountInr: number;
  orderId: string;
  invoiceNumber: string;
}): Promise<{ success: boolean; id?: string }> {
  const appUrl = getAppUrl();
  const receiptUrl = `${appUrl}/orders/${orderId}`;
  const resend = getResendClient();

  if (!resend) {
    console.log(
      `\n📧 [DEV MOCK EMAIL] Order Confirmation for ${email}: Order #${invoiceNumber}, Product: ${productTitle}, Amount: ₹${amountInr}, Receipt: ${receiptUrl}\n`
    );
    return { success: true, id: `mock_email_${Date.now()}` };
  }

  try {
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "Ezsygram Orders <orders@ezsygram.com>";

    const result = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `Order Confirmed: ${productTitle} (Invoice #${invoiceNumber})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 20px; color: #0F172A;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 800; color: #6D28D9; letter-spacing: -0.5px;">Ezsygram</span>
          </div>
          <h2 style="font-size: 22px; font-weight: 800; color: #0B0B1A; margin-bottom: 8px;">
            Thank you for your order, ${buyerName}!
          </h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.5; margin-bottom: 20px;">
            Your payment has been successfully confirmed. You have immediate access to your purchase.
          </p>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="color: #64748B; padding-bottom: 8px;">Invoice</td>
                <td style="text-align: right; font-weight: 600; color: #0F172A; padding-bottom: 8px;">#${invoiceNumber}</td>
              </tr>
              <tr>
                <td style="color: #64748B; padding-bottom: 8px;">Product</td>
                <td style="text-align: right; font-weight: 600; color: #0F172A; padding-bottom: 8px;">${productTitle}</td>
              </tr>
              <tr>
                <td style="color: #64748B; font-weight: 700; border-top: 1px solid #E2E8F0; padding-top: 8px;">Total Paid</td>
                <td style="text-align: right; font-weight: 800; color: #6D28D9; border-top: 1px solid #E2E8F0; padding-top: 8px;">
                  ${amountInr === 0 ? "FREE" : `₹${amountInr}`}
                </td>
              </tr>
            </table>
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${receiptUrl}" style="display: inline-block; background: #6D28D9; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 12px; text-decoration: none;">
              Access Your Purchase
            </a>
          </div>
          <p style="font-size: 12px; color: #94A3B8; line-height: 1.5; text-align: center;">
            You can access all your past purchases anytime at <a href="${appUrl}/purchases" style="color: #6D28D9;">${appUrl}/purchases</a> using this email address.
          </p>
        </div>
      `,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false };
  }
}
