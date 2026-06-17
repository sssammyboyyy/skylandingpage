/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../apps/*/src/**/*.{js,ts,jsx,tsx}",
    "../../apps/*/index.html"
  ],
  theme: {
    extend: {
      colors: {
        agency: {
          dark: '#0A0A0A',
          muted: '#171717',
          accent: '#C8A97E',
          text: '#FAFAFA',
          subtext: '#A3A3A3'
        }
      }
    },
  },
  plugins: [],
}
