/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'profit-emerald': {
          DEFAULT: '#059669',
          tint: '#ECFDF5',
          border: '#A7F3D0',
          dark: '#065F46',
        },
        'expense-rose': {
          DEFAULT: '#E11D48',
          tint: '#FFF1F2',
          border: '#FECDD3',
          dark: '#9F1239',
        },
        surface: {
          canvas: '#F8FAFC',
          card: '#FFFFFF',
          dim: '#E2E8F0',
        },
        slate: {
          display: '#0F172A',
          body: '#334155',
          muted: '#64748B',
          border: '#E2E8F0',
          subtle: '#F1F5F9',
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
