/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Main Primary
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        success: {
          50: '#ECFDF5',
          500: '#10B981', // Main Success
          600: '#059669',
        },
        danger: {
          50: '#FEF2F2',
          500: '#EF4444', // Main Danger
          600: '#DC2626',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B', // Main Warning
          600: '#D97706',
        },
        surface: {
          light: '#F8FAFC',
          dark: '#0F172A',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 10px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
