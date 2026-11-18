import { NextRequest, NextResponse } from "next/server";
import {
  exchangeMetaCodeAndConnect,
  verifyOAuthState,
} from "@/services/instagram-connection.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error_description") || searchParams.get("error");

  const redirectBase = new URL("/dashboard/automations", req.url);

  if (errorParam) {
    redirectBase.searchParams.set("ig_error", errorParam);
    return NextResponse.redirect(redirectBase);
  }

  if (!code || !state) {
    redirectBase.searchParams.set("ig_error", "Missing authorization code or state.");
    return NextResponse.redirect(redirectBase);
  }

  const creatorId = verifyOAuthState(state);
  if (!creatorId) {
    redirectBase.searchParams.set("ig_error", "Invalid or expired OAuth state. Please try again.");
    return NextResponse.redirect(redirectBase);
  }

  try {
    await exchangeMetaCodeAndConnect(creatorId, code);
    redirectBase.searchParams.set("ig", "connected");
    return NextResponse.redirect(redirectBase);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to connect Instagram account.";
    redirectBase.searchParams.set("ig_error", msg);
    return NextResponse.redirect(redirectBase);
  }
}
