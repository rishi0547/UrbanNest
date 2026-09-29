import babelParser from "@babel/eslint-parser";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import onlyWarn from "eslint-plugin-only-warn";

const customParser = {
  ...babelParser,
  parse(code, options) {
    return babelParser.parse(code, options);
  },
  parseForESLint(code, options) {
    const result = babelParser.parseForESLint(code, options);
    if (result && result.scopeManager && typeof result.scopeManager.addGlobals !== "function") {
      result.scopeManager.addGlobals = function (names) {
        const globalScope = this.scopes?.[0];
        if (globalScope && globalScope.set) {
          for (const name of names) {
            if (!globalScope.set.has(name)) {
              globalScope.set.set(name, {
                name,
                identifiers: [],
                references: [],
                defs: [],
              });
            }
          }
        }
      };
    }
    return result;
  },
};

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      parser: customParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-typescript"],
        },
      },
    },
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
];
