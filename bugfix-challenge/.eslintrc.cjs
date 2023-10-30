/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  ignorePatterns: ["**/*.config.js", "e2e", "**/*.spec.js"],
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["../*"],
            message: "Usage of relative parent imports is not allowed.",
          },
        ],
      },
    ],
    eqeqeq: ["error", "smart"],
    "max-lines": ["error", 300],
    "no-console": "error",
    "no-shadow": "error",
    "no-var": "error",
    "prefer-const": "error",
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
};
