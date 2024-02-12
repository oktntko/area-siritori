/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Murecho"', 'sans-serif'],
        mono: ['"M PLUS 1 Code"', 'monospace'],
      },
    },
  },
  plugins: [],
};
