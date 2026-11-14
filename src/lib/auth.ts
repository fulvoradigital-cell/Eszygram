import { getServerSession, type NextAuthOptions, type Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AppError } from "@/lib/api-response";
import {
  findUserByEmail,
  upsertGoogleUser,
  verifyUserCredentials,
} from "@/services/user.service";
import { loginSchema } from "@/validators/auth.validator";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Email & Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(rawCredentials) {
      const parsed = loginSchema.safeParse(rawCredentials);
      if (!parsed.success) {
        return null;
      }

      const user = await verifyUserCredentials(
        parsed.data.email,
        parsed.data.password
      );

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.avatarUrl ?? null,
        role: user.role,
        plan: user.plan,
        status: user.status,
      };
    },
  }),
];

if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  !process.env.GOOGLE_CLIENT_ID.startsWith("your-")
) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV !== "production"
      ? "ezsygram-local-dev-secret-replace-in-env"
      : undefined),
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) {
          return false;
        }
        const dbUser = await upsertGoogleUser({
          email: user.email,
          name: user.name,
          avatarUrl: user.image,
          googleId: account.providerAccountId,
        });
        if (dbUser.status === "suspended") {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        if (account?.provider === "google" && user.email) {
          const dbUser = await findUserByEmail(user.email);
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.plan = dbUser.plan;
            token.status = dbUser.status;
            token.name = dbUser.name;
          }
        } else {
          token.id = user.id;
          token.role = user.role;
          token.plan = user.plan;
          token.status = user.status;
        }
      }

      if (trigger === "update" && session?.plan) {
        token.plan = session.plan;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role ?? "creator";
        session.user.plan = token.plan ?? "free";
        session.user.status = token.status ?? "active";
      }
      return session;
    },
  },
};

export async function getAuthSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

export async function requireAuthSession(): Promise<Session> {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    throw new AppError("Authentication required.", 401, "UNAUTHORIZED");
  }
  if (session.user.status === "suspended") {
    throw new AppError("Account is suspended.", 403, "ACCOUNT_SUSPENDED");
  }
  return session;
}

