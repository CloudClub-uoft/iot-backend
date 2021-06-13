module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
    'consistent-return': 'off',
    'object-curly-newline': ['error', {
      ObjectPattern: 'off',
    }],
  },
};
