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
        "gender-female-color": " #FFB1B1",
        "gender-none-color": "#B7B7B7",
      },
    },
  },
  plugins: [],
};
