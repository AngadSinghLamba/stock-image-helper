/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary - Cosmic Gradient
        "deep-blue": "#0E21A0",
        purple: "#4D2FB2",
        magenta: "#B153D7",
        pink: "#F375C2",

        // Success/Warning/Error
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        glow: "0 4px 20px rgba(177, 83, 215, 0.3)",
        "glow-lg": "0 8px 32px rgba(177, 83, 215, 0.4)",
      },
    },
  },
  plugins: [],
};
