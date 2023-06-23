/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        dark: "#343538",
        primary: "rgb(234,179,8)",
        secondary: "#686869",
        secondaryHighlight: "#4a4a4a",
        secondaryLowlight: "#424242",
        transparent: "rgba(0,0,0,0)",
      },
      fontFamily: {},
    },
  },
  plugins: [],
};
