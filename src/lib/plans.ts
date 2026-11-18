import type { UserPlan } from "@/types";

export type BillingCycle = "monthly" | "yearly";

export interface PlanDefinition {
  id: UserPlan;
  name: string;
  tagline: string;
  monthlyPriceInr: number;
  monthlyPricePaise: number;
  yearlyPriceInr: number;
  yearlyPricePaise: number;
  platformFeePercent: number;
  feeLabel: string;
  popular?: boolean;
  maxProducts: number | null; // null = unlimited
  maxAutomationRules: number | null; // null = unlimited
  features: string[];
}

export const PLAN_CATALOG: Record<UserPlan, PlanDefinition> = {
  free: {
    id: "free",
    name: "Starter (Free)",
    tagline: "For new Indian creators & coaches starting out",
    monthlyPriceInr: 0,
    monthlyPricePaise: 0,
    yearlyPriceInr: 0,
    yearlyPricePaise: 0,
    platformFeePercent: 10,
    feeLabel: "10% platform fee per sale",
    maxProducts: 3,
    maxAutomationRules: 3,
    features: [
      "Up to 3 digital products or courses",
      "Standard link-in-bio storefront",
      "Instant UPI & card checkout",
      "Up to 3 active Instagram comment triggers",
      "Automated email invoices & file vault",
    ],
  },
  pro: {
    id: "pro",
    name: "Creator Pro",
    tagline: "For creators actively selling on Instagram",
    monthlyPriceInr: 499,
    monthlyPricePaise: 49900,
    yearlyPriceInr: 4990,
    yearlyPricePaise: 499000,
    platformFeePercent: 5,
    feeLabel: "5% platform fee per sale",
    popular: true,
    maxProducts: null,
    maxAutomationRules: null,
    features: [
      "Unlimited digital products, courses & bookings",
      "Unlimited Instagram comment-to-DM automation",
      "Custom discount coupons & order bumps",
      "Remove 'Made with Ezsygram' storefront badge",
      "Full 30-day revenue & DM attribution analytics",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    tagline: "For scaling educators, agencies & top creators",
    monthlyPriceInr: 1499,
    monthlyPricePaise: 149900,
    yearlyPriceInr: 14990,
    yearlyPricePaise: 1499000,
    platformFeePercent: 0,
    feeLabel: "0% platform fee (Keep 100% of sales)",
    maxProducts: null,
    maxAutomationRules: null,
    features: [
      "Everything in Creator Pro",
      "0% Ezsygram platform fee on all sales",
      "Priority T+0 same-day settlement routing",
      "Custom domain mapping (store.yourbrand.com)",
      "VIP 24/7 WhatsApp & dedicated onboarding support",
    ],
  },
};

export const PLAN_LIST: PlanDefinition[] = [
  PLAN_CATALOG.free,
  PLAN_CATALOG.pro,
  PLAN_CATALOG.business,
];

export function getPlanPricePaise(plan: UserPlan, billingCycle: BillingCycle): number {
  const def = PLAN_CATALOG[plan];
  return billingCycle === "yearly" ? def.yearlyPricePaise : def.monthlyPricePaise;
}
