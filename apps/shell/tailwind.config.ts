import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        border: 'var(--df-color-divider)',
        background: 'var(--df-color-background)',
        foreground: 'var(--df-color-text)',
        primary: 'var(--df-color-primary)',
        muted: 'var(--df-color-surface-inset)',
        danger: 'var(--df-color-error)',
      },
      boxShadow: {
        soft: 'var(--df-shadow-surface)',
      },
    },
  },
  plugins: [],
};

export default config;
