/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          teal: {
            DEFAULT: '#337778',
            50: '#f0f7f7',
            100: '#d9ebeb',
            200: '#b3d7d7',
            300: '#8ec3c3',
            400: '#68afb0',
            500: '#439b9c',
            600: '#337778', // Main teal color
            700: '#2a6060',
            800: '#204848',
            900: '#183030',
          },
          yellow: {
            DEFAULT: '#f3c04c',
            50: '#fefaf0',
            100: '#fdf5e1',
            200: '#faebc3',
            300: '#f8e1a5',
            400: '#f5d087',
            500: '#f3c04c', // Main yellow color
            600: '#d29b29',
            700: '#a67720',
            800: '#795417',
            900: '#4c350e',
          },
          blue: {
            50: '#f0f5ff',
            100: '#e5edff',
            200: '#cddbfe',
            300: '#b4c6fc',
            400: '#8da2fb',
            500: '#6875f5',
            600: '#5850ec',
            700: '#5145cd',
            800: '#42389d',
            900: '#362f78',
          },
        },
        typography: (theme) => ({
          DEFAULT: {
            css: {
              color: theme('colors.gray.900'),
              a: {
                color: theme('colors.teal.600'),
                '&:hover': {
                  color: theme('colors.teal.700'),
                },
              },
              'code::before': {
                content: '""',
              },
              'code::after': {
                content: '""',
              },
            },
          },
        }),
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
};