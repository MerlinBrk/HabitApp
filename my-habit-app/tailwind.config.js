import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // wichtig!
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--primary-color) / <alpha-value>)", // 🟣 das ist der wichtige Teil
      },
      fontFamily: {
        helvetica: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.hide-scrollbar': {
          'scrollbar-width': 'none', // Firefox
          '-ms-overflow-style': 'none', // IE 10+
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          display: 'none', // Chrome, Safari
        },
      };

      addUtilities(newUtilities, ['responsive']);
    }),
  ],
};
