module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "no-unused-vars": ["off", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
        "no-undef": "off"
    }
}
