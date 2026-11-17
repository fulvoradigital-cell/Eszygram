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

export interface SendOrderConfirmationParams {
  email: string;
  buyerName: string;
  productTitle: string;
  amountInr: number;
  orderId: string;
  invoiceNumber: string;
  productType?: string;
  paymentMethod?: string;
  paymentId?: string;
  creatorName?: string;
  downloadTokens?: Array<{
    token: string;
    fileName: string;
  }>;
}

export async function sendOrderConfirmationEmail({
  email,
  buyerName,
  productTitle,
  amountInr,
  orderId,
  invoiceNumber,
  productType,
  paymentMethod = "upi",
  paymentId,
  creatorName,
  downloadTokens = [],
}: SendOrderConfirmationParams): Promise<{ success: boolean; id?: string }> {
  const appUrl = getAppUrl();
  const receiptUrl = `${appUrl}/orders/${orderId}`;
  const purchasesUrl = `${appUrl}/purchases`;
  const resend = getResendClient();

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  // In development / testing without live Resend key, log the complete invoice and links
  if (!resend) {
    const downloadLinksLog =
      downloadTokens.length > 0
        ? downloadTokens
            .map((t) => `\n    • ${t.fileName}: ${appUrl}/api/downloads/${t.token}`)
            .join("")
        : " None (Non-download product)";

    console.log(
      `\n================================================================================` +
      `\n📧 [DEV TRANSACTIONAL EMAIL DISPATCHED]` +
      `\nTo: ${email}` +
      `\nBuyer: ${buyerName}` +
      `\nSubject: Order Confirmed: ${productTitle} • Invoice #${invoiceNumber}` +
      `\nInvoice: #${invoiceNumber} | Date: ${formattedDate}` +
      `\nTotal Paid: ${amountInr === 0 ? "FREE" : `₹${amountInr}`} | Method: ${paymentMethod.toUpperCase()}` +
      (paymentId ? `\nPayment ID: ${paymentId}` : "") +
      `\nReceipt Page: ${receiptUrl}` +
      `\nDownload Link(s):${downloadLinksLog}` +
      `\n================================================================================\n`
    );
    return { success: true, id: `mock_email_${Date.now()}` };
  }

  try {
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "Ezsygram Orders <orders@ezsygram.com>";

    const downloadSectionHtml =
      downloadTokens.length > 0
        ? `
          <div style="background: #FAF5FF; border: 1.5px solid #DDD6FE; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <div style="font-size: 15px; font-weight: 800; color: #5B21B6; margin-bottom: 6px;">
              📥 Your Downloadable Files
            </div>
            <p style="font-size: 13px; color: #4C1D95; margin: 0 0 16px 0; line-height: 1.5;">
              Click the button below to download your purchased files immediately:
            </p>
            ${downloadTokens
              .map(
                (t) => `
              <div style="background: #ffffff; border: 1px solid #E9D5FF; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-weight: 700; font-size: 14px; color: #1E1B4B; word-break: break-all;">
                    ${t.fileName}
                  </div>
                  <div style="font-size: 11px; color: #6B7280; margin-top: 2px;">
                    Valid for 24 hours
                  </div>
                </div>
                <div style="margin-top: 8px;">
                  <a href="${appUrl}/api/downloads/${t.token}" style="display: inline-block; background: #6D28D9; color: #ffffff; font-weight: 700; font-size: 13px; padding: 10px 22px; border-radius: 10px; text-decoration: none; text-align: center;">
                    Download File
                  </a>
                </div>
              </div>
            `
              )
              .join("")}
            <p style="font-size: 11px; color: #7C3AED; margin: 12px 0 0 0; line-height: 1.4;">
              💡 <em>Tip: You can also renew or re-download your files anytime from your <a href="${purchasesUrl}" style="color: #6D28D9; font-weight: 700; text-decoration: underline;">Buyer Portal</a>.</em>
            </p>
          </div>
        `
        : "";

    const result = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `Order Confirmed: ${productTitle} • Invoice #${invoiceNumber}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; color: #0F172A; background: #FFFFFF;">
          <div style="margin-bottom: 24px; text-align: center;">
            <div style="font-size: 24px; font-weight: 900; color: #6D28D9; letter-spacing: -0.5px;">Ezsygram</div>
            <div style="font-size: 11px; color: #64748B; text-transform: uppercase; tracking: 1px; margin-top: 2px; font-weight: 600;">Sell. Automate. Grow.</div>
          </div>

          <h1 style="font-size: 22px; font-weight: 800; color: #0B0B1A; margin-bottom: 8px; text-align: center;">
            Thank you for your order, ${buyerName}!
          </h1>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; text-align: center;">
            Your payment has been successfully confirmed. Your invoice receipt and access details are provided below.
          </p>

          ${downloadSectionHtml}

          <!-- Tax Invoice & Order Details -->
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; margin-bottom: 14px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">
              Official Order Receipt &amp; Invoice
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="color: #64748B; padding: 6px 0;">Invoice Number</td>
                <td style="text-align: right; font-weight: 700; color: #0F172A; padding: 6px 0;">#${invoiceNumber}</td>
              </tr>
              <tr>
                <td style="color: #64748B; padding: 6px 0;">Date</td>
                <td style="text-align: right; font-weight: 600; color: #0F172A; padding: 6px 0;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="color: #64748B; padding: 6px 0;">Product</td>
                <td style="text-align: right; font-weight: 600; color: #0F172A; padding: 6px 0;">${productTitle}</td>
              </tr>
              ${creatorName ? `<tr><td style="color: #64748B; padding: 6px 0;">Seller</td><td style="text-align: right; font-weight: 600; color: #0F172A; padding: 6px 0;">${creatorName}</td></tr>` : ""}
              <tr>
                <td style="color: #64748B; padding: 6px 0;">Payment Method</td>
                <td style="text-align: right; font-weight: 600; color: #0F172A; padding: 6px 0; text-transform: uppercase;">${paymentMethod}</td>
              </tr>
              ${paymentId ? `<tr><td style="color: #64748B; padding: 6px 0;">Payment Ref ID</td><td style="text-align: right; font-family: monospace; font-size: 11px; color: #0F172A; padding: 6px 0;">${paymentId}</td></tr>` : ""}
              <tr>
                <td style="color: #0F172A; font-weight: 800; border-top: 1.5px solid #CBD5E1; padding-top: 10px; font-size: 14px;">Total Paid</td>
                <td style="text-align: right; font-weight: 900; color: #6D28D9; border-top: 1.5px solid #CBD5E1; padding-top: 10px; font-size: 16px;">
                  ${amountInr === 0 ? "FREE" : `₹${amountInr.toLocaleString("en-IN")}`}
                </td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-bottom: 28px;">
            <a href="${receiptUrl}" style="display: inline-block; background: #6D28D9; color: #ffffff; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 12px; text-decoration: none; margin: 4px;">
              View Full Order Receipt
            </a>
            <a href="${purchasesUrl}" style="display: inline-block; background: #F1F5F9; color: #1E293B; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 12px; text-decoration: none; margin: 4px;">
              My Purchases Library
            </a>
          </div>

          <div style="border-top: 1px solid #E2E8F0; padding-top: 20px; text-align: center; font-size: 12px; color: #94A3B8; line-height: 1.6;">
            <p style="margin: 0 0 6px 0;">
              Have questions about your order? Simply reply directly to this email.
            </p>
            <p style="margin: 0; font-size: 11px; color: #CBD5E1;">
              Ezsygram • Sell. Automate. Grow.
            </p>
          </div>
        </div>
      `,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false };
  }
}
