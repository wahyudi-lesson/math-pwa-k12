/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lexend', 'sans-serif'], // Font ramah membaca dan disleksia
      },
      colors: {
        numicon: {
          1: '#f97316',
          2: '#38bdf8',
          3: '#eab308',
          4: '#a3e635',
          5: '#ef4444',
          6: '#06b6d4',
          7: '#ec4899',
          8: '#10b981',
          9: '#8b5cf6',
          10: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
}
