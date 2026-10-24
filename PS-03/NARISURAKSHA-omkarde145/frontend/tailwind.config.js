/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#090D16',
          secondary: '#0F172A',
          tertiary: '#1E293B',
          card: 'rgba(15, 23, 42, 0.75)',
        },
        brand: {
          teal: '#0D9488',
          tealLight: '#14B8A6',
          tealGlow: 'rgba(20, 184, 166, 0.15)',
          emerald: '#10B981',
          rose: '#F43F5E',
          amber: '#F59E0B',
          indigo: '#6366F1',
        },
        slate: {
          850: '#131c2e',
          950: '#070b12',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.3)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
