import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function isS3Configured(): boolean {
  const key = process.env.STORAGE_ACCESS_KEY_ID;
  const secret = process.env.STORAGE_SECRET_ACCESS_KEY;
  const bucket = process.env.STORAGE_BUCKET_NAME;

  return Boolean(
    key &&
    secret &&
    bucket &&
    !key.startsWith("your-") &&
    !key.startsWith("xxx")
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
    const bucket = process.env.STORAGE_BUCKET_NAME!;
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
    const bucket = process.env.STORAGE_BUCKET_NAME!;
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: s3Key,
    });

    return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
  }

  // Local download fallback
  return `/api/storage/download/${encodeURIComponent(s3Key)}`;
}
