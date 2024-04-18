import flowbite from "flowbite-react/tailwind";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
      },
    },
  },
  plugins: [flowbite.plugin()],
} satisfies Config;
