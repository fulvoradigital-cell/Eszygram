"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  Users,
  ArrowUpRight,
  Plus,
  Share2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatINR } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";

export default function DashboardOverviewPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const creatorName = session?.user?.name || "Creator";
  const username = session?.user?.username || "creator";

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Storefront Link Copied!",
      description: url,
      variant: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Namaste, {creatorName} 👋
            </h1>
            <Badge variant="accent">Live OS</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Your storefront is online at{" "}
            <span className="font-semibold text-brand-600">
              creatorrevenueos.com/{username}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            leftIcon={<Share2 className="h-4 w-4" />}
          >
            Copy Link
          </Button>
          <Link href={`/${username}`} target="_blank">
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
            >
              Preview
            </Button>
          </Link>
          <Link href="/dashboard/products">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Gross Revenue */}
        <Card className="hover:shadow-soft-md transition">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Gross Revenue
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                {formatINR(142500)}
              </div>
              <div className="mt-1 flex items-center text-xs font-semibold text-emerald-600">
                <TrendingUp className="mr-1 h-3.5 w-3.5" />
                <span>+24.8% this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: UPI Conversion Rate */}
        <Card className="hover:shadow-soft-md transition">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                UPI Conversion
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">89.4%</div>
              <div className="mt-1 flex items-center text-xs font-semibold text-accent-700">
                <span>0-dropoff fast checkout</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Total Orders */}
        <Card className="hover:shadow-soft-md transition">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Orders
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">184</div>
              <div className="mt-1 flex items-center text-xs font-semibold text-emerald-600">
                <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                <span>38 orders this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Audience Reach */}
        <Card className="hover:shadow-soft-md transition">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Buyers
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">142</div>
              <div className="mt-1 flex items-center text-xs font-semibold text-slate-500">
                <span>77% repeat customer rate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <CardDescription>
              Real-time UPI orders, digital product downloads, and consultations.
            </CardDescription>
          </div>
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold text-slate-900">
                  Rohan Mehta
                </TableCell>
                <TableCell>Next.js Fullstack Masterclass 2026</TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-slate-600">UPI (GPay)</span>
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  {formatINR(2499)}
                </TableCell>
                <TableCell>
                  <Badge variant="success">Completed</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold text-slate-900">
                  Ananya Iyer
                </TableCell>
                <TableCell>1:1 Portfolio &amp; Resume Review (45m)</TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-slate-600">UPI (PhonePe)</span>
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  {formatINR(4999)}
                </TableCell>
                <TableCell>
                  <Badge variant="success">Completed</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold text-slate-900">
                  Vikram Malhotra
                </TableCell>
                <TableCell>SaaS Starter Kit Notion Template</TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-slate-600">UPI (Paytm)</span>
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  {formatINR(999)}
                </TableCell>
                <TableCell>
                  <Badge variant="success">Completed</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
