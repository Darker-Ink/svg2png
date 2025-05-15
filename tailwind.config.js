/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0D0D0D',
          secondary: '#151515'
        },
        primary: {
          DEFAULT: '#00FF41',
          muted: '#00CC33',
          dark: '#008F11'
        },
        secondary: {
          DEFAULT: '#003B00',
          light: '#005F00'
        },
        accent: '#00FF41',
        success: '#00FF41',
        warning: '#FFD700',
        error: '#FF3E36',
        text: {
          primary: '#FFFFFF',
          secondary: '#AAAAAA',
          muted: '#888888'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', '"Courier New"', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', '"Open Sans"', '"Helvetica Neue"', 'sans-serif']
      },
      boxShadow: {
        'glow': '0 0 8px rgba(0, 255, 65, 0.5)',
        'glow-lg': '0 0 16px rgba(0, 255, 65, 0.6)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};