module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint','import'],
  extends: ['eslint:recommended','plugin:@typescript-eslint/recommended'],
  env: { node: true, es2022: true },
  ignorePatterns: ['dist','node_modules'],
  rules: {
    'import/order': ['warn',{ 'newlines-between':'always','groups':['builtin','external','internal','parent','sibling','index'] }],
    '@typescript-eslint/no-unused-vars': ['warn',{ argsIgnorePattern:'^_', varsIgnorePattern:'^_' }]
  }
};
