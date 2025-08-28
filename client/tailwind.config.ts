import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      backgroundImage: {
        'stub-background-home': "url('/backgrounds/stub-background-home.png')",
        'stub-background-dashboard':
          "url('/backgrounds/stub-background-dashboard.png')",
        'stub-background-lobby':
          "url('/backgrounds/stub-background-lobby.png')",
      },
      dropShadow: {
        strong: '4px 4px 0.2px black',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
