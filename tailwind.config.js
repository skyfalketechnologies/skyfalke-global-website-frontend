/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Nexa', 'Inter', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
        'nexa': ['Nexa', 'sans-serif'],
        'nexa-light': ['Nexa-ExtraLight', 'Nexa', 'sans-serif'],
        'nexa-heavy': ['Nexa-Heavy', 'Nexa', 'sans-serif'],
      },
      colors: {
        // Brand Colors
        'dark-blue': '#303661',
        'yellow': '#e0ae00',
        'brown': '#8f7622',
        'white': '#ffffff',
        
        // Extended Brand Color Palette
        primary: {
          50: '#f0f1f7',
          100: '#d9dce8',
          200: '#b3b8d1',
          300: '#8d94ba',
          400: '#6770a3',
          500: '#303661', // dark-blue
          600: '#2a2f56',
          700: '#24284b',
          800: '#1e2140',
          900: '#181a35',
        },
        secondary: {
          50: '#fefcf0',
          100: '#fdf5d1',
          200: '#fbeba3',
          300: '#f9e175',
          400: '#f7d747',
          500: '#e0ae00', // yellow
          600: '#cc9e00',
          700: '#b38e00',
          800: '#997e00',
          900: '#806e00',
        },
        accent: {
          50: '#f7f5f0',
          100: '#ebe6d6',
          200: '#d7ccad',
          300: '#c3b384',
          400: '#af995b',
          500: '#8f7622', // brown
          600: '#80691f',
          700: '#715c1c',
          800: '#624f19',
          900: '#534216',
        },
        // Christmas Theme Colors
        christmas: {
          red: '#dc2626',
          green: '#16a34a',
          gold: '#fbbf24',
          snow: '#ffffff',
          bg: '#0f172a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 1s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 1s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left': 'slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-up': 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-down': 'fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 0 0 rgba(48, 54, 97, 0.4)'
          },
          '50%': { 
            opacity: '0.8',
            boxShadow: '0 0 0 20px rgba(48, 54, 97, 0)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
