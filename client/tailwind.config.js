/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: '#4f46e5', // Electric Indigo
          'primary-dark': '#3730a3',
          'primary-light': '#6366f1',
          secondary: '#06b6d4', // Vibrant Cyan
          'secondary-dark': '#0891b2',
          'secondary-light': '#22d3ee',
          accent: '#8b5cf6', // Violet
          dark: '#0f172a',
          card: '#ffffff'
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glow-indigo': '0 0 30px -5px rgba(79, 70, 229, 0.3)',
        'glow-cyan': '0 0 30px -5px rgba(6, 182, 212, 0.3)',
        'glow-lg': '0 10px 40px -10px rgba(99, 102, 241, 0.25)',
        'card': '0 10px 30px -5px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 20px 40px -10px rgba(79, 70, 229, 0.12), 0 0 0 1px rgba(79, 70, 229, 0.2)',
      },
      animation: {
        'skew-scroll': 'skewScroll 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        skewScroll: {
          '0%': { transform: 'rotate(-5deg) translateY(0)' },
          '100%': { transform: 'rotate(-5deg) translateY(-1000px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
}

