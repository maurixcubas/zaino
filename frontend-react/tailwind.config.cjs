/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f5f5dc',    // Beige claro
        secondary: '#e1c78e',  // Beige medio
        accent: '#f8c6d0',     // Rosa pastel
        neutral: '#d2b48c',    // Marrón suave
        background: '#fdf6e3', // Blanco crema
        text: '#5c4b37',       // Marrón oscuro para texto
        'beige-light': '#f5f5dc',   // Beige claro
        'beige-medium': '#e1c78e',  // Beige medio
        'beige-dark': '#5c4b37',    // Marrón suave para texto
        'beige-darker': '#3d3025',  // Marrón más oscuro para hover
        'accent': '#f8c6d0',         // Rosa pastel (opcional)
        'background': '#fdf6e3',     // Blanco crema
      }
    },
  },
  plugins: [],
}