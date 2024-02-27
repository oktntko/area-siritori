/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json', 'tsconfig.node.json'],
  },
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    eqeqeq: 'warn',
    'no-warning-comments': 'warn',
    'object-shorthand': 'warn',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/prefer-ts-expect-error': 'warn',
    'dot-notation': 'off',
    '@typescript-eslint/dot-notation': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
