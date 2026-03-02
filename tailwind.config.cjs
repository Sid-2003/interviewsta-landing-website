// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: { testpink: "#ff00aa" },
      keyframes: {
        caret: { "0%,40%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
        "spin-bg": { "0%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" }, "100%": { backgroundPosition: "0% 50%" } }
      },
      animation: { "spin-bg": "spin-bg 2s linear infinite", caret: "caret 1s step-end infinite" }
    },
  },
  plugins: [],
};
