/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        display: ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
      colors: {
        background: { DEFAULT: "var(--background)" },
        foreground: { DEFAULT: "var(--foreground)" },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        border: { DEFAULT: "var(--border)" },
        input: { DEFAULT: "var(--input)" },
        ring: { DEFAULT: "var(--ring)" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "float-y": "floatY 4s ease-in-out infinite",
        "reveal-up": "revealUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fadeIn 0.6s ease forwards",
        "spin-slow": "spinSlow 20s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "border-glow": "borderGlow 3s ease-in-out infinite",
        "glow-pulse": "glowPulse 2.5s ease-in-out infinite",
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        revealUp: {
          "0%": { opacity: "0", transform: "translateY(60px)", filter: "blur(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0,255,255,0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(0,255,255,0.7), 0 0 60px rgba(0,85,255,0.3)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.9" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(0,255,255,0.2)" },
          "50%": { borderColor: "rgba(0,255,255,0.6)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      backgroundImage: {
        "gradient-neon": "linear-gradient(135deg, #0055FF 0%, #7B00FF 50%, #00FFFF 100%)",
        "gradient-cyber": "linear-gradient(135deg, #00FFFF 0%, #0055FF 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};