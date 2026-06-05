import type { Config } from "tailwindcss";

/**
 * Gulbaan — Shell Select Store
 * A warm, floral, editorial design system.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/sanity/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds & paper
        cream: "#FAF5EF",
        ivory: "#FFFDF9",
        sand: "#EFE5D8",
        linen: "#F3EADF",
        // Florals & warmth
        blush: {
          DEFAULT: "#E7B7B3",
          soft: "#F3D9D6",
          deep: "#D98A91",
        },
        bloom: "#B45B5B", // deep rose accent
        rose: "#C97C7C",
        terracotta: "#C8755B",
        // Greens (stems / foliage)
        sage: "#9DB08C",
        fern: "#6E8662",
        moss: "#566B4A",
        // Neutrals / ink
        bark: "#4A4039",
        ink: "#2E2A26",
        clay: "#9A8576",
        // Premium accent
        gold: "#C9A24B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
        blob: "42% 58% 63% 37% / 41% 44% 56% 59%",
      },
      boxShadow: {
        soft: "0 18px 50px -24px rgba(74, 64, 57, 0.35)",
        petal: "0 28px 60px -30px rgba(180, 91, 91, 0.35)",
        lift: "0 30px 70px -35px rgba(46, 42, 38, 0.45)",
      },
      backgroundImage: {
        "cream-gradient":
          "radial-gradient(1200px 600px at 50% -10%, #FFFDF9 0%, #FAF5EF 45%, #F3EADF 100%)",
        "petal-gradient": "linear-gradient(135deg, #F3D9D6 0%, #EFE5D8 100%)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        "float-slow": "float-slow 9s ease-in-out infinite",
        "fade-up": "fade-up 0.7s ease-out both",
        sway: "sway 6s ease-in-out infinite",
      },
      transitionTimingFunction: {
        petal: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
