# Creator Revenue OS — Engineering & Agent Rules (AGENTS.md)

Welcome to **Creator Revenue OS**, the modern digital commerce, link-in-bio, and monetization engine built specifically for Indian digital creators, educators, and influencers (a high-performance alternative to Stan Store and SuperProfile).

This document serves as the single source of truth for AI agents and developers working on this codebase. Follow these conventions and rules strictly.

---

## 1. Core Principles & Golden Rules

### 1. Always Validate with Zod
- **Zero untrusted input**: Every API route (`POST`, `PUT`, `PATCH`, `DELETE`), URL query string, webhook payload, and form submission **must** be validated with Zod schemas defined in `src/validators/`.
- Never trust raw `req.json()` or query params. Extract and validate using `schema.safeParse()`.
- Return standardized `400 Bad Request` responses containing Zod validation issues formatted by our API response helper.

### 2. Never Expose Secrets
- Never log or return database credentials, Razorpay secret keys, webhook secrets, auth secrets, S3/R2 secret keys, or password hashes to the client.
- Sensitive environment variables must **never** have the `NEXT_PUBLIC_` prefix.
- Clean Mongoose documents before returning them (remove `password`, `__v`, internal tokens). Use projections or `.select('-password')`.

### 3. Mobile-First UI
- In India, >85% of creator audience traffic arrives via mobile devices (Instagram in-app browser, WhatsApp, YouTube descriptions).
- Every storefront, checkout drawer, course reader, and dashboard page **must** be designed and tested on mobile viewport widths (360px–420px) first before expanding to desktop.
- Touch targets must be at least 44x44px. Avoid desktop-only hover dependencies for critical user journeys.
- Support UPI fast checkout and bottom-sheet drawers for mobile conversion.

### 4. Write a Short Test Plan After Each Feature
- When implementing any new feature, endpoint, or major component, you must document a short, actionable **Test Plan**:
  1. **Happy Path**: Expected input and successful outcome.
  2. **Validation / Edge Cases**: Invalid inputs, missing fields, zero/negative amounts, unauthorized access.
  3. **Verification Steps**: Specific cURL or browser verification steps with expected HTTP status and payload shapes.

---

## 2. Technology Stack

- **Framework**: Next.js 14+ (App Router, Server Components by default, Client Components with `"use client"` when interactivity/hooks are needed).
- **Language**: TypeScript (Strict mode enabled, no implicit `any`).
- **Styling**: Tailwind CSS with custom design tokens (Brand Indigo/Violet, Warm Amber/Saffron accent, soft shadows, rounded corners).
- **Typography**: Inter font via `next/font/google`.
- **Database**: MongoDB Atlas with Mongoose (using cached singleton connection for serverless resilience).
- **Authentication**: Auth.js / NextAuth (Credentials with bcryptjs + Google OAuth), using secure JWT sessions.
- **Validation**: Zod for runtime schema validation.
- **Payments**: Razorpay (UPI, Netbanking, Cards, Wallets tailored for Indian creators).
- **Storage**: Cloudflare R2 / AWS S3 S3-compatible object storage.
- **Email**: Resend transactional emails.

---

## 3. Directory Layout

All application source code resides strictly inside `src/`:

```
creator-revenue-os/
├── AGENTS.md                  # Project rules & architecture guidelines (this file)
├── .env.example               # Template with all environment variables
├── .env.local                 # Local development variables (git-ignored)
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript strict configuration
├── tailwind.config.ts         # Design tokens & color system
├── postcss.config.mjs         # PostCSS configuration
├── next.config.mjs            # Next.js configuration
├── src/
│   ├── app/                   # App Router pages, layouts, and API routes
│   │   ├── api/               # API endpoints
│   │   │   └── auth/          # NextAuth route handler [...nextauth]
│   │   ├── error.tsx          # App route error boundary
│   │   ├── not-found.tsx      # 404 handler
│   │   ├── layout.tsx         # Root layout with font and toast/providers
│   │   └── page.tsx           # Home landing / dashboard placeholder
│   ├── components/            # Reusable React components
│   │   ├── ui/                # Base design system primitives (Button, Input, Card, Modal, Toast, Skeleton, Table, Badge, EmptyState)
│   │   └── providers/         # Context providers (SessionProvider, ToastProvider)
│   ├── lib/                   # Shared utilities, singletons, and configurations
│   │   ├── db.ts              # Cached Mongoose connection for serverless
│   │   ├── api-response.ts    # Standardized API response helper { success, data, error }
│   │   ├── auth.ts            # NextAuth configuration and authOptions
│   │   └── utils.ts           # Styling helper (cn / clsx / tailwind-merge)
│   ├── models/                # Mongoose database models
│   │   └── User.ts            # Creator / User schema and model
│   ├── services/              # Domain logic and database service layers
│   │   └── user.service.ts    # User service methods
│   ├── types/                 # Shared TypeScript interfaces and type definitions
│   │   ├── api.ts             # API response and request shapes
│   │   ├── auth.ts            # Auth session and token extensions
│   │   └── index.ts           # Export barrel for types
│   └── validators/            # Zod validation schemas
│       └── auth.validator.ts  # Registration, login, and profile schemas
```

---

## 4. API Response Specification

All API routes (`/api/*`) must return JSON adhering to the standardized envelope shape:

```typescript
// Success Response (HTTP 200/201)
{
  "success": true,
  "data": { ... }
}

// Error Response (HTTP 400/401/403/404/500)
{
  "success": false,
  "error": {
    "message": "Human-readable error description",
    "code": "ERROR_CODE",
    "details": { ...optional validation details or field errors... }
  }
}
```

Use the helper functions provided in `src/lib/api-response.ts`:
- `apiSuccess(data, status = 200)`
- `apiError(message, status = 400, code?, details?)`

---

## 5. Design System & UI Components

### Color Tokens
- **Brand Primary**: Indigo/Violet (`brand-500: #6366f1`, `brand-600: #4f46e5`) — evokes modern professionalism and trust.
- **Warm Accent**: Amber/Gold/Saffron (`accent-500: #f59e0b`, `accent-600: #d97706`) — high-conversion accent for CTAs, sale badges, and highlight elements.
- **Neutrals**: Slate / Zinc grays for crisp readability.

### Reusable UI Primitives (`src/components/ui/`)
- `Button`: Primary, secondary, outline, ghost, destructive, with loading spinners and sizes (`sm`, `md`, `lg`).
- `Input`: Accessible input with label, helper text, error message state, and icon adornments.
- `Card`: Composable `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` with rounded corners and soft shadows.
- `Modal`: Accessible dialog with overlay, close triggers, and smooth animations.
- `Toast`: Global notification toast system (Success, Error, Info, Warning).
- `Skeleton`: Shimmering placeholder components for loading states.
- `Table`: Responsive table with `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell`.
- `Badge`: Status tags (primary, success, warning, neutral, accent).
- `EmptyState`: Clean placeholder with iconography, title, subtitle, and primary call-to-action button.

---

## 6. Development Workflow

- Run dev server: `npm run dev`
- Run linting: `npm run lint`
- Build for production: `npm run build`
- Always verify typecheck passes with `npx tsc --noEmit` before considering work done.
