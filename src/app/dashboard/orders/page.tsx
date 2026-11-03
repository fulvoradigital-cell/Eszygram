"use client";

import * as React from "react";
import { Receipt, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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

export default function OrdersDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Orders &amp; Transactions
          </h1>
          <p className="text-sm text-slate-500">
            View customer purchases, payment verification status, and invoice receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
            Filter
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order History</CardTitle>
          <CardDescription>
            All completed transactions settled via Razorpay &amp; UPI rails.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs text-slate-500">
                  #ORD-8941
                </TableCell>
                <TableCell className="font-semibold text-slate-900">
                  Rohan Mehta
                </TableCell>
                <TableCell>Next.js Fullstack Masterclass</TableCell>
                <TableCell className="text-xs text-slate-500">Today, 2:14 PM</TableCell>
                <TableCell className="font-bold text-slate-900">
                  {formatINR(2499)}
                </TableCell>
                <TableCell>
                  <Badge variant="success">Paid UPI</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs text-slate-500">
                  #ORD-8940
                </TableCell>
                <TableCell className="font-semibold text-slate-900">
                  Ananya Iyer
                </TableCell>
                <TableCell>1:1 Portfolio &amp; Resume Review</TableCell>
                <TableCell className="text-xs text-slate-500">Yesterday</TableCell>
                <TableCell className="font-bold text-slate-900">
                  {formatINR(4999)}
                </TableCell>
                <TableCell>
                  <Badge variant="success">Paid UPI</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
