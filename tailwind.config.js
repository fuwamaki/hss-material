const { heroui } = require("@heroui/react");

// tailwindcssを使うための設定ファイル。
// ※公式サイト: https://tailwindcss.com/
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#409fff",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
