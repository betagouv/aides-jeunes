module.exports = {
    "env": {
        "node": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential",
        "prettier",
        "plugin:cypress/recommended"
    ],
    "plugins": ["prettier"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",

    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
        "parser": "babel-eslint",
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "no-irregular-whitespace": 0
    }
};
