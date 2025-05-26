/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f2',
          100: '#fde0e0',
          200: '#fbc5c5',
          300: '#f8a0a0',
          400: '#f37272',
          500: '#e01e26', // MRF primary red
          600: '#c71a21',
          700: '#a3161c',
          800: '#851419',
          900: '#6a1215',
        },
        secondary: {
          50: '#f0f3fa',
          100: '#dae0f2',
          200: '#bcc8e4',
          300: '#95a7d1',
          400: '#677db6',
          500: '#455c9c',
          600: '#1a2b5f', // MRF secondary blue
          700: '#162450',
          800: '#111d41',
          900: '#0e1935',
        },
        accent: {
          500: '#FFB800', // Accent yellow for highlights
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
};