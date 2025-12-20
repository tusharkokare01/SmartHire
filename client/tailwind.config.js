/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // dynamic theme via CSS variables
        primary: "#059669",       // Brand Color (Emerald-600)
        secondary: "var(--text-secondary)", // Secondary Text (Slate)
        background: "var(--bg-primary)",  // App Background
        surface: "var(--bg-secondary)",   // Card Background
        accent: "var(--accent)",      // Success/Accent (Green)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}