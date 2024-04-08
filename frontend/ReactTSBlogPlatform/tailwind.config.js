/** @type {import('tailwindcss').Config} */
export default{
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Oswald"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        hero: ['"Secular One"', 'sans-serif'],
      },
      colors: {
        primary: "var(--color-primary)",
      },
      backgroundImage: {
        texture:
          "url(/glow-texture.png), radial-gradient(var(--color-primary), transparent 70%)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    '@tailwindcss/forms',
  ],
};