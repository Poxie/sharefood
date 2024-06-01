import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#fff",
        secondary: "#F2F2F2",
        tertiary: "#E7E7E7",
        "c-primary": "#FF2264",
        "c-accent": "#E32961",
      },
      borderColor: {
        primary: "#fff",
        secondary: "#F2F2F2",
        tertiary: "#E7E7E7",
      },
      textColor: {
        primary: "#0f172a",
        muted: "#475569",
        light: "#fff",
        'c-primary': "#FF2264",
      },
      width: {
        main: '1100px',
      },
      maxWidth: {
        main: '90%',
      }
    },
  },
  plugins: [],
};
export default config;
