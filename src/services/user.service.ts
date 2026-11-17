import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { AppError } from "@/lib/api-response";
import { User, type IUser } from "@/models/User";
import type { PublicUserDTO } from "@/types";
import type { RegisterInput } from "@/validators";

const BCRYPT_ROUNDS = 12;

export function toPublicUserDTO(user: IUser): PublicUserDTO {
  const plain =
    typeof (user as { toObject?: () => Record<string, unknown> }).toObject === "function"
      ? (user as { toObject: () => Record<string, unknown> }).toObject()
      : (user as unknown as Record<string, unknown>);

  return {
    id: (plain._id || user._id).toString(),
    name: String(plain.name || ""),
    email: String(plain.email || ""),
    role: plain.role as PublicUserDTO["role"],
    plan: plain.plan as PublicUserDTO["plan"],
    planExpiresAt: plain.planExpiresAt
      ? new Date(plain.planExpiresAt as string | number | Date).toISOString()
      : null,
    status: plain.status as PublicUserDTO["status"],
    avatarUrl: plain.avatarUrl ? String(plain.avatarUrl) : undefined,
    createdAt: plain.createdAt
      ? new Date(plain.createdAt as string | number | Date).toISOString()
      : new Date().toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  await dbConnect();
  return User.findOne({ email: email.trim().toLowerCase() });
}

export async function findUserById(userId: string): Promise<PublicUserDTO | null> {
  await dbConnect();
  const user = await User.findById(userId);
  return user ? toPublicUserDTO(user) : null;
}

export async function verifyUserCredentials(
  email: string,
  password: string
): Promise<PublicUserDTO | null> {
  await dbConnect();
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+passwordHash");

  if (!user || !user.passwordHash) {
    return null;
  }

  if (user.status === "suspended") {
    throw new AppError(
      "Your account has been suspended. Please contact support.",
      403,
      "ACCOUNT_SUSPENDED"
    );
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return null;
  }

  return toPublicUserDTO(user);
}

export async function createUserWithPassword(
  input: RegisterInput
): Promise<PublicUserDTO> {
  await dbConnect();

  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new AppError(
      "An account with this email already exists.",
      409,
      "EMAIL_ALREADY_EXISTS"
    );
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await User.create({
    name: input.name.trim(),
    email: input.email.toLowerCase(),
    passwordHash,
    role: "creator",
    plan: "free",
    status: "active",
  });

  return toPublicUserDTO(user);
}

export const createUser = createUserWithPassword;

export async function upsertGoogleUser(params: {
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  googleId?: string | null;
}): Promise<PublicUserDTO> {
  await dbConnect();
  const normalizedEmail = params.email.trim().toLowerCase();

  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    user = await User.create({
      name: params.name?.trim() || normalizedEmail.split("@")[0] || "Creator",
      email: normalizedEmail,
      avatarUrl: params.avatarUrl ?? undefined,
      googleId: params.googleId ?? undefined,
      role: "creator",
      plan: "free",
      status: "active",
    });
  } else {
    let dirty = false;
    if (params.googleId && !user.googleId) {
      user.googleId = params.googleId;
      dirty = true;
    }
    if (params.avatarUrl && !user.avatarUrl) {
      user.avatarUrl = params.avatarUrl;
      dirty = true;
    }
    if (dirty) {
      await user.save();
    }
  }

  return toPublicUserDTO(user);
}

