export type AnalyticsTimeRange = "today" | "7d" | "30d" | "90d" | "all";

export interface AnalyticsOverviewMetrics {
  totalRevenuePaise: number;
  totalRevenueInr: number;
  netEarningsPaise: number;
  netEarningsInr: number;
  totalOrders: number;
  paidOrders: number;
  storeViews: number;
  uniqueVisitors: number;
  blockClicks: number;
  conversionRate: number; // percentage 0.0 - 100.0
  avgOrderValueInr: number;
  leadCount: number;
  // Growth comparison vs previous equal period (% change)
  revenueGrowth: number;
  ordersGrowth: number;
  viewsGrowth: number;
  conversionGrowth: number;
}

export interface TimeSeriesPoint {
  date: string; // e.g. "Nov 12"
  views: number;
  clicks: number;
  orders: number;
  revenueInr: number;
}

export interface ConversionFunnelStage {
  stage: string;
  count: number;
  percentage: number; // relative to first stage
  dropoffRate: number; // % drop from previous stage
}

export interface ReferrerStat {
  source: string;
  count: number;
  percentage: number;
}

export interface TopProductStat {
  productId: string;
  title: string;
  slug: string;
  salesCount: number;
  revenueInr: number;
}

export interface DeviceStat {
  device: "Mobile" | "Desktop" | "Tablet" | "Unknown";
  count: number;
  percentage: number;
}

export interface AnalyticsReportDTO {
  timeRange: AnalyticsTimeRange;
  overview: AnalyticsOverviewMetrics;
  timeSeries: TimeSeriesPoint[];
  funnel: ConversionFunnelStage[];
  referrers: ReferrerStat[];
  topProducts: TopProductStat[];
  devices: DeviceStat[];
}
