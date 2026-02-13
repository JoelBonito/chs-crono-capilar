import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          500: "#ECB613",
          600: "#D4A20F",
          700: "#7B5E00",
          800: "#614A00",
        },
        success: "#047857",
        warning: {
          DEFAULT: "#F59E0B",
          text: "#92400E",
        },
        error: "#B91C1C",
        info: "#1D4ED8",
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        serif: ["Newsreader", "Times New Roman", "Georgia", "serif"],
        sans: ["Manrope", "Segoe UI", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["2.25rem", { lineHeight: "1.1", fontWeight: "700" }],
        h2: ["1.75rem", { lineHeight: "1.2", fontWeight: "600" }],
        h3: ["1.375rem", { lineHeight: "1.3", fontWeight: "600" }],
        h4: ["1.125rem", { lineHeight: "1.3", fontWeight: "500" }],
        body: ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.4", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }],
        overline: ["0.6875rem", { lineHeight: "1.5", fontWeight: "600", letterSpacing: "0.05em" }],
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        md: "8px",
        lg: "16px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.07)",
        lg: "0 10px 15px rgba(0,0,0,0.1)",
        xl: "0 20px 25px rgba(0,0,0,0.1)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "400ms",
      },
      transitionTimingFunction: {
        default: "cubic-bezier(0.4, 0, 0.2, 1)",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
      },
      zIndex: {
        base: "0",
        dropdown: "100",
        sticky: "200",
        overlay: "300",
        modal: "400",
        toast: "500",
      },
    },
  },
  plugins: [],
} satisfies Config;
