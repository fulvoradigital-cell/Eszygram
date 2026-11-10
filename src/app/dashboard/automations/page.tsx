"use client";

import * as React from "react";
import { Zap, Mail, MessageSquare, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AutomationsDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Workflows &amp; Automations
          </h1>
          <p className="text-sm text-slate-500">
            Automated WhatsApp reminders, welcome sequences via Resend, and course access delivery.
          </p>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          New Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:border-brand-200 transition">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Mail className="h-5 w-5" />
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <CardTitle className="text-base mt-2">Instant Product Delivery Email</CardTitle>
            <CardDescription>
              Dispatches download link and receipt immediately after UPI settlement via Resend.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-500 border-t border-slate-100 pt-3">
            Trigger: Successful Razorpay payment &bull; 100% Delivery rate
          </CardContent>
        </Card>

        <Card className="hover:border-brand-200 transition">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              <Badge variant="accent">Beta</Badge>
            </div>
            <CardTitle className="text-base mt-2">WhatsApp Session Reminder</CardTitle>
            <CardDescription>
              Sends a WhatsApp ping with Google Meet link 15 minutes before 1:1 call.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-500 border-t border-slate-100 pt-3">
            Trigger: 15 mins before calendar appointment
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

