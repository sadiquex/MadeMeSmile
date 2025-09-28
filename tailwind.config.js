/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#f87171",
      },
      fontFamily: {
        sora: ["Sora_400Regular"],
        "sora-medium": ["Sora_600SemiBold"],
        "sora-bold": ["Sora_700Bold"],
      },
    },
  },
  plugins: [],
};
