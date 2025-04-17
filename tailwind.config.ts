import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/(auth)/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/(main)/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#f5f8fa", // app background
          card: "#ffffff",    // cards / panels
          hover: "#e8f5fe",   // soft blue hover similar to Twitter
        },
        foreground: {
          DEFAULT: "#0f1419", // main text
          muted: "#536471",   // secondary text
          subtle: "#8899a6",
        },
        accent: {
          DEFAULT: "#1d9bf0",
          hover: "#1a8cd8",
          light: "#8ecdf8",
        },
        border: {
          DEFAULT: "#e1e8ed",
          light: "#cfd9de",
        },
        success: "#00ba7c",
        error: "#f4212e",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};
export default config;

