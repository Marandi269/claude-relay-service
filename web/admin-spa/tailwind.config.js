/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Linear-inspired color palette
        linear: {
          // Backgrounds
          bg: {
            primary: '#0A0A0B',
            secondary: '#131316',
            tertiary: '#1C1C1F',
            elevated: '#222226',
            hover: '#2A2A2E'
          },
          // Text colors
          text: {
            primary: '#FFFFFF',
            secondary: '#A0A0A6',
            tertiary: '#6B6B70',
            muted: '#4A4A4F'
          },
          // Border colors
          border: {
            default: 'rgba(255, 255, 255, 0.08)',
            subtle: 'rgba(255, 255, 255, 0.05)',
            strong: 'rgba(255, 255, 255, 0.12)'
          },
          // Accent colors - Tech blue palette
          accent: {
            primary: '#2563EB',
            'primary-light': '#3B82F6',
            'primary-dark': '#1D4ED8',
            blue: '#2563EB',
            'blue-light': '#60A5FA',
            cyan: '#06B6D4',
            green: '#10B981',
            yellow: '#F59E0B',
            orange: '#F97316',
            red: '#EF4444'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }]
      },
      borderRadius: {
        linear: '6px',
        'linear-lg': '8px',
        'linear-xl': '12px'
      },
      boxShadow: {
        linear: '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15)',
        'linear-lg': '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
        'linear-xl': '0 8px 16px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)',
        'linear-glow': '0 0 0 2px rgba(94, 106, 210, 0.3)'
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.15s ease-out',
        'slide-down': 'slideDown 0.15s ease-out',
        'scale-in': 'scaleIn 0.1s ease-out',
        spin: 'spin 0.8s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      transitionDuration: {
        fast: '100ms',
        normal: '150ms',
        slow: '200ms'
      }
    }
  },
  plugins: []
}
