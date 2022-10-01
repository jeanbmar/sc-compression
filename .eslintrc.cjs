module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'import/extensions': ['error', 'ignorePackages', {}],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/scripts/*.mjs', '**/dotenv.mjs', '**/*.test.mjs'],
      },
    ],
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    'no-await-in-loop': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-underscore-dangle': 'off',
    'prettier/prettier': 'error',
  },
};
