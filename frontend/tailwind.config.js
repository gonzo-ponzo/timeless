/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      red: "#FF0000",
      cream: "#FFF4E2",
      blue: "rgba(113,150,199,0.67)",
      darkBlue: "rgb(45,86,138)",
      green: "rgba(220, 255, 225, 0.67)",
      darkGreen: "rgba(107, 220, 139, 1)",
      pink: "rgba(255,220,220,0.56)",
      darkPink: "rgb(161,107,107)",
      white: "#FCFFFC",
      brown: "#9E7531",
      lightBrown: "rgba(158, 117, 49, 0.7)",
      darkBrown: "#5C3D0B",
      lightCream: "rgba(158, 117, 49, 0.12)",
      gray: "#E5E7EB",
      lightGray: "#F9FAFB",
      black: "#000000",
      transparent: "rgba(26,26,25,0.42)",
    },
  },
  plugins: [],
};
