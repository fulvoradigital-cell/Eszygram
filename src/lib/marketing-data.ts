export const SOCIAL_PROOF_STATS = {
  creatorsCount: "15,000+",
  creatorsLabel: "Active Indian Creators",
  salesProcessed: "₹5.4 Cr+",
  salesLabel: "Creator Earnings Processed",
  dmsAutomated: "2.4M+",
  dmsLabel: "Instagram DMs Automated",
} as const;

export const FAQ_ITEMS = [
  {
    q: "What are the platform fees and how do they work?",
    a: "On the Free plan, Ezsygram charges a 10% platform fee on successful sales. On the Pro plan (₹499/month), the fee drops to just 5%. On the Business plan (₹1,499/month), platform fees are 0% to 2%. Standard payment gateway processing fees apply directly with no hidden surcharges.",
  },
  {
    q: "How fast do I receive UPI payouts in my Indian bank account?",
    a: "Payouts are transferred directly to your verified Indian bank account (via NEFT/IMPS) or your UPI ID. You can view your real-time ledger balance and request payouts once your available balance meets the minimum payout threshold.",
  },
  {
    q: "How does UPI-first checkout help my conversion rate?",
    a: "Over 85% of creator audience traffic in India arrives from Instagram mobile in-app browsers. Unlike traditional checkouts that force users to create accounts and enter 16-digit card numbers, Ezsygram opens their preferred UPI intent apps with 1 tap, reducing drop-off by up to 60%.",
  },
  {
    q: "Can I offer refunds or handle cancellation requests?",
    a: "Yes. From your Orders dashboard, you can initiate full or partial refunds for any order with a single click. The refund is automatically routed back to the buyer's original UPI or payment source, and your ledger is adjusted accordingly.",
  },
  {
    q: "How does the Instagram comment-to-DM connection work?",
    a: "Ezsygram integrates through Meta's official Instagram Graph API. You simply connect your Instagram Creator or Business account, pick any post or Reel, and specify a keyword trigger (e.g. 'GUIDE' or 'LINK'). Whenever someone comments that word, our engine dispatches the direct private message instantly.",
  },
  {
    q: "Can I use my own custom domain (e.g. myname.com)?",
    a: "Yes! Custom domain mapping is supported on the Business plan. On Free and Pro plans, your storefront is instantly available at your unique Ezsygram handle (e.g. ezsygram.com/yourname).",
  },
  {
    q: "Do I own my customer data and email list?",
    a: "100% yes. You own every customer email, phone number, and purchase record. You can export your entire contact and lead list as a CSV file at any time without restrictions or penalties.",
  },
  {
    q: "Do buyers need to create an Ezsygram account to purchase from me?",
    a: "No. Buyers enjoy a frictionless guest checkout experience. They simply enter their name, email, and phone number, pay via UPI or card, and instantly receive their files and invoices. Returning buyers can view past purchases anytime using email OTP.",
  },
  {
    q: "Are GST-compliant invoices generated automatically for buyers?",
    a: "Yes. Every completed order automatically generates an itemized, tax-compliant PDF invoice that includes your business name and details, sent directly to the buyer's email.",
  },
  {
    q: "Can I cancel or switch my subscription plan at any time?",
    a: "Absolutely. You can upgrade, downgrade, or cancel your Pro or Business subscription from your Settings at any time. When you downgrade, your existing products remain safe, and you will not be billed for the next billing cycle.",
  },
] as const;

export const PLANS = [
  {
    id: "free",
    name: "Free",
    tagline: "For new creators starting out",
    monthlyPrice: 0,
    yearlyPrice: 0,
    feePercent: "10% platform fee",
    popular: false,
    cta: "Start free",
    href: "/auth/signup?plan=free",
    features: [
      "Up to 3 products or links",
      "Standard link-in-bio storefront",
      "UPI, Card & Netbanking payments",
      "Private file delivery vault",
      "Standard email notifications",
      "Standard analytics (7-day view)",
    ],
    notIncluded: [
      "Instagram comment-to-DM automation",
      "Custom coupons & order bumps",
      "Ezsygram badge removal",
      "Custom domain",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For creators actively selling on Instagram",
    monthlyPrice: 499,
    yearlyPrice: 4990, // 2 months free
    feePercent: "5% platform fee",
    popular: true,
    cta: "Get Pro (Start Free Trial)",
    href: "/auth/signup?plan=pro",
    features: [
      "Unlimited products & course modules",
      "Instagram comment-to-DM automation",
      "UPI-first 1-page instant checkout",
      "Custom coupons, discounts & order bumps",
      "Remove 'Made with Ezsygram' badge",
      "Video course viewer with lesson access",
      "Full 30-day analytics & DM attribution",
      "Automatic tax-compliant PDF invoices",
    ],
    notIncluded: ["Custom domain support", "Dedicated account manager"],
  },
  {
    id: "business",
    name: "Business",
    tagline: "For established educators & top creators",
    monthlyPrice: 1499,
    yearlyPrice: 14990, // 2 months free
    feePercent: "0% to 2% platform fee",
    popular: false,
    cta: "Get Business",
    href: "/auth/signup?plan=business",
    features: [
      "Everything in Pro",
      "Lowest platform fee (0%–2%)",
      "Custom domain support (yourdomain.com)",
      "Advanced cohort & buyer lifetime analytics",
      "VIP priority 24/7 WhatsApp & email support",
      "Dedicated creator onboarding manager",
      "Early access to new automation triggers",
    ],
    notIncluded: [],
  },
] as const;

