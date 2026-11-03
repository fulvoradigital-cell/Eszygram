"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowRight,
  IndianRupee,
  Smartphone,
  CheckCircle,
  Database,
  Code2,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/providers/toast-provider";

export default function HomePage() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [testInput, setTestInput] = React.useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/40 via-slate-50 to-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white shadow-soft">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                Creator Revenue <span className="text-brand-600">OS</span>
              </span>
              <span className="hidden sm:inline-block ml-2 rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold text-accent-800">
                IN BETA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5 text-accent-500" />
            <span>SuperProfile &amp; Stan Store Alternative for Indian Creators</span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
            Monetize your audience with{" "}
            <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
              instant UPI checkout
            </span>
          </h1>

          <p className="mt-5 text-base text-slate-600 sm:text-lg leading-relaxed">
            The foundation for high-converting link-in-bio storefronts, digital products,
            1:1 consultations, and paid communities. Architected for speed, mobile conversion,
            and Indian payment rails.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Claim Your Creator Store
              </Button>
            </Link>
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              View System Specs
            </Button>
          </div>
        </div>

        {/* Feature Pillars Grid */}
        <section className="mt-16 sm:mt-24">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:border-brand-200 hover:shadow-soft-md">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600 mb-2">
                  <Database className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">MongoDB Atlas</CardTitle>
                <CardDescription>
                  Serverless connection caching with Mongoose singleton pattern.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:border-brand-200 hover:shadow-soft-md">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-100 text-accent-700 mb-2">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Auth.js &amp; NextAuth</CardTitle>
                <CardDescription>
                  JWT sessions, bcrypt password hashing, and Google OAuth flow.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:border-brand-200 hover:shadow-soft-md">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-2">
                  <Code2 className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Zod &amp; Clean APIs</CardTitle>
                <CardDescription>
                  Strict input validation with standardized &apos;&#123; success, data, error &#125;&apos; envelope.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:border-brand-200 hover:shadow-soft-md">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-2">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Razorpay &amp; UPI</CardTitle>
                <CardDescription>
                  Native hooks for Indian banking, 0-friction QR, and auto-settlements.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Design System Showcase */}
        <section className="mt-20">
          <div className="border-b border-slate-200 pb-4 mb-8">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-600" />
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Design System &amp; Component Kit
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Inter font, indigo/violet primary with warm saffron accents, rounded cards, and soft shadows.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Component Column 1: Buttons, Inputs, Badges */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Button Variants &amp; States</CardTitle>
                  <CardDescription>
                    All required styles with loading spinner support.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="accent">Warm Accent</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="primary" isLoading>
                    Saving
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Input Field &amp; Validation</CardTitle>
                  <CardDescription>
                    Accessible input with adornments, labels, and error messages.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Creator Handle"
                    placeholder="e.g. techwithkabir"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    helperText="Your public storefront will be at creatorrevenueos.com/techwithkabir"
                  />
                  <Input
                    label="UPI ID (VPA)"
                    placeholder="creator@okhdfcbank"
                    error={
                      testInput.length > 0 && !testInput.includes("@")
                        ? "Please enter a valid UPI VPA handle"
                        : undefined
                    }
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Badge Tokens</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="primary">Active Store</Badge>
                  <Badge variant="accent">₹4,999 Sale</Badge>
                  <Badge variant="success">Payment Verified</Badge>
                  <Badge variant="warning">Pending KYC</Badge>
                  <Badge variant="destructive">Failed Webhook</Badge>
                  <Badge variant="secondary">Draft Product</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Component Column 2: Table, Skeleton, EmptyState */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Responsive Table Primitive</CardTitle>
                  <CardDescription>
                    Clean mobile-friendly layout for orders and payouts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Aarav Sharma</TableCell>
                        <TableCell>Figma Mastery 2026</TableCell>
                        <TableCell className="font-semibold text-slate-900">₹1,999</TableCell>
                        <TableCell>
                          <Badge variant="success">Paid UPI</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Priya Verma</TableCell>
                        <TableCell>1:1 Portfolio Review</TableCell>
                        <TableCell className="font-semibold text-slate-900">₹4,499</TableCell>
                        <TableCell>
                          <Badge variant="success">Paid UPI</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Skeleton Shimmer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <EmptyState
                icon={<Smartphone className="h-7 w-7" />}
                title="No Digital Products Yet"
                description="Create your first e-book, video course, or consultation link to start accepting orders."
                action={
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: "Create Product",
                        description: "Product creation feature will be built in the next milestone.",
                        variant: "warning",
                      })
                    }
                  >
                    Add Product Placeholder
                  </Button>
                }
              />
            </div>
          </div>
        </section>
      </main>

      {/* Reusable Modal Component Instance */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Architecture Status & Rules"
        description="Stack configured according to AGENTS.md rules."
      >
        <div className="space-y-4 text-sm text-slate-600">
          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Mongoose Connection Helper</p>
              <p className="text-xs text-slate-500">
                Cached singleton for serverless Next.js functions in `src/lib/db.ts`.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Auth.js (NextAuth) JWT Sessions</p>
              <p className="text-xs text-slate-500">
                Bcrypt password hashing and Google OAuth provider configured.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Zod Validation &amp; API Envelopes</p>
              <p className="text-xs text-slate-500">
                All requests validated; uniform `&#123; success, data, error &#125;` responses.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Mobile-First UI Design Tokens</p>
              <p className="text-xs text-slate-500">
                Inter font, indigo brand, warm amber accent, rounded-2xl cards, and soft shadows.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            Close Modal
          </Button>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-100 bg-white py-8 text-center text-xs text-slate-500">
        <p>Creator Revenue OS &copy; {new Date().getFullYear()} &bull; Built for India&apos;s digital creator economy.</p>
      </footer>
    </div>
  );
}

