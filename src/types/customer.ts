export type CustomerType = "buyer" | "lead";

export interface CustomerDTO {
  id: string;
  type: CustomerType;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpentPaise: number;
  totalSpentInr: number;
  purchasedProductTitles: string[];
  source: string;
  firstSeenAt: string;
  lastActiveAt: string;
}

export interface CustomerMetricsDTO {
  totalAudience: number;
  totalBuyers: number;
  totalLeads: number;
  totalRevenueInr: number;
  averageCustomerValueInr: number;
}
