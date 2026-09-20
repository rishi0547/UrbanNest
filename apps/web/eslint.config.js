import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx}"],
  },
  ...nextJsConfig,
  {
    ignores: ["eslint.config.js", "next.config.js", "postcss.config.mjs", ".next/**"],
  },
];
