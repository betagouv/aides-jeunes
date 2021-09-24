module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/essential",
    "prettier",
    "plugin:cypress/recommended",
    "plugin:prettier-vue/recommended",
  ],
  plugins: ["prettier", "vue"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-irregular-whitespace": 0,
  },
}
