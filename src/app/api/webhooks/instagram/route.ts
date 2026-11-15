import { NextRequest, NextResponse } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import {
  processInstagramWebhookPayload,
  verifyInstagramWebhook,
  verifyMetaWebhookSignature,
} from "@/services/instagram.service";

export const dynamic = "force-dynamic";

/**
 * Meta Webhook Hub Challenge Handshake
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifiedChallenge = verifyInstagramWebhook(mode, token, challenge);

  if (verifiedChallenge) {
    return new NextResponse(verifiedChallenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

/**
 * Meta Webhook Ingestion for Comments & DMs
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256");

    const isSigValid = verifyMetaWebhookSignature(rawBody, signature);
    if (!isSigValid) {
      return apiError("Invalid Meta webhook signature.", 401, "INVALID_SIGNATURE");
    }

    const payload = JSON.parse(rawBody);
    const result = await processInstagramWebhookPayload(payload);

    return apiSuccess({ received: true, ...result });
  } catch (error) {
    return handleApiError(error);
  }
}
