module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:cypress/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:prettier-vue/recommended",
    "prettier",
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
    "vue/multi-word-component-names": 1,
    "vue/no-deprecated-v-on-native-modifier": 0,
    "eol-last": "error",
    "vue/require-default-prop": 0,
    "vue/no-v-html": 0,
    "vue/v-on-event-hyphenation": 0,
    "vue/multi-word-component-names": 0,
  },
  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        jest: true,
      },
    },
  ],
}
