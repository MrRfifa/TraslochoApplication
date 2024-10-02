/** @type {import('tailwindcss').Config} */
import flowbitePlugin from 'flowbite/plugin';

export default {
  content: [
    "./index.html",                   // Your HTML file
    "./src/**/*.{js,ts,jsx,tsx}",      // Your source files
    "./node_modules/flowbite/**/*.js", // Add Flowbite's content path
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbitePlugin  // Include Flowbite plugin here
  ],
};