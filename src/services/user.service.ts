import crypto from "crypto";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User, { IUser } from "@/models/User";
import CreatorProfile, { ICreatorProfile } from "@/models/CreatorProfile";
import {
  RegisterInput,
  OnboardingInput,
  RESERVED_USERNAMES,
} from "@/validators/auth.validator";

/**
 * Finds a user by email address.
 * Includes passwordHash field when explicitly requested.
 */
export async function findUserByEmail(
  email: string,
  includePassword = false
): Promise<IUser | null> {
  await connectToDatabase();
  const query = User.findOne({ email: email.toLowerCase().trim() });
  if (includePassword) {
    query.select("+passwordHash");
  }
  return query.exec();
}

/**
 * Finds a user by Mongo document ID.
 */
export async function findUserById(id: string): Promise<IUser | null> {
  await connectToDatabase();
  return User.findById(id).exec();
}

/**
 * Hashes a plaintext password with bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compares plaintext password against bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Creates a new user with hashed password.
 */
export async function createCredentialsUser(input: RegisterInput): Promise<IUser> {
  await connectToDatabase();

  const hashedPassword = await hashPassword(input.password);

  const user = new User({
    name: input.name.trim(),
    email: input.email.toLowerCase().trim(),
    passwordHash: hashedPassword,
    role: "creator",
    plan: "free",
    onboardingCompleted: false,
  });

  return user.save();
}

/**
 * Generates a crypto-secure password reset token and saves it with a 1-hour expiration.
 */
export async function createPasswordResetToken(
  email: string
): Promise<{ user: IUser; token: string } | null> {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return null;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    return { user, token: rawToken };
  } catch (err) {
    console.warn("[RESET_TOKEN_DB_WARNING]", (err as Error).message);
    return null;
  }
}

/**
 * Verifies a password reset token and updates the user's password.
 */
export async function resetPasswordWithToken(
  rawToken: string,
  newPassword: string
): Promise<IUser | null> {
  await connectToDatabase();

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) {
    return null;
  }

  user.passwordHash = await hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return user;
}

/**
 * Checks whether a given username is available or reserved/taken.
 */
export async function checkUsernameAvailability(
  username: string
): Promise<{ available: boolean; reason?: string }> {
  const cleanUsername = username.toLowerCase().trim();

  // 1. Reserved words check
  if (
    RESERVED_USERNAMES.includes(
      cleanUsername as (typeof RESERVED_USERNAMES)[number]
    )
  ) {
    return {
      available: false,
      reason: "This username is reserved by the system.",
    };
  }

  // 2. Database lookup in CreatorProfile
  try {
    await connectToDatabase();
    const existing = await CreatorProfile.findOne({ username: cleanUsername });
    if (existing) {
      return {
        available: false,
        reason: "This username is already taken by another creator.",
      };
    }
  } catch (err) {
    console.warn("[CHECK_USERNAME_DB_WARNING] MongoDB connection skipped or unavailable:", (err as Error).message);
  }

  return { available: true };
}

/**
 * Completes creator onboarding by creating CreatorProfile and updating User.onboardingCompleted.
 */
export async function completeCreatorOnboarding(
  userId: string,
  data: OnboardingInput
): Promise<ICreatorProfile> {
  await connectToDatabase();

  const cleanUsername = data.username.toLowerCase().trim();

  // Verify username availability
  const check = await checkUsernameAvailability(cleanUsername);
  if (!check.available) {
    throw new Error(check.reason || "Username is not available");
  }

  // Create or update CreatorProfile
  const profile = await CreatorProfile.findOneAndUpdate(
    { userId },
    {
      userId,
      username: cleanUsername,
      displayName: data.displayName.trim(),
      bio: data.bio || "",
      avatarUrl: data.avatarUrl || "",
      niche: data.niche || "Other",
      socialLinks: data.socialLinks || {},
      theme: data.theme || {
        primaryColor: "#6366f1",
        layout: "classic",
        background: "default",
      },
    },
    { upsert: true, new: true, runValidators: true }
  );

  // Mark onboardingCompleted on User
  await User.findByIdAndUpdate(userId, {
    onboardingCompleted: true,
  });

  return profile;
}

/**
 * Finds a creator profile by user ID.
 */
export async function findCreatorProfileByUserId(
  userId: string
): Promise<ICreatorProfile | null> {
  await connectToDatabase();
  return CreatorProfile.findOne({ userId }).exec();
}

/**
 * Finds a creator profile by public username.
 */
export async function findCreatorProfileByUsername(
  username: string
): Promise<ICreatorProfile | null> {
  await connectToDatabase();
  return CreatorProfile.findOne({ username: username.toLowerCase().trim() }).exec();
}

/**
 * Handles Google OAuth login: finds existing user or creates new creator.
 */
export async function handleGoogleOAuthUser(profile: {
  email: string;
  name: string;
  image?: string;
}): Promise<IUser> {
  await connectToDatabase();

  let user = await User.findOne({ email: profile.email.toLowerCase().trim() });

  if (!user) {
    user = await User.create({
      name: profile.name || "Creator",
      email: profile.email.toLowerCase().trim(),
      role: "creator",
      plan: "free",
      onboardingCompleted: false,
    });
  }

  return user;
}
