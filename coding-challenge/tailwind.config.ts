import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        russo: "'Russo One', sans-serif",
      },
    },
  },
  plugins: [],
} satisfies Config
