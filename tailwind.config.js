/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      // MUIのブレイクポイントに合わせる
      xs: '0px',
      sm: '600px',
      md: '960px',
      lg: '1280px',
      xl: '1920px',
    },
    extend: {
      colors: {
        // Coneaブランドカラーとの統合
        primary: {
          main: '#10B981',
          light: '#34D399',
          dark: '#059669',
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
        secondary: {
          main: '#6B7280',
          light: '#9CA3AF',
          dark: '#4B5563',
        },
        success: {
          main: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        info: {
          main: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
        },
        warning: {
          main: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
        error: {
          main: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      backgroundColor: {
        // ダークモード用の背景色
        dark: {
          DEFAULT: '#000000',
          paper: '#1a1a1a',
          surface: '#111111',
        }
      },
      textColor: {
        dark: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
        }
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        // MUIのシャドウに合わせる
        1: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        2: '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
        3: '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
        4: '0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)',
        5: '0 20px 40px rgba(0,0,0,0.2)',
      },
    },
  },
  // スクリーンリーダー専用クラス
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0',
        },
        '.focus-visible': {
          outline: '2px solid #10B981',
          outlineOffset: '2px',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}