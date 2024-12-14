/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        beat: "beat 0.8s infinite ease-in-out",
      },
      keyframes: {
        beat: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
      },
      colors: {
        primary: {
          50: "#fff0f0",
          100: "#ffdcdd",
          200: "#ffbfc0",
          300: "#ff9395",
          400: "#ff565a",
          500: "#ff2126",
          600: "#ff0107",
          700: "#d90005",
          800: "#b20206",
          900: "#90090c",
          950: "#510002",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
