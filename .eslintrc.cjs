module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended",
    "plugin:cypress/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:prettier-vue/recommended",
    "prettier",
    "@vue/typescript",
    "plugin:import/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["prettier", "vue", "@typescript-eslint"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        selector: ["interface", "enum", "enumMember"],
        format: ["PascalCase"],
      },
    ],
    "@typescript-eslint/no-duplicate-enum-values": "warn",
    "import/named": "off",
    "import/no-unresolved": "off",
    "no-irregular-whitespace": 0,
    "vue/multi-word-component-names": "off",
    "vue/no-v-html": "off",
    "vue/require-default-prop": "off",
  },
  ignorePatterns: [
    "contribuer",
    "dist",
    "dist-server",
    "IndividuForm.vue",
    "*.min.js",
    "node_modules",
    "test/integration",
    ".tmp",
    "tmp",
  ],

  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        jest: true,
      },
    },
  ],
}
