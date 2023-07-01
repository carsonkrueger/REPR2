import CustomColors from "./src/util/customColors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ...CustomColors,
      },
      fontFamily: {},
    },
  },
  plugins: [],
  darkMode: "class",
};
