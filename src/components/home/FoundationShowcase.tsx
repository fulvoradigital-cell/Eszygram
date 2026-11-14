"use client";

import React, { useState } from "react";
import {
  Activity,
  Bell,
  CheckCircle2,
  ChevronDown,
  Copy,
  Layers,
  LogOut,
  PackageOpen,
  Palette,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { useToast } from "@/components/providers/ToastProvider";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Drawer,
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
  EmptyState,
  Input,
  Modal,
  Select,
  Skeleton,
  SkeletonCard,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
} from "@/components/ui";
import { formatINR } from "@/lib/utils";

interface HealthPayload {
  status: string;
  app: string;
  tagline: string;
  database: string;
  timestamp: string;
}

export function FoundationShowcase() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSide, setDrawerSide] = useState<"right" | "bottom">("right");
  const [upiAutoEnabled, setUpiAutoEnabled] = useState(true);
  const [dmAutoEnabled, setDmAutoEnabled] = useState(false);
  const [niche, setNiche] = useState("coach");
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthResult, setHealthResult] = useState<HealthPayload | null>(null);

  const checkHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch("/api/health");
      const json = await res.json();
      if (json.success) {
        setHealthResult(json.data);
        toast.success(
          "Health endpoint responded",
          `Database status: ${json.data.database}`
        );
      } else {
        toast.error("Health check failed", json.error?.message);
      }
    } catch {
      toast.error("Network error", "Could not reach /api/health");
    } finally {
      setHealthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-mesh">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-canvas-darkBorder dark:bg-canvas-dark/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo variant="full" size="md" showTagline />

          <div className="flex items-center gap-2.5">
            <Badge variant="primary" dot className="hidden sm:inline-flex">
              Phase 0 · Foundation
            </Badge>
            <Button
              variant="outline"
              size="sm"
              isLoading={healthLoading}
              onClick={checkHealth}
              leftIcon={<Activity className="h-4 w-4 text-mint-500" />}
            >
              <span className="hidden xs:inline">API</span> Health
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
        {/* Placeholder Hero */}
        <section className="relative overflow-hidden rounded-4xl border border-slate-200/80 bg-white/90 p-6 shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard/90 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent" dot>
                  Sell. Automate. Grow.
                </Badge>
                <Badge variant="success">Next.js 14 · TypeScript · Tailwind</Badge>
              </div>

              <h1 className="font-display text-fluid-hero font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome to{" "}
                <span className="text-gradient">Ezsygram</span>
              </h1>

              <p className="text-fluid-lg text-slate-600 dark:text-slate-300">
                The SaaS platform helping Indian creators, coaches, educators,
                and small businesses turn their Instagram audience into income
                with a mobile-first storefront, UPI-first payments, and
                automated DMs.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={() =>
                    toast.success(
                      "Foundation Ready",
                      "All core infrastructure and 17 UI primitives are loaded."
                    )
                  }
                  leftIcon={<Sparkles className="h-4 w-4" />}
                >
                  Test Toast Feedback
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setModalOpen(true)}
                >
                  Open Modal
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => {
                    setDrawerSide("bottom");
                    setDrawerOpen(true);
                  }}
                >
                  Mobile Sheet Drawer
                </Button>
              </div>
            </div>

            {/* Live Health Status Card */}
            <Card className="w-full shrink-0 lg:w-80" variant="glass">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">System Foundation</CardTitle>
                  <Badge variant="success" dot>
                    Online
                  </Badge>
                </div>
                <CardDescription>
                  Standardized API envelope & cached DB config
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3.5 py-2.5 dark:bg-white/5">
                  <span className="text-slate-500 dark:text-slate-400">
                    API Shape
                  </span>
                  <code className="font-mono font-semibold text-brand-600 dark:text-brand-300">
                    {"{ success, data, error }"}
                  </code>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3.5 py-2.5 dark:bg-white/5">
                  <span className="text-slate-500 dark:text-slate-400">
                    Database
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {healthResult ? healthResult.database : "Click API Health"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3.5 py-2.5 dark:bg-white/5">
                  <span className="text-slate-500 dark:text-slate-400">
                    Auth.js Strategy
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    JWT · Email + Google
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Brand Logo & Color System */}
        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <CardTitle>Logo Variants</CardTitle>
              </div>
              <CardDescription>
                Reusable inline SVG squircle mark with notched E &amp; coral spark
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-canvas-light p-4">
                <Logo variant="full" theme="light" size="md" showTagline />
                <Logo variant="icon" size="md" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-canvas-darkBorder bg-canvas-dark p-4">
                <Logo variant="full" theme="dark" size="md" showTagline />
                <Logo variant="icon" size="md" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-coral-500" />
                <CardTitle>Brand Palette &amp; Currency Helper</CardTitle>
              </div>
              <CardDescription>
                Primary gradient, warm coral accent, mint success &amp; paise formatting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="space-y-1.5">
                  <div className="h-12 rounded-2xl bg-brand-gradient shadow-glow" />
                  <p className="text-xs font-semibold">Violet → Indigo</p>
                  <p className="text-[11px] text-slate-500">#6D28D9 → #4F46E5</p>
                </div>
                <div className="space-y-1.5">
                  <div className="h-12 rounded-2xl bg-coral-500 shadow-glow-coral" />
                  <p className="text-xs font-semibold">Warm Coral</p>
                  <p className="text-[11px] text-slate-500">#FF7A59</p>
                </div>
                <div className="space-y-1.5">
                  <div className="h-12 rounded-2xl bg-mint-500" />
                  <p className="text-xs font-semibold">Mint Success</p>
                  <p className="text-[11px] text-slate-500">#10B981</p>
                </div>
                <div className="space-y-1.5">
                  <div className="h-12 rounded-2xl border border-slate-700 bg-canvas-dark" />
                  <p className="text-xs font-semibold">Deep Navy</p>
                  <p className="text-[11px] text-slate-500">#0B0B1A</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs dark:bg-white/5">
                <span className="text-slate-500 dark:text-slate-400">
                  Sample INR formatting (49900 paise):
                </span>
                <span className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  {formatINR(49900)}
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Interactive Design System Library Showcase */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Design System Primitives (17 Components)</CardTitle>
              <CardDescription>
                Mobile-first, keyboard accessible, WCAG AA contrast, and dark-mode ready
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="controls">
                <TabsList>
                  <TabsTrigger value="controls">Forms &amp; Controls</TabsTrigger>
                  <TabsTrigger value="feedback">Overlays &amp; Menus</TabsTrigger>
                  <TabsTrigger value="data">Tables &amp; States</TabsTrigger>
                </TabsList>

                <TabsContent value="controls" className="space-y-6 pt-2">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Creator Handle"
                      placeholder="arjun.fitness"
                      helperText="Your storefront will live at ezsygram.com/arjun.fitness"
                      leftIcon={<User className="h-4 w-4" />}
                      required
                    />
                    <Select
                      label="Primary Creator Niche"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      options={[
                        { label: "Fitness & Wellness Coach", value: "coach" },
                        { label: "Course Creator & Educator", value: "educator" },
                        { label: "Designer & Digital Artist", value: "designer" },
                        { label: "Consultant & Astrologer", value: "consultant" },
                      ]}
                    />
                  </div>

                  <Textarea
                    label="Storefront Bio"
                    placeholder="Helping 50,000+ Indians build sustainable habits..."
                    helperText="Displayed directly below your avatar on mobile."
                  />

                  <div className="grid gap-4 rounded-2xl border border-slate-200/80 p-4 dark:border-canvas-darkBorder sm:grid-cols-2">
                    <Switch
                      checked={upiAutoEnabled}
                      onCheckedChange={setUpiAutoEnabled}
                      label="UPI Instant Checkout"
                      description="Prioritize UPI apps & QR codes at checkout"
                    />
                    <Switch
                      checked={dmAutoEnabled}
                      onCheckedChange={setDmAutoEnabled}
                      label="Comment-to-DM Trigger"
                      description="Send automated link when followers comment"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    <Button variant="primary">Primary Gradient</Button>
                    <Button variant="accent">Coral Accent</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </TabsContent>

                <TabsContent value="feedback" className="space-y-6 pt-2">
                  <div className="flex flex-wrap items-center gap-4">
                    <Tooltip content="Copies your public Ezsygram link">
                      <Button
                        variant="outline"
                        leftIcon={<Copy className="h-4 w-4" />}
                        onClick={() =>
                          toast.info("Copied link", "ezsygram.com/demo-creator")
                        }
                      >
                        Hover / Focus Tooltip
                      </Button>
                    </Tooltip>

                    <Button
                      variant="primary"
                      onClick={() => {
                        setDrawerSide("right");
                        setDrawerOpen(true);
                      }}
                    >
                      Open Side Drawer
                    </Button>

                    <Dropdown>
                      <DropdownTrigger>
                        <span className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-soft dark:border-canvas-darkBorder dark:bg-canvas-darkCard dark:text-slate-100">
                          <Avatar alt="Riya Sharma" name="Riya Sharma" size="xs" />
                          <span>Riya Sharma</span>
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </span>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownLabel>Creator Account</DropdownLabel>
                        <DropdownItem
                          icon={<Settings className="h-4 w-4" />}
                          onClick={() => toast.info("Settings clicked")}
                        >
                          Store Settings
                        </DropdownItem>
                        <DropdownItem
                          icon={<Bell className="h-4 w-4" />}
                          onClick={() => toast.info("Notifications clicked")}
                        >
                          Notifications
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem
                          destructive
                          icon={<LogOut className="h-4 w-4" />}
                          onClick={() => toast.warning("Signed out preview")}
                        >
                          Log out
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/80 p-4 dark:border-canvas-darkBorder">
                    <Avatar alt="Ananya Verma" name="Ananya Verma" size="sm" />
                    <Avatar alt="Kabir Mehta" name="Kabir Mehta" size="md" ring />
                    <Avatar alt="Ezsygram Creator" name="Ezsygram Creator" size="lg" />
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="primary" dot>
                        Pro Plan
                      </Badge>
                      <Badge variant="accent">Hot Offer</Badge>
                      <Badge variant="success" dot>
                        UPI Paid
                      </Badge>
                      <Badge variant="warning">Pending</Badge>
                      <Badge variant="danger">Failed</Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="data" className="space-y-6 pt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">
                          30-Day Home Workout Guide
                        </TableCell>
                        <TableCell>UPI Instant</TableCell>
                        <TableCell>{formatINR(49900)}</TableCell>
                        <TableCell>
                          <Badge variant="success" dot>
                            Paid
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">
                          1:1 Portfolio Review Call
                        </TableCell>
                        <TableCell>UPI QR</TableCell>
                        <TableCell>{formatINR(149900)}</TableCell>
                        <TableCell>
                          <Badge variant="primary" dot>
                            Scheduled
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <SkeletonCard />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <EmptyState
                      icon={<PackageOpen className="h-6 w-6" />}
                      title="No products published yet"
                      description="Create your first digital download, course, or 1:1 session to start accepting UPI payments."
                      action={
                        <Button
                          size="sm"
                          leftIcon={<CheckCircle2 className="h-4 w-4" />}
                          onClick={() =>
                            toast.success("Ready for Phase 1 & beyond!")
                          }
                        >
                          Acknowledge
                        </Button>
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Modal Example */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Ezsygram Foundation Modal"
        description="Accessible dialog with Escape key support, focus ring, and mobile-friendly spacing."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setModalOpen(false);
                toast.success("Modal confirmed");
              }}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          On mobile viewports, modals gently dock near the bottom for thumb
          reachability, and center smoothly on tablets and desktops.
        </p>
      </Modal>

      {/* Drawer Example */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side={drawerSide}
        title={
          drawerSide === "bottom"
            ? "Mobile Bottom Sheet Drawer"
            : "Slide-Over Drawer"
        }
        description="Ideal for quick mobile checkout sheets and dashboard detail panels."
        footer={
          <Button fullWidth onClick={() => setDrawerOpen(false)}>
            Close Drawer
          </Button>
        }
      >
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Supports <code>left</code>, <code>right</code>, and{" "}
            <code>bottom</code> sheet orientations with smooth spring physics and
            reduced-motion support.
          </p>
          <Input label="Quick Email Preview" placeholder="creator@ezsygram.com" />
        </div>
      </Drawer>
    </div>
  );
}
