import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { obsidian: '#030303', surface: '#090909', laser: '#c40024' },
      fontFamily: { display: ['Oswald', 'Impact', 'sans-serif'], sans: ['Space Grotesk', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] },
    },
  },
  plugins: [],
} satisfies Config;
