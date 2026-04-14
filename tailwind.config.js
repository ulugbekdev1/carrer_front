/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        shadow1: "0px 2px 6px rgba(20, 20, 43, 0.06)",
        shadow2: "0px 2px 12px rgba(20, 20, 43, 0.08)",
        shadow3: "0px 8px 28px rgba(20, 20, 43, 0.10)",
        shadow4: "0px 14px 42px rgba(20, 20, 43, 0.14)",
        shadow5: "0px 24px 65px rgba(20, 20, 43, 0.16)",
        shadow6: "0px 32px 72px rgba(20, 20, 43, 0.24)",
        custom: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        date: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      },
      colors: {
        primary: "#4A3AFF",
        secondary: "#000000",
        thin:"#696F79"
      },
    },
  },
  plugins: [],
};
