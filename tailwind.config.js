/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#f0fdfa', // very light teal
          100: '#ccfbf1', // soft seafoam
          500: '#14b8a6', // bright teal
          600: '#0d9488', // deep teal (primary)
          700: '#0f766e',
          900: '#134e4a',
        },
        sand: {
          50: '#fbfaf8', // off-white warm
          100: '#f5f5f4',
          200: '#e7e5e4', // subtle beige
        },
        status: {
          safe: '#22c55e', // green
          safeBg: '#dcfce7',
          safeText: '#166534',
          caution: '#f59e0b', // amber
          cautionBg: '#fef3c7',
          cautionText: '#92400e',
          danger: '#ef4444', // red
          dangerBg: '#fee2e2',
          dangerText: '#991b1b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
