import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { Order } from "@/models/Order";
import { StoreEvent } from "@/models/StoreEvent";
import { Lead } from "@/models/Lead";
import { Product } from "@/models/Product";
import type {
  AnalyticsOverviewMetrics,
  AnalyticsReportDTO,
  AnalyticsTimeRange,
  ConversionFunnelStage,
  DeviceStat,
  ReferrerStat,
  TimeSeriesPoint,
  TopProductStat,
} from "@/types";

interface DateRange {
  startDate: Date;
  endDate: Date;
  prevStartDate: Date;
  prevEndDate: Date;
  daysCount: number;
}

export function getDateRange(range: AnalyticsTimeRange): DateRange {
  const now = new Date();
  let daysCount = 30;

  if (range === "today") {
    daysCount = 1;
  } else if (range === "7d") {
    daysCount = 7;
  } else if (range === "30d") {
    daysCount = 30;
  } else if (range === "90d") {
    daysCount = 90;
  } else if (range === "all") {
    daysCount = 365;
  }

  const startDate = new Date(now.getTime() - daysCount * 24 * 60 * 60 * 1000);
  const prevEndDate = new Date(startDate.getTime());
  const prevStartDate = new Date(prevEndDate.getTime() - daysCount * 24 * 60 * 60 * 1000);

  return {
    startDate,
    endDate: now,
    prevStartDate,
    prevEndDate,
    daysCount,
  };
}

function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  const growth = ((current - previous) / previous) * 100;
  return Math.round(growth * 10) / 10;
}

function classifyReferrer(referrer?: string): string {
  if (!referrer || referrer.trim() === "") return "Direct / Bio";
  const ref = referrer.toLowerCase();
  if (ref.includes("instagram.com") || ref.includes("l.instagram.com")) return "Instagram";
  if (ref.includes("whatsapp.com") || ref.includes("wa.me")) return "WhatsApp";
  if (ref.includes("youtube.com") || ref.includes("youtu.be")) return "YouTube";
  if (ref.includes("twitter.com") || ref.includes("x.com") || ref.includes("t.co")) return "X (Twitter)";
  if (ref.includes("google.com") || ref.includes("bing.com")) return "Search (Google)";
  if (ref.includes("facebook.com") || ref.includes("fb.com")) return "Facebook";
  if (ref.includes("linkedin.com") || ref.includes("lnkd.in")) return "LinkedIn";
  return "Other Websites";
}

function classifyDevice(userAgent?: string): "Mobile" | "Desktop" | "Tablet" | "Unknown" {
  if (!userAgent) return "Unknown";
  const ua = userAgent.toLowerCase();
  if (ua.includes("ipad") || (ua.includes("tablet") && !ua.includes("mobile"))) return "Tablet";
  if (ua.includes("mobi") || ua.includes("iphone") || ua.includes("android")) return "Mobile";
  if (ua.includes("windows") || ua.includes("macintosh") || ua.includes("linux")) return "Desktop";
  return "Mobile"; // Default to mobile for Instagram traffic
}

