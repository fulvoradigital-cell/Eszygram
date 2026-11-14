import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { contactSchema } from "@/validators/contact.validator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = contactSchema.parse(body);

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    let messageId: string = `msg_${Date.now()}`;

    if (isDatabaseConfigured()) {
      await dbConnect();
      const record = await ContactMessage.create({
        ...validated,
        ip: clientIp,
      });
      messageId = record._id.toString();
    }

    // Resend email notification can be sent here when RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith("re_xxx")) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const toEmail = process.env.RESEND_FROM_EMAIL || "hello@ezsygram.com";
        await resend.emails.send({
          from: "Ezsygram Inquiries <inquiries@ezsygram.com>",
          to: [toEmail],
          subject: `[New Inquiry] ${validated.subject}`,
          text: `From: ${validated.name} (${validated.email})\n\n${validated.message}`,
        });
      } catch {
        // Log in development, do not fail user request if transactional email delivery fails
      }
    }

    return apiSuccess(
      {
        id: messageId,
        message:
          "Thank you for reaching out! Our team will respond to your email within 24 hours.",
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

