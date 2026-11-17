import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#7C3AED",
          600: "#6D28D9", // Primary Violet
          700: "#5B21B6",
          800: "#4C1D95",
          900: "#2E1065",
          indigo: "#4F46E5", // Primary Indigo
        },
        coral: {
          50: "#FFF4F1",
          100: "#FFE6DF",
          200: "#FFC9BC",
          300: "#FFA38E",
          400: "#FF8B6E",
          500: "#FF7A59", // Warm Coral/Orange Accent
          600: "#EA5837",
          700: "#C54123",
        },
        mint: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          400: "#34D399",
          500: "#10B981", // Mint Success
          600: "#059669",
          700: "#047857",
        },
        canvas: {
          DEFAULT: "rgb(var(--bg-canvas) / <alpha-value>)",
          light: "#FAFAFB",
          dark: "#0B0B1A",
          darkCard: "#13132B",
          darkBorder: "#232346",
        },
        card: "rgb(var(--bg-surface) / <alpha-value>)",
        "slate-subtle": "rgb(var(--bg-subtle) / <alpha-value>)",
        "slate-text": "rgb(var(--text-primary) / <alpha-value>)",
        "slate-muted": "rgb(var(--text-secondary) / <alpha-value>)",
        "slate-border": "rgb(var(--border-subtle) / <alpha-value>)",
        "brand-violet": "rgb(var(--brand-violet) / <alpha-value>)",
        "brand-indigo": "rgb(var(--brand-indigo) / <alpha-value>)",
        navy: "rgb(var(--text-primary) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "fluid-sm": ["clamp(0.8125rem, 0.78rem + 0.15vw, 0.875rem)", { lineHeight: "1.45" }],
        "fluid-base": ["clamp(0.9375rem, 0.9rem + 0.2vw, 1rem)", { lineHeight: "1.6" }],
        "fluid-lg": ["clamp(1.0625rem, 1rem + 0.35vw, 1.25rem)", { lineHeight: "1.5" }],
        "fluid-xl": ["clamp(1.25rem, 1.1rem + 0.65vw, 1.5rem)", { lineHeight: "1.35" }],
        "fluid-2xl": ["clamp(1.5rem, 1.25rem + 1.1vw, 2rem)", { lineHeight: "1.25" }],
        "fluid-3xl": ["clamp(1.875rem, 1.45rem + 1.8vw, 2.75rem)", { lineHeight: "1.15" }],
        "fluid-hero": ["clamp(2.25rem, 1.65rem + 2.8vw, 4rem)", { lineHeight: "1.08" }],
      },
      borderRadius: {
        "2xl": "1rem",   // 16px
        "3xl": "1.5rem", // 24px
        "4xl": "2rem",   // 32px
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgba(15, 23, 42, 0.05), 0 1px 3px 0 rgba(15, 23, 42, 0.04)",
        card: "0 10px 30px -8px rgba(15, 23, 42, 0.07), 0 2px 8px -2px rgba(15, 23, 42, 0.04)",
        elevated: "0 20px 50px -12px rgba(15, 23, 42, 0.14), 0 4px 16px -4px rgba(15, 23, 42, 0.06)",
        glow: "0 12px 32px -6px rgba(109, 40, 217, 0.35), 0 4px 12px -2px rgba(79, 70, 229, 0.22)",
        "glow-coral": "0 12px 28px -6px rgba(255, 122, 89, 0.35)",
        brand: "0 10px 30px -8px rgba(109, 40, 217, 0.45)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #6D28D9 0%, #4F46E5 100%)",
        "brand-gradient-hover": "linear-gradient(135deg, #5B21B6 0%, #4338CA 100%)",
        "coral-gradient": "linear-gradient(135deg, #FF7A59 0%, #EA5837 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s infinite linear",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

