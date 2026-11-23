/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0e2b1d',
          primary: '#143826',
          secondary: '#1c4d35',
          accent: '#b83b26',
          'accent-hover': '#9e2f1d',
          gold: '#dfa62c',
          'gold-light': '#fae29c',
          cream: '#faf7f0',
          'cream-dark': '#f0eae0',
          muted: '#627264',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}