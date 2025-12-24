/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E63946",   
        secondary: "#1D3557",
        accent: "#457B9D",
        neutral: "#3D4451",
        "base-100": "#FFFFFF", 
        "base-200": "#F1F5F9",
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light"],
  },
}