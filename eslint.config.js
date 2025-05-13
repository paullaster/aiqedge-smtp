import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js,
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: "latest"
      },
      globals: { ...globals.node, ...globals.browser }
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      // Add or override rules here
    }
  },
  tseslint.configs.recommended
];