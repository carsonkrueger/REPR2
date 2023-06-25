/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // light mode
        primary: "#60a5fa",
        secondary: "#8fc1ff",
        back: "#f5f5f5",
        front: "#fff",

        // dark mode
        "dark-back": "#343538",
        "dark-front": "#3e3f42",

        // Misc
        "light-green": "#ccffde",
        "dark-green": "#bbf7d0",
        "extra-dark-green": "#a2e8bb",
        "dark-finished-green": "#95b89d",
      },
      fontFamily: {},
    },
  },
  plugins: [],
  darkMode: "class",
};
