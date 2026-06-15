import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        spider: {
          red: "#E11D48",
          blue: "#1D4ED8",
          dark: "#020617",
          navy: "#0F172A",
          cyan: "#22D3EE",
          purple: "#A855F7",
          web: "rgba(255,255,255,0.1)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        hero: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-radar": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(3)", opacity: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", opacity: "0.5" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0.5" },
        },
        "spider-sense": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(225, 29, 72, 0.5), 0 0 10px rgba(225, 29, 72, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(225, 29, 72, 0.8), 0 0 40px rgba(225, 29, 72, 0.5), 0 0 60px rgba(225, 29, 72, 0.3)" },
        },
        "web-swing": {
          "0%, 100%": { transform: "rotate(-3deg) translateY(0)" },
          "25%": { transform: "rotate(3deg) translateY(-3px)" },
          "50%": { transform: "rotate(-2deg) translateY(-1px)" },
          "75%": { transform: "rotate(2deg) translateY(-2px)" },
        },
        "holographic-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "rain-drop": {
          "0%": { transform: "translateY(-10vh) translateX(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(110vh) translateX(-20px)", opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "spider-web-draw": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "city-lights": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "threat-pulse": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-radar": "pulse-radar 2s ease-out infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spider-sense": "spider-sense 1.5s ease-in-out infinite",
        "web-swing": "web-swing 3s ease-in-out infinite",
        "holographic-shimmer": "holographic-shimmer 3s linear infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "rain-drop": "rain-drop 1.5s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "spider-web-draw": "spider-web-draw 3s ease-out forwards",
        "city-lights": "city-lights 3s ease-in-out infinite",
        "threat-pulse": "threat-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
