module.exports = {
  env: {
    es2021: true,
    node: true,
    mocha: true,
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
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['*_test.js', '*_spec.js'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
};
