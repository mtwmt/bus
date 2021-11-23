module.exports = {
  mode: process.env.TAILWIND_MODE ? "jit" : "",
  purge: {
    content: ["./src/**/*.{html,ts}"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
