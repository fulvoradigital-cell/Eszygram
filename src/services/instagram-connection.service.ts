import crypto from "crypto";
import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { AppError } from "@/lib/api-response";
import { encryptSecret, decryptSecret } from "@/lib/encryption";
import { getAppUrl } from "@/lib/utils";
import {
  InstagramConnection,
  type IInstagramConnection,
} from "@/models/InstagramConnection";
import type { InstagramConnectionDTO, InstagramMediaItem } from "@/types";

export function isMetaOAuthConfigured(): boolean {
  const appId = process.env.META_APP_ID?.trim();
  const appSecret = process.env.META_APP_SECRET?.trim();
  return Boolean(
    appId &&
      appSecret &&
      !appId.startsWith("your-") &&
      !appSecret.startsWith("your-") &&
      !appId.includes("placeholder") &&
      !appSecret.includes("placeholder")
  );
}

function getStateSigningSecret(): string {
  return process.env.NEXTAUTH_SECRET || process.env.ENCRYPTION_KEY || "ezsygram-ig-oauth-state";
}

export function createOAuthState(creatorId: string): string {
  const payload = `${creatorId}.${Date.now()}`;
  const sig = crypto
    .createHmac("sha256", getStateSigningSecret())
    .update(payload)
    .digest("hex")
    .slice(0, 24);
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifyOAuthState(state: string): string | null {
  try {
    const decoded = Buffer.from(state, "base64url").toString("utf8");
    const [creatorId, timestampStr, sig] = decoded.split(".");
    if (!creatorId || !timestampStr || !sig) return null;

    // 15-minute state expiry
    const ts = Number(timestampStr);
    if (!Number.isFinite(ts) || Date.now() - ts > 15 * 60 * 1000) {
      return null;
    }

    const expectedSig = crypto
      .createHmac("sha256", getStateSigningSecret())
      .update(`${creatorId}.${timestampStr}`)
      .digest("hex")
      .slice(0, 24);

    if (sig !== expectedSig) return null;
    return creatorId;
  } catch {
    return null;
  }
}

export function toInstagramConnectionDTO(
  doc: IInstagramConnection | null
): InstagramConnectionDTO {
  const metaOAuthConfigured = isMetaOAuthConfigured();

  if (!doc || doc.status !== "connected") {
    return {
      connected: false,
      isDemoMode: false,
      status: doc?.status || "disconnected",
      metaOAuthConfigured,
    };
  }

  return {
    connected: true,
    instagramAccountId: String(doc.instagramAccountId),
    instagramUsername: String(doc.instagramUsername),
    instagramName: doc.instagramName ? String(doc.instagramName) : undefined,
    profilePictureUrl: doc.profilePictureUrl ? String(doc.profilePictureUrl) : undefined,
    isDemoMode: Boolean(doc.isDemoMode),
    status: doc.status,
    connectedAt: doc.connectedAt ? new Date(doc.connectedAt).toISOString() : undefined,
    metaOAuthConfigured,
  };
}

export async function getInstagramConnection(
  creatorId: string
): Promise<InstagramConnectionDTO> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(creatorId)) {
    return toInstagramConnectionDTO(null);
  }
  await dbConnect();

  const conn = await InstagramConnection.findOne({
    creatorId: new mongoose.Types.ObjectId(creatorId),
  });
  return toInstagramConnectionDTO(conn);
}

