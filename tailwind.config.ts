import type { Config } from 'tailwindcss';

/**
 * NutriFitCoach Design System - Tailwind Config
 *
 * CORES DA MARCA (gradiente da logo):
 * - nfc-cyan: #00D4C8
 * - nfc-emerald: #10B981
 * - nfc-violet: #8B5CF6
 *
 * USO DO GRADIENTE:
 * bg-gradient-to-r from-nfc-cyan via-nfc-emerald to-nfc-violet
 */

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors (logo gradient)
        'nfc-cyan': {
          DEFAULT: '#00D4C8',
          50: '#E0FFFE',
          100: '#B3FFFC',
          200: '#80FFF9',
          300: '#4DFFF6',
          400: '#1AFFF3',
          500: '#00D4C8',
          600: '#00A89E',
          700: '#007C75',
          800: '#00504C',
          900: '#002423',
        },
        'nfc-emerald': {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        'nfc-violet': {
          DEFAULT: '#8B5CF6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        // Accent color (neon green from chat)
        'nfc-neon': {
          DEFAULT: '#00FF88',
          50: '#E0FFF0',
          100: '#B3FFD9',
          200: '#80FFC2',
          300: '#4DFFAB',
          400: '#1AFF94',
          500: '#00FF88',
          600: '#00CC6D',
          700: '#009952',
          800: '#006637',
          900: '#00331C',
        },
      },
      backgroundImage: {
        // Brand gradient
        'nfc-gradient': 'linear-gradient(to right, #00D4C8, #10B981, #8B5CF6)',
        'nfc-gradient-hover': 'linear-gradient(to right, #00B8AD, #0D9668, #7C4FE0)',
        // Dark variants
        'nfc-gradient-dark': 'linear-gradient(to right, rgba(0,212,200,0.1), rgba(16,185,129,0.1), rgba(139,92,246,0.1))',
      },
      boxShadow: {
        'nfc-glow': '0 0 20px rgba(0,212,200,0.3), 0 0 40px rgba(16,185,129,0.2)',
        'nfc-glow-violet': '0 0 20px rgba(139,92,246,0.3)',
        'nfc-neon': '0 0 15px rgba(0,255,136,0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        // Chat animations 💕
        'fadeIn': 'fadeIn 0.2s ease-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'slideInUp': 'slideInUp 0.3s ease-out',
        'slideInLeft': 'slideInLeft 0.3s ease-out',
        'slideInRight': 'slideInRight 0.3s ease-out',
        'scaleIn': 'scaleIn 0.2s ease-out',
        'bounceIn': 'bounceIn 0.5s ease-out',
        'typing': 'typing 1.4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 136, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.4), 0 0 40px rgba(0, 255, 136, 0.2)' },
        },
        'shimmer': {
          '0%': { 'background-position': '-100% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        // Chat keyframes 💕
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slideIn': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slideInUp': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slideInLeft': {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slideInRight': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scaleIn': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'bounceIn': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'typing': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Custom scrollbar plugin
    function({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
        },
        '.scrollbar-thumb-zinc-700': {
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#3f3f46',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
};

export default config;
