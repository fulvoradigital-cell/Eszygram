import { DefaultSession } from "next-auth";
import { UserRole, UserPlan } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      plan: UserPlan;
      onboardingCompleted: boolean;
      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    plan: UserPlan;
    onboardingCompleted: boolean;
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    plan: UserPlan;
    onboardingCompleted: boolean;
    username?: string;
  }
}
