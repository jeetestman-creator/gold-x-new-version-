/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  // Fixed: Added standard content paths for scanning
  theme: {
    extend: {},
  },
  plugins: [],
};
