import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User, { IUser } from "@/models/User";
import { RegisterInput } from "@/validators/auth.validator";

/**
 * Finds a user by email address.
 * Includes password field when explicitly requested (e.g. for credential checks).
 */
export async function findUserByEmail(
  email: string,
  includePassword = false
): Promise<IUser | null> {
  await connectToDatabase();
  const query = User.findOne({ email: email.toLowerCase().trim() });
  if (includePassword) {
    query.select("+password");
  }
  return query.exec();
}

/**
 * Finds a user by username.
 */
export async function findUserByUsername(username: string): Promise<IUser | null> {
  await connectToDatabase();
  return User.findOne({ username: username.toLowerCase().trim() }).exec();
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
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Creates a new creator account with hashed password.
 */
export async function createCredentialsUser(input: RegisterInput): Promise<IUser> {
  await connectToDatabase();

  const hashedPassword = await hashPassword(input.password);

  const user = new User({
    name: input.name,
    email: input.email.toLowerCase().trim(),
    password: hashedPassword,
    username: input.username.toLowerCase().trim(),
    role: "creator",
    authProvider: "credentials",
  });

  return user.save();
}

/**
 * Handles or provisions user upon Google OAuth login.
 */
export async function handleGoogleOAuthUser(profile: {
  email: string;
  name: string;
  image?: string;
}): Promise<IUser> {
  await connectToDatabase();

  let user = await User.findOne({ email: profile.email.toLowerCase().trim() });

  if (!user) {
    // Generate clean unique base username from email or name
    const baseUsername =
      profile.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase() ||
      "creator";
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const username = `${baseUsername}${uniqueSuffix}`;

    user = await User.create({
      name: profile.name || "Creator",
      email: profile.email.toLowerCase().trim(),
      username,
      avatarUrl: profile.image || "",
      authProvider: "google",
      role: "creator",
      isVerified: true,
    });
  } else if (!user.avatarUrl && profile.image) {
    user.avatarUrl = profile.image;
    await user.save();
  }

  return user;
}
