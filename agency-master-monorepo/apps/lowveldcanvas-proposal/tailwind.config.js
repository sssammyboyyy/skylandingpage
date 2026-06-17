/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui-master/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        agency: {
          dark: '#1a1a1a', 
          muted: '#2E2C2E',
          accent: '#847868',
          text: '#FAFAFA',
          subtext: '#A3A3A3'
        }
      }
    },
  },
  plugins: [],
}
