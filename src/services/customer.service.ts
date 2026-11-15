import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { Order } from "@/models/Order";
import { Lead } from "@/models/Lead";
import type { CustomerDTO, CustomerMetricsDTO } from "@/types";
import type { CustomerQueryInput } from "@/validators/customer.validator";

function sanitizeCsvField(val?: string | number | null): string {
  if (val === undefined || val === null) return '""';
  let str = String(val).trim();
  // Prevent CSV Formula Injection
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  // Escape internal double quotes
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

export async function getCreatorCustomers(
  creatorId: string,
  options: CustomerQueryInput
): Promise<{
  customers: CustomerDTO[];
  total: number;
  page: number;
  totalPages: number;
  metrics: CustomerMetricsDTO;
}> {
  const emptyResult = {
    customers: [],
    total: 0,
    page: 1,
    totalPages: 0,
    metrics: {
      totalAudience: 0,
      totalBuyers: 0,
      totalLeads: 0,
      totalRevenueInr: 0,
      averageCustomerValueInr: 0,
    },
  };

  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(creatorId)) {
    return emptyResult;
  }

  await dbConnect();
  const cId = new mongoose.Types.ObjectId(creatorId);

  // 1. Fetch all Orders for creator
  const orders = await Order.find({
    creatorId: cId,
    status: "paid",
  }).sort({ createdAt: -1 });

  // 2. Fetch all Leads for creator
  const leads = await Lead.find({ creatorId: cId }).sort({ createdAt: -1 });

  // 3. Aggregate into unified map keyed by normalized email or phone
  const customerMap = new Map<string, CustomerDTO>();

  // Process buyers first
  for (const ord of orders) {
    const key = ord.buyerEmail.toLowerCase().trim();
    const existing = customerMap.get(key);

    const amountPaise = ord.amountPaise || 0;
    const prodTitle = ord.productTitle || "Digital Product";

    if (existing) {
      existing.totalOrders++;
      existing.totalSpentPaise += amountPaise;
      existing.totalSpentInr = Math.round(existing.totalSpentPaise / 100);
      if (!existing.purchasedProductTitles.includes(prodTitle)) {
        existing.purchasedProductTitles.push(prodTitle);
      }
      if (!existing.phone && ord.buyerPhone) {
        existing.phone = ord.buyerPhone;
      }
      if (new Date(ord.createdAt) < new Date(existing.firstSeenAt)) {
        existing.firstSeenAt = ord.createdAt.toISOString();
      }
      if (new Date(ord.createdAt) > new Date(existing.lastActiveAt)) {
        existing.lastActiveAt = ord.createdAt.toISOString();
      }
    } else {
      customerMap.set(key, {
        id: `buyer_${ord._id.toString()}`,
        type: "buyer",
        name: ord.buyerName || "Customer",
        email: ord.buyerEmail,
        phone: ord.buyerPhone,
        totalOrders: 1,
        totalSpentPaise: amountPaise,
        totalSpentInr: Math.round(amountPaise / 100),
        purchasedProductTitles: [prodTitle],
        source: "Storefront Checkout",
        firstSeenAt: ord.createdAt.toISOString(),
        lastActiveAt: ord.createdAt.toISOString(),
      });
    }
  }

  // Process leads
  for (const lead of leads) {
    const key = (lead.email || lead.whatsapp || lead._id.toString()).toLowerCase().trim();
    const existing = customerMap.get(key);

    if (existing) {
      // Already a buyer; keep buyer status but merge contact details if missing
      if (!existing.phone && lead.whatsapp) {
        existing.phone = lead.whatsapp;
      }
      if (lead.name && existing.name === "Customer") {
        existing.name = lead.name;
      }
      if (new Date(lead.createdAt) < new Date(existing.firstSeenAt)) {
        existing.firstSeenAt = lead.createdAt.toISOString();
      }
    } else {
      customerMap.set(key, {
        id: `lead_${lead._id.toString()}`,
        type: "lead",
        name: lead.name || "Subscriber",
        email: lead.email || "No email",
        phone: lead.whatsapp,
        totalOrders: 0,
        totalSpentPaise: 0,
        totalSpentInr: 0,
        purchasedProductTitles: [],
        source: "Lead Magnet Block",
        firstSeenAt: lead.createdAt.toISOString(),
        lastActiveAt: lead.createdAt.toISOString(),
      });
    }
  }

  let allCustomers = Array.from(customerMap.values());

  // Compute Metrics across entire audience
  const totalAudience = allCustomers.length;
  const totalBuyers = allCustomers.filter((c) => c.type === "buyer").length;
  const totalLeads = allCustomers.filter((c) => c.type === "lead").length;
  const totalRevenueInr = allCustomers.reduce((sum, c) => sum + c.totalSpentInr, 0);
  const averageCustomerValueInr =
    totalBuyers > 0 ? Math.round(totalRevenueInr / totalBuyers) : 0;

  const metrics: CustomerMetricsDTO = {
    totalAudience,
    totalBuyers,
    totalLeads,
    totalRevenueInr,
    averageCustomerValueInr,
  };

  // 4. Apply Filters
  if (options.type && options.type !== "all") {
    allCustomers = allCustomers.filter((c) => c.type === options.type);
  }

  if (options.search && options.search.trim().length > 0) {
    const q = options.search.toLowerCase().trim();
    allCustomers = allCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
    );
  }

  // 5. Apply Sort
  if (options.sort === "spend") {
    allCustomers.sort((a, b) => b.totalSpentPaise - a.totalSpentPaise);
  } else if (options.sort === "orders") {
    allCustomers.sort((a, b) => b.totalOrders - a.totalOrders);
  } else {
    // latest
    allCustomers.sort(
      (a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
    );
  }

  // 6. Pagination
  const total = allCustomers.length;
  const page = options.page || 1;
  const limit = options.limit || 20;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedCustomers = allCustomers.slice(startIndex, startIndex + limit);

  return {
    customers: paginatedCustomers,
    total,
    page,
    totalPages,
    metrics,
  };
}

export async function exportCustomersCsv(creatorId: string): Promise<string> {
  const { customers } = await getCreatorCustomers(creatorId, {
    type: "all",
    sort: "latest",
    page: 1,
    limit: 10000,
  });

  const headers = [
    "Type",
    "Name",
    "Email",
    "WhatsApp / Phone",
    "Total Orders",
    "Total Spent (INR)",
    "Products Purchased",
    "Source",
    "First Joined Date",
    "Last Active Date",
  ];

  const rows = customers.map((c) => [
    sanitizeCsvField(c.type.toUpperCase()),
    sanitizeCsvField(c.name),
    sanitizeCsvField(c.email),
    sanitizeCsvField(c.phone || ""),
    sanitizeCsvField(c.totalOrders),
    sanitizeCsvField(c.totalSpentInr),
    sanitizeCsvField(c.purchasedProductTitles.join("; ")),
    sanitizeCsvField(c.source),
    sanitizeCsvField(new Date(c.firstSeenAt).toLocaleDateString("en-IN")),
    sanitizeCsvField(new Date(c.lastActiveAt).toLocaleDateString("en-IN")),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}
