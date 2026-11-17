import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "mp4":
      return "video/mp4";
    case "zip":
      return "application/zip";
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "mov":
      return "video/quicktime";
    case "webm":
      return "video/webm";
    case "mkv":
      return "video/x-matroska";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "gif":
      return "image/gif";
    case "epub":
      return "application/epub+zip";
    case "txt":
      return "text/plain";
    case "csv":
      return "text/csv";
    case "json":
      return "application/json";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xls":
      return "application/vnd.ms-excel";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    default:
      return "application/octet-stream";
  }
}

function isS3Configured(): boolean {
  const key = process.env.STORAGE_ACCESS_KEY_ID?.trim();
  const secret = process.env.STORAGE_SECRET_ACCESS_KEY?.trim();
  const bucket = (process.env.STORAGE_BUCKET_NAME || process.env.STORAGE_BUCKET)?.trim();

  return Boolean(
    key &&
    secret &&
    bucket &&
    !key.startsWith("your-") &&
    !key.startsWith("xxx") &&
    !key.includes("placeholder")
  );
}

function getS3Client(): S3Client | null {
  if (!isS3Configured()) return null;

  return new S3Client({
    region: process.env.STORAGE_REGION || "auto",
    endpoint: process.env.STORAGE_ENDPOINT, // e.g. https://<account_id>.r2.cloudflarestorage.com
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
    },
  });
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
}

export interface PresignedUploadResult {
  uploadUrl: string;
  s3Key: string;
  isLocal: boolean;
  publicUrl?: string;
}

export async function generatePresignedUploadUrl(params: {
  userId: string;
  filename: string;
  mimeType: string;
  size: number;
  category?: "file" | "image" | "course";
}): Promise<PresignedUploadResult> {
  const { userId, filename, mimeType, category = "file" } = params;
  const safeName = sanitizeFilename(filename);
  const s3Key = `creators/${userId}/${category}/${Date.now()}-${safeName}`;

  const s3 = getS3Client();

  if (s3) {
    const bucket = (process.env.STORAGE_BUCKET_NAME || process.env.STORAGE_BUCKET)!;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      ContentType: mimeType,
    });

    // 15-minute upload URL
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
    const publicBase = process.env.STORAGE_PUBLIC_URL?.replace(/\/$/, "");
    const publicUrl = publicBase ? `${publicBase}/${s3Key}` : undefined;

    return {
      uploadUrl,
      s3Key,
      isLocal: false,
      publicUrl,
    };
  }

  // Local fallback mode when S3 is not yet connected
  const localKey = `local_${Date.now()}_${safeName}`;
  return {
    uploadUrl: `/api/storage/local-upload`,
    s3Key: localKey,
    isLocal: true,
    publicUrl: `/uploads/${localKey}`,
  };
}

export async function generatePresignedDownloadUrl(
  s3Key: string,
  expiresInSeconds = 900
): Promise<string> {
  const s3 = getS3Client();

  if (s3 && !s3Key.startsWith("local_")) {
    const bucket = (process.env.STORAGE_BUCKET_NAME || process.env.STORAGE_BUCKET)!;
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: s3Key,
    });

    return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
  }

  // Local download fallback
  return `/api/storage/download/${encodeURIComponent(s3Key)}`;
}

export const getExpiringDownloadUrl = generatePresignedDownloadUrl;
