import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { loginSchema } from "@/validators/auth.validator";
import {
  findUserByEmail,
  verifyPassword,
  handleGoogleOAuthUser,
  findCreatorProfileByUserId,
} from "@/services/user.service";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "creator@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        // Strict Zod input validation
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // Fetch user with hidden passwordHash
        const user = await findUserByEmail(email, true);
        if (!user || !user.passwordHash) {
          return null;
        }

        // Verify password hash
        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        // Check if creator has a profile
        const profile = await findCreatorProfileByUserId(user._id.toString());

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
          onboardingCompleted: user.onboardingCompleted,
          username: profile?.username,
          image: profile?.avatarUrl || "",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          const dbUser = await handleGoogleOAuthUser({
            email: profile.email,
            name: profile.name || user.name || "Creator",
            image: (profile as { picture?: string }).picture || user.image || "",
          });

          const creatorProfile = await findCreatorProfileByUserId(
            dbUser._id.toString()
          );

          user.id = dbUser._id.toString();
          user.role = dbUser.role;
          user.plan = dbUser.plan;
          user.onboardingCompleted = dbUser.onboardingCompleted;
          user.username = creatorProfile?.username;
          return true;
        } catch (error) {
          console.error("[GOOGLE_AUTH_CALLBACK_ERROR]", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.plan = user.plan;
        token.onboardingCompleted = user.onboardingCompleted;
        token.username = user.username;
      }

      // Allow client-side session.update() calls (e.g. after completing onboarding)
      if (trigger === "update" && session) {
        if (session.user?.onboardingCompleted !== undefined) {
          token.onboardingCompleted = session.user.onboardingCompleted;
        }
        if (session.user?.username !== undefined) {
          token.username = session.user.username;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.plan = token.plan;
        session.user.onboardingCompleted = Boolean(token.onboardingCompleted);
        session.user.username = token.username as string | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
