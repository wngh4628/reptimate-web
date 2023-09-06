/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "main-color": "#6D71E6",
        "gender-male-color": "#ABCDFF",
        "gender-male-dark-color": "#4D95FF",
        "gender-female-color": " #FFB1B1",
        "gender-female-dark-color": " #FF6767",
        "gender-none-color": "#B7B7B7",
        "gender-none-dark-color": "#737373",
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    [require("@tailwindcss/aspect-ratio"), require("@tailwindcss/typography")],
  ],
};
