import type { DefaultSession } from "next-auth";

export type UserRole = "creator" | "buyer" | "admin";
export type UserPlan = "free" | "pro" | "business";
export type UserStatus = "active" | "suspended";

export interface PublicUserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
  planExpiresAt: string | null;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      plan: UserPlan;
      status: UserStatus;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    plan: UserPlan;
    status: UserStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    plan: UserPlan;
    status: UserStatus;
  }
}