export async function getAnalyticsReport(
  creatorId: string,
  range: AnalyticsTimeRange = "30d"
): Promise<AnalyticsReportDTO> {
  const emptyReport: AnalyticsReportDTO = {
    timeRange: range,
    overview: {
      totalRevenuePaise: 0,
      totalRevenueInr: 0,
      netEarningsPaise: 0,
      netEarningsInr: 0,
      totalOrders: 0,
      paidOrders: 0,
      storeViews: 0,
      uniqueVisitors: 0,
      blockClicks: 0,
      conversionRate: 0,
      avgOrderValueInr: 0,
      leadCount: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      viewsGrowth: 0,
      conversionGrowth: 0,
    },
    timeSeries: [],
    funnel: [
      { stage: "Store Views", count: 0, percentage: 100, dropoffRate: 0 },
      { stage: "Product Clicks", count: 0, percentage: 0, dropoffRate: 0 },
      { stage: "Checkouts Initiated", count: 0, percentage: 0, dropoffRate: 0 },
      { stage: "Orders Paid", count: 0, percentage: 0, dropoffRate: 0 },
    ],
    referrers: [],
    topProducts: [],
    devices: [],
  };

  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(creatorId)) {
    return emptyReport;
  }

  await dbConnect();
  const cId = new mongoose.Types.ObjectId(creatorId);
  const { startDate, endDate, prevStartDate, prevEndDate, daysCount } = getDateRange(range);

  // 1. Fetch Orders for Current & Previous Period
  const [currentOrders, prevOrders] = await Promise.all([
    Order.find({
      creatorId: cId,
      createdAt: { $gte: startDate, $lte: endDate },
    }),
    Order.find({
      creatorId: cId,
      createdAt: { $gte: prevStartDate, $lte: prevEndDate },
    }),
  ]);

  // 2. Fetch Store Events for Current & Previous Period
  const [currentEvents, prevEvents] = await Promise.all([
    StoreEvent.find({
      creatorId: cId,
      createdAt: { $gte: startDate, $lte: endDate },
    }),
    StoreEvent.find({
      creatorId: cId,
      createdAt: { $gte: prevStartDate, $lte: prevEndDate },
    }),
  ]);

  // 3. Fetch Leads for Current Period
  const leadsCount = await Lead.countDocuments({
    creatorId: cId,
    createdAt: { $gte: startDate, $lte: endDate },
  });

  // Calculate Current Metrics
  const paidOrders = currentOrders.filter((o) => o.status === "paid");
  const totalRevenuePaise = paidOrders.reduce((sum, o) => sum + o.amountPaise, 0);
  const netEarningsPaise = paidOrders.reduce((sum, o) => sum + (o.creatorEarningsPaise ?? o.amountPaise), 0);
  const totalRevenueInr = Math.round(totalRevenuePaise / 100);
  const netEarningsInr = Math.round(netEarningsPaise / 100);
  const totalOrdersCount = currentOrders.length;
  const paidOrdersCount = paidOrders.length;
  const avgOrderValueInr = paidOrdersCount > 0 ? Math.round(totalRevenueInr / paidOrdersCount) : 0;

  const storeViews = currentEvents.filter((e) => e.type === "view").length;
  const blockClicks = currentEvents.filter((e) => e.type === "click").length;
  const uniqueIps = new Set(
    currentEvents.map((e) => e.ip).filter((ip): ip is string => Boolean(ip))
  );
  const uniqueVisitors = uniqueIps.size > 0 ? uniqueIps.size : storeViews;

  const conversionRate =
    storeViews > 0
      ? Math.round((paidOrdersCount / storeViews) * 1000) / 10
      : 0;

  // Calculate Previous Period Metrics for Growth
  const prevPaidOrders = prevOrders.filter((o) => o.status === "paid");
  const prevRevenuePaise = prevPaidOrders.reduce((sum, o) => sum + o.amountPaise, 0);
  const prevRevenueInr = Math.round(prevRevenuePaise / 100);
  const prevViews = prevEvents.filter((e) => e.type === "view").length;
  const prevConversionRate =
    prevViews > 0
      ? Math.round((prevPaidOrders.length / prevViews) * 1000) / 10
      : 0;

  const overview: AnalyticsOverviewMetrics = {
    totalRevenuePaise,
    totalRevenueInr,
    netEarningsPaise,
    netEarningsInr,
    totalOrders: totalOrdersCount,
    paidOrders: paidOrdersCount,
    storeViews,
    uniqueVisitors,
    blockClicks,
    conversionRate,
    avgOrderValueInr,
    leadCount: leadsCount,
    revenueGrowth: calculateGrowth(totalRevenueInr, prevRevenueInr),
    ordersGrowth: calculateGrowth(paidOrdersCount, prevPaidOrders.length),
    viewsGrowth: calculateGrowth(storeViews, prevViews),
    conversionGrowth: calculateGrowth(conversionRate, prevConversionRate),
  };

  // 4. Generate Time Series Data Points (grouped by day)
  const timeSeriesMap = new Map<string, { views: number; clicks: number; orders: number; revenuePaise: number }>();

  // Pre-seed days so continuous line/bar charts don't have gaps
  const stepDays = daysCount <= 30 ? 1 : Math.ceil(daysCount / 30);
  for (let d = new Date(startDate.getTime()); d <= endDate; d.setDate(d.getDate() + stepDays)) {
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    timeSeriesMap.set(key, { views: 0, clicks: 0, orders: 0, revenuePaise: 0 });
  }

  // Populate events
  for (const ev of currentEvents) {
    const key = ev.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const existing = timeSeriesMap.get(key) || { views: 0, clicks: 0, orders: 0, revenuePaise: 0 };
    if (ev.type === "view") existing.views++;
    if (ev.type === "click") existing.clicks++;
    timeSeriesMap.set(key, existing);
  }

  // Populate orders
  for (const ord of paidOrders) {
    const key = ord.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const existing = timeSeriesMap.get(key) || { views: 0, clicks: 0, orders: 0, revenuePaise: 0 };
    existing.orders++;
    existing.revenuePaise += ord.amountPaise;
    timeSeriesMap.set(key, existing);
  }

  const timeSeries: TimeSeriesPoint[] = Array.from(timeSeriesMap.entries()).map(
    ([date, data]) => ({
      date,
      views: data.views,
      clicks: data.clicks,
      orders: data.orders,
      revenueInr: Math.round(data.revenuePaise / 100),
    })
  );

  // 5. Build Conversion Funnel
  const funnelViews = Math.max(storeViews, 1);
  const funnel: ConversionFunnelStage[] = [
    {
      stage: "Store Views",
      count: storeViews,
      percentage: 100,
      dropoffRate: 0,
    },
    {
      stage: "Product Clicks",
      count: blockClicks,
      percentage: Math.round((blockClicks / funnelViews) * 1000) / 10,
      dropoffRate:
        storeViews > 0
          ? Math.max(0, Math.round(((storeViews - blockClicks) / storeViews) * 1000) / 10)
          : 0,
    },
    {
      stage: "Checkouts Initiated",
      count: totalOrdersCount,
      percentage: Math.round((totalOrdersCount / funnelViews) * 1000) / 10,
      dropoffRate:
        blockClicks > 0
          ? Math.max(0, Math.round(((blockClicks - totalOrdersCount) / blockClicks) * 1000) / 10)
          : 0,
    },
    {
      stage: "Orders Paid",
      count: paidOrdersCount,
      percentage: Math.round((paidOrdersCount / funnelViews) * 1000) / 10,
      dropoffRate:
        totalOrdersCount > 0
          ? Math.max(0, Math.round(((totalOrdersCount - paidOrdersCount) / totalOrdersCount) * 1000) / 10)
          : 0,
    },
  ];

  // 6. Referrer Breakdown
  const referrerCounts = new Map<string, number>();
  for (const ev of currentEvents) {
    const src = classifyReferrer(ev.referrer);
    referrerCounts.set(src, (referrerCounts.get(src) || 0) + 1);
  }

  const totalRefEvents = currentEvents.length || 1;
  const referrers: ReferrerStat[] = Array.from(referrerCounts.entries())
    .map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / totalRefEvents) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count);

  // 7. Top Selling Products
  const productAggMap = new Map<string, { title: string; count: number; revenuePaise: number }>();
  for (const ord of paidOrders) {
    const pId = ord.productId.toString();
    const existing = productAggMap.get(pId) || {
      title: ord.productTitle || "Digital Product",
      count: 0,
      revenuePaise: 0,
    };
    existing.count++;
    existing.revenuePaise += ord.amountPaise;
    productAggMap.set(pId, existing);
  }

  // Fetch product slugs
  const productIds = Array.from(productAggMap.keys()).map((id) => new mongoose.Types.ObjectId(id));
  const productDocs = await Product.find({ _id: { $in: productIds } }).select("slug title");
  const slugMap = new Map(productDocs.map((p) => [p._id.toString(), p.slug]));

  const topProducts: TopProductStat[] = Array.from(productAggMap.entries())
    .map(([productId, data]) => ({
      productId,
      title: data.title,
      slug: slugMap.get(productId) || "",
      salesCount: data.count,
      revenueInr: Math.round(data.revenuePaise / 100),
    }))
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 10);

  // 8. Device Breakdown
  const deviceCounts = new Map<"Mobile" | "Desktop" | "Tablet" | "Unknown", number>();
  for (const ev of currentEvents) {
    const dev = classifyDevice(ev.userAgent);
    deviceCounts.set(dev, (deviceCounts.get(dev) || 0) + 1);
  }

  const totalDevEvents = currentEvents.length || 1;
  const devices: DeviceStat[] = Array.from(deviceCounts.entries())
    .map(([device, count]) => ({
      device,
      count,
      percentage: Math.round((count / totalDevEvents) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    timeRange: range,
    overview,
    timeSeries,
    funnel,
    referrers,
    topProducts,
    devices,
  };
}
