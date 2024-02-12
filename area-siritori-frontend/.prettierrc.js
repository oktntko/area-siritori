/** @type {import("prettier").Config} */
export default {
  endOfLine: 'lf',
  semi: true,
  tabWidth: 2,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'all',
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
};
