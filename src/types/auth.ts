import { DefaultSession } from "next-auth";

export type UserRole = "creator" | "admin" | "customer";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    username?: string;
  }
}
