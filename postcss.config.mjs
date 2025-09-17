/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // INI PERUBAHANNYA: dari 'tailwindcss' menjadi '@tailwindcss/postcss'
    '@tailwindcss/postcss': {},
    'autoprefixer': {},
  },
};

export default config;