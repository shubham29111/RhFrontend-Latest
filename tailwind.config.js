import withMT from "@material-tailwind/html/utils/withMT";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'pt-root-ui': ['"PT Root UI"', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('daisyui'),
    require('preline/plugin'),


  ],
}

