"use client";

import * as React from "react";
import { Users, Mail, PhoneCall } from "lucide-react";
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

export default function CustomersDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Customers &amp; Leads
          </h1>
          <p className="text-sm text-slate-500">
            Your audience email subscribers, buyers, and consultation clients.
          </p>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Mail className="h-4 w-4" />}>
          Broadcast Email
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-600" />
            Customer CRM Directory
          </CardTitle>
          <CardDescription>
            Contacts acquired directly through your Creator Revenue OS storefront.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold text-slate-900">
                  Rohan Mehta
                </TableCell>
                <TableCell className="text-xs text-slate-600">rohan@example.com</TableCell>
                <TableCell className="font-bold text-slate-900">{formatINR(2499)}</TableCell>
                <TableCell>1</TableCell>
                <TableCell>
                  <Badge variant="primary">Course Buyer</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold text-slate-900">
                  Ananya Iyer
                </TableCell>
                <TableCell className="text-xs text-slate-600">ananya@example.com</TableCell>
                <TableCell className="font-bold text-slate-900">{formatINR(4999)}</TableCell>
                <TableCell>2</TableCell>
                <TableCell>
                  <Badge variant="accent">VIP Client</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

