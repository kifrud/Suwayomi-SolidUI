/** @type {import('tailwindcss').Config} */
import { breakpoints } from './src/helpers'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      aspectRatio: {
        cover: '257 / 364',
      },
      screens: breakpoints,
    },
  },
  plugins: [],
}
