import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey(): Buffer {
  const rawKey = process.env.ENCRYPTION_KEY?.trim();

  if (rawKey && /^[0-9a-fA-F]{64}$/.test(rawKey) && !/^0+$/.test(rawKey)) {
    return Buffer.from(rawKey, "hex");
  }

  // Derive a 32-byte key from ENCRYPTION_KEY or NEXTAUTH_SECRET for dev fallback
  const seed =
    rawKey && !/^0+$/.test(rawKey)
      ? rawKey
      : process.env.NEXTAUTH_SECRET || "ezsygram-local-dev-encryption-seed";

  return crypto.createHash("sha256").update(seed).digest();
}

export function encryptSecret(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptSecret(ciphertext: string): string {
  const parts = ciphertext.split(":");
  const ivHex = parts[0];
  const tagHex = parts[1];
  const dataHex = parts[2];

  if (parts.length !== 3 || !ivHex || !tagHex || !dataHex) {
    throw new Error("Invalid encrypted payload format.");
  }

  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(tagHex, "hex");
  const encrypted = Buffer.from(dataHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
