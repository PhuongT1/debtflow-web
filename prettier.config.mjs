export default {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  overrides: [
    {
      // Preserve blank lines between npm script groups.
      files: './package.json',
      options: {
        parser: 'json',
      },
    },
    {
      files: '*.html',
      options: {
        parser: 'angular',
      },
    },
  ],
};
