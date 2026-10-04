import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Strict monochrome Apple-grade palette
        canvas: '#F3F1EC',
        onyx: '#0B0B0B',
        ink: '#141414',
        chalk: '#F3F1EC',
        slate: '#6E6E6E',
        hairline: {
          light: '#E4E1DA',
          dark: '#262626',
          DEFAULT: '#E4E1DA',
        },
        border: 'var(--hairline-color, #E4E1DA)',
        background: 'var(--bg-color, #F3F1EC)',
        foreground: 'var(--text-color, #141414)',
      },
      fontFamily: {
        heading: ['var(--font-jost)', 'Jost', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        'apple-wide': '0.18em',
        'apple-widest': '0.24em',
      },
      transitionTimingFunction: {
        'apple-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'apple-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
};

export default config;
