import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "next-env.d.ts",
      ".next-env.d.ts",
    ],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "error",
      "@next/next/google-font-display": "warn",
    },
  },
];

export default config;
