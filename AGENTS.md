# Ezsygram — Engineering & Agent Guidelines (`AGENTS.md`)

**Ezsygram** (*"Sell. Automate. Grow."*) is a production-ready SaaS platform enabling Indian creators, coaches, educators, and small businesses to build a mobile-first link-in-bio storefront, sell digital products, courses, bookings, and memberships with UPI-first payments, and automate Instagram comments and DMs.

This document is the authoritative guide for developers and AI coding agents contributing to this codebase.

---

## 1. Golden Rules (Non-Negotiable)

1. **Always Validate with Zod**
   - Every API route (`POST`, `PUT`, `PATCH`, `DELETE`), URL query parameter, webhook payload, and form submission must be parsed with Zod schemas in `src/validators/`.
   - Never pass unvalidated `req.json()` or raw request fields into services or Mongoose models.
   - Return standardized `400 Bad Request` responses using `apiError` / `handleApiError` when validation fails.

2. **Never Trust Client-Side Prices**
   - Monetary amounts must be stored as integers in **paise** (1 INR = 100 paise) in MongoDB.
   - Razorpay orders, coupon discounts, order bumps, and platform fees must always be computed strictly on the server from authoritative database records. Ignore any price, fee, or total sent from the browser.

3. **Never Expose Secrets**
   - Never log, serialize, or return `MONGODB_URI`, `NEXTAUTH_SECRET`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `RESEND_API_KEY`, `STORAGE_*` keys, `META_APP_SECRET`, `ENCRYPTION_KEY`, `passwordHash`, or encrypted OAuth tokens to the client.
   - Never prefix secret environment variables with `NEXT_PUBLIC_`.
   - Always sanitize Mongoose documents (e.g., `.select("-passwordHash")` or explicit DTO mapping) before returning API payloads.

4. **Mobile-First UI**
   - Most buyers and creators access storefronts directly from mobile Instagram in-app browsers.
   - Design every layout for 360px–430px viewports first, then scale up with responsive Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`).
   - Maintain accessible touch targets (minimum `44x44px` on interactive controls), WCAG AA color contrast, semantic HTML, focus-visible rings, and `prefers-reduced-motion` support.

5. **Authorize Every API Route**
   - Protected routes (`/api/creator/*`, `/api/dashboard/*`, `/api/admin/*`) must verify the authenticated session via `getServerSession(authOptions)` and check role/ownership before accessing or mutating data.
   - Never query or mutate a record by `id` alone when owned by a creator; always scope queries with `creatorId: session.user.id` or `userId: session.user.id`.
   - Admin routes must verify `session.user.role === "admin"`.
   - Webhook endpoints must verify HMAC signatures (`X-Razorpay-Signature`, `X-Hub-Signature-256`) before processing payloads.

6. **Write a Short Test Plan After Each Feature**
   - Every completed feature or phase must include a concise, actionable test plan covering:
     - **Happy Path**: Primary user flow and expected outcome.
     - **Edge & Validation Cases**: Bad input, missing auth, wrong role, boundary limits.
     - **Verification Commands / Steps**: Concrete browser checks, `curl` calls, typecheck, lint, and build verification.

7. **Brand & Naming Hygiene**
   - Never mention or reference any external competitor company or brand name anywhere in code, comments, UI copy, or documentation.

---

## 2. Technology Stack

- **Framework**: Next.js 14+ (App Router), React 18, TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom Ezsygram design tokens (`#6D28D9` to `#4F46E5` primary gradient, `#FF7A59` warm coral accent, `#10B981` mint success, `#FAFAFB` light canvas, `#0B0B1A` deep navy dark mode)
- **Typography**: `Inter` (UI) + `Plus Jakarta Sans` (headings/display) via `next/font/google`
- **Database**: MongoDB Atlas with Mongoose (serverless global connection caching in `src/lib/db.ts`)
- **Authentication**: Auth.js (`next-auth`) with Credentials (`bcryptjs`) + Google OAuth and JWT sessions
- **Validation**: Zod (`src/validators/`)
- **Payments**: Razorpay (Orders, Subscriptions, Webhooks)
- **Transactional Email**: Resend
- **Object Storage**: S3-compatible private bucket (Cloudflare R2 / AWS S3) via `@aws-sdk/client-s3` + presigned URLs
- **UI & Visualization**: Framer Motion, Recharts, `@dnd-kit/core` & `@dnd-kit/sortable`, `lucide-react`
- **Deployment Target**: Vercel + MongoDB Atlas

---

## 3. Folder Structure

```text
ezsygram/
├── AGENTS.md                       # Engineering rules and architecture reference
├── .env.example                    # Complete environment variable template
├── next.config.mjs                 # Next.js configuration
├── tailwind.config.ts              # Brand colors, fonts, shadows, radius tokens
├── tsconfig.json                   # Strict TypeScript settings
└── src/
    ├── app/                        # App Router pages, layouts, metadata assets, API routes
    │   ├── api/                    # Route handlers (/api/health, /api/auth/*, etc.)
    │   ├── error.tsx               # Route-segment error boundary
    │   ├── global-error.tsx        # Root error boundary
    │   ├── not-found.tsx           # Branded 404 page
    │   ├── icon.tsx                # Generated favicon from Ezsygram Logo mark
    │   ├── apple-icon.tsx          # Generated apple-touch-icon
    │   ├── opengraph-image.tsx     # Generated OG image
    │   ├── layout.tsx              # Root layout (fonts, metadata, providers)
    │   └── page.tsx                # Home page
    ├── components/
    │   ├── brand/                  # <Logo /> SVG variants & <ThemeToggle />
    │   ├── providers/              # AppProviders (Session, Theme, Toast)
    │   └── ui/                     # Design system primitives (Button, Input, Select, Textarea, Switch, Card, Modal, Drawer, Tabs, Table, Badge, Toast, Skeleton, EmptyState, Tooltip, Avatar, Dropdown)
    ├── lib/                        # Core singletons and helpers
    │   ├── api-response.ts         # Standardized { success, data, error } responses + AppError
    │   ├── auth.ts                 # NextAuth configuration & session helpers
    │   ├── db.ts                   # Cached Mongoose connection
    │   └── utils.ts                # Class merging, currency/date formatters
    ├── models/                     # Mongoose schemas & TypeScript document types
    ├── services/                   # Business logic & data access layer
    ├── types/                      # Shared TypeScript interfaces and module augmentations
    └── validators/                 # Zod schemas for requests, forms, and webhooks
```

---

## 4. Standardized API Response Shape

Every `/api/*` endpoint must return JSON with the exact `{ success, data, error }` contract:

```ts
// Success (2xx)
{
  "success": true,
  "data": { ... },
  "error": null
}

// Error (4xx / 5xx)
{
  "success": false,
  "data": null,
  "error": {
    "message": "Human-readable description",
    "code": "VALIDATION_ERROR",
    "details": { ... } // optional structured field errors
  }
}
```

Use `apiSuccess`, `apiError`, and `handleApiError` from `@/lib/api-response`.

---

## 5. Coding & Git Conventions

- Prefer Server Components by default; mark interactive leaves with `"use client"`.
- Keep business rules inside `src/services/` rather than duplicating logic inside Route Handlers.
- Use path alias `@/*` pointing to `./src/*`.
- Run verification checks after each milestone:
  - `pnpm typecheck` (`tsc --noEmit`)
  - `pnpm lint` (`next lint`)
  - `pnpm build` (`next build`)

