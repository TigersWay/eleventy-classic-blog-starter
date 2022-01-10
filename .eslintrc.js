module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020
  },
  rules: {
    indent: ['error', 2, {
      "SwitchCase": 1
    }],
    semi: ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'no-console': 'off',
  }
};