export function buildMetaOAuthUrl(creatorId: string): string {
  if (!isMetaOAuthConfigured()) {
    throw new AppError(
      "Meta App credentials (META_APP_ID and META_APP_SECRET) are not configured.",
      400,
      "META_NOT_CONFIGURED"
    );
  }

  const redirectUri = `${getAppUrl()}/api/creator/instagram/callback`;
  const state = createOAuthState(creatorId);
  const scopes = [
    "instagram_basic",
    "instagram_manage_comments",
    "instagram_manage_messages",
    "pages_show_list",
    "pages_read_engagement",
  ].join(",");

  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: redirectUri,
    scope: scopes,
    response_type: "code",
    state,
  });

  return `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;
}

export async function exchangeMetaCodeAndConnect(
  creatorId: string,
  code: string
): Promise<InstagramConnectionDTO> {
  if (!isMetaOAuthConfigured()) {
    throw new AppError("Meta OAuth is not configured.", 400, "META_NOT_CONFIGURED");
  }
  await dbConnect();

  const redirectUri = `${getAppUrl()}/api/creator/instagram/callback`;
  const tokenParams = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    redirect_uri: redirectUri,
    code,
  });

  // 1. Exchange code for short-lived user token
  const tokenRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?${tokenParams.toString()}`
  );
  const tokenJson = (await tokenRes.json()) as {
    access_token?: string;
    error?: { message?: string };
  };

  if (!tokenRes.ok || !tokenJson.access_token) {
    throw new AppError(
      tokenJson.error?.message || "Failed to exchange Meta authorization code.",
      400,
      "META_TOKEN_EXCHANGE_FAILED"
    );
  }

  // 2. Fetch linked Facebook Pages and their Instagram Business/Creator accounts
  const pagesRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name,profile_picture_url}&access_token=${encodeURIComponent(
      tokenJson.access_token
    )}`
  );
  const pagesJson = (await pagesRes.json()) as {
    data?: Array<{
      id: string;
      name: string;
      access_token: string;
      instagram_business_account?: {
        id: string;
        username?: string;
        name?: string;
        profile_picture_url?: string;
      };
    }>;
    error?: { message?: string };
  };

  const linkedPage = pagesJson.data?.find((p) => p.instagram_business_account?.id);
  if (!linkedPage || !linkedPage.instagram_business_account) {
    throw new AppError(
      "No Instagram Professional (Creator/Business) account linked to your Facebook Page was found.",
      400,
      "NO_IG_BUSINESS_ACCOUNT"
    );
  }

  const ig = linkedPage.instagram_business_account;
  const encryptedToken = encryptSecret(linkedPage.access_token);

  const saved = await InstagramConnection.findOneAndUpdate(
    { creatorId: new mongoose.Types.ObjectId(creatorId) },
    {
      creatorId: new mongoose.Types.ObjectId(creatorId),
      instagramAccountId: ig.id,
      instagramUsername: ig.username || linkedPage.name,
      instagramName: ig.name || linkedPage.name,
      profilePictureUrl: ig.profile_picture_url || "",
      pageId: linkedPage.id,
      encryptedAccessToken: encryptedToken,
      tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isDemoMode: false,
      status: "connected",
      connectedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return toInstagramConnectionDTO(saved);
}

export async function connectDemoInstagramAccount(
  creatorId: string,
  username: string,
  displayName?: string
): Promise<InstagramConnectionDTO> {
  if (!isDatabaseConfigured()) {
    throw new AppError("Database not configured.", 503, "DB_UNAVAILABLE");
  }
  await dbConnect();

  const cleanHandle = username.replace(/^@+/, "").trim().toLowerCase() || "creator";
  const demoAccountId = `ig_demo_${creatorId.slice(-8)}`;

  const saved = await InstagramConnection.findOneAndUpdate(
    { creatorId: new mongoose.Types.ObjectId(creatorId) },
    {
      creatorId: new mongoose.Types.ObjectId(creatorId),
      instagramAccountId: demoAccountId,
      instagramUsername: cleanHandle,
      instagramName: displayName?.trim() || cleanHandle,
      isDemoMode: true,
      status: "connected",
      connectedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return toInstagramConnectionDTO(saved);
}

export async function disconnectInstagramAccount(creatorId: string): Promise<void> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(creatorId)) return;
  await dbConnect();

  await InstagramConnection.deleteOne({
    creatorId: new mongoose.Types.ObjectId(creatorId),
  });
}

function getDemoMediaItems(username: string): InstagramMediaItem[] {
  const now = Date.now();
  return [
    {
      id: "demo_reel_guide_01",
      caption: `Comment "GUIDE" below and I'll DM you my complete starter template! 🚀 #${username}`,
      mediaType: "VIDEO",
      mediaProductType: "REELS",
      permalink: `https://instagram.com/${username}`,
      timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "demo_reel_link_02",
      caption: "3 mistakes killing your Instagram growth in 2026 — comment 'LINK' for the full breakdown 👇",
      mediaType: "VIDEO",
      mediaProductType: "REELS",
      permalink: `https://instagram.com/${username}`,
      timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "demo_post_course_03",
      caption: "New mini-course is LIVE! Drop 'COURSE' in the comments to grab the early-bird UPI link ✨",
      mediaType: "CAROUSEL_ALBUM",
      mediaProductType: "FEED",
      permalink: `https://instagram.com/${username}`,
      timestamp: new Date(now - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "demo_reel_freebie_04",
      caption: "Want my exact Notion & Canva toolkit for FREE? Comment 'FREE' and check your DMs!",
      mediaType: "VIDEO",
      mediaProductType: "REELS",
      permalink: `https://instagram.com/${username}`,
      timestamp: new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export async function fetchCreatorInstagramMedia(
  creatorId: string
): Promise<{ connected: boolean; isDemoMode: boolean; media: InstagramMediaItem[] }> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(creatorId)) {
    return { connected: false, isDemoMode: false, media: [] };
  }
  await dbConnect();

  const conn = await InstagramConnection.findOne({
    creatorId: new mongoose.Types.ObjectId(creatorId),
    status: "connected",
  }).select("+encryptedAccessToken");

  if (!conn) {
    return { connected: false, isDemoMode: false, media: [] };
  }

  if (conn.isDemoMode || !conn.encryptedAccessToken) {
    return {
      connected: true,
      isDemoMode: true,
      media: getDemoMediaItems(conn.instagramUsername),
    };
  }

  try {
    const accessToken = decryptSecret(conn.encryptedAccessToken);
    const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(
      conn.instagramAccountId
    )}/media?fields=id,caption,media_type,media_product_type,thumbnail_url,media_url,permalink,timestamp&limit=18&access_token=${encodeURIComponent(
      accessToken
    )}`;

    const res = await fetch(url);
    const json = (await res.json()) as {
      data?: Array<{
        id: string;
        caption?: string;
        media_type?: "VIDEO" | "IMAGE" | "CAROUSEL_ALBUM";
        media_product_type?: "REELS" | "FEED";
        thumbnail_url?: string;
        media_url?: string;
        permalink?: string;
        timestamp?: string;
      }>;
    };

    if (!res.ok || !Array.isArray(json.data)) {
      return { connected: true, isDemoMode: false, media: [] };
    }

    const media: InstagramMediaItem[] = json.data.map((item) => ({
      id: item.id,
      caption: item.caption || "(No caption)",
      mediaType: item.media_type || "IMAGE",
      mediaProductType:
        item.media_product_type === "REELS" || item.media_type === "VIDEO"
          ? "REELS"
          : "FEED",
      thumbnailUrl: item.thumbnail_url || item.media_url,
      permalink: item.permalink,
      timestamp: item.timestamp || new Date().toISOString(),
    }));

    return { connected: true, isDemoMode: false, media };
  } catch (err) {
    console.error("Failed to fetch Instagram media:", err);
    return { connected: true, isDemoMode: false, media: [] };
  }
}
