// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // WARNA DIDEFINISIKAN LANGSUNG DI SINI
      colors: {
        'navbar': '#0D1117',
        'background-main': '#1E1E2F',
        'background-secondary': '#2C2C3E',
        'accent-main': '#7E47B8',
        'accent-secondary': '#B647B8',
        'text-main': '#FFFFFF',
        'text-secondary': '#B0B0B0',
        'success': '#4CAF50',
        'error': '#E74C3C',
        'warning': '#F1C40F',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'), // Tambahkan baris ini
  ],
}
export default config