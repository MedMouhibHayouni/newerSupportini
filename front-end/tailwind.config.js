/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffa117',
          50: '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc170',
          400: '#ffa117',
          500: '#f98c06',
          600: '#dd6702',
          700: '#b74606',
          800: '#94360c',
          900: '#7a2e0d',
        },
        dark: {
          DEFAULT: '#22252a',
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d8d9dd',
          300: '#b6b8c0',
          400: '#8e919d',
          500: '#6f7280',
          600: '#5a5d6b',
          700: '#4a4c57',
          800: '#3f414a',
          900: '#22252a',
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  },
  plugins: [],
}
