import { palette } from './src/theme/palette.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: palette.primary,
        'primary-hover': palette.primaryHover,
        secondary: palette.secondary,
        'secondary-hover': palette.secondaryHover,
        accent: palette.accent,
        background: palette.background,
        surface: palette.surface,
        text: palette.text,
        'text-secondary': palette.textSecondary,
        border: palette.border,
        error: palette.error,
        success: palette.success,
        warning: palette.warning,
      }
    },
  },
  plugins: [],
}
