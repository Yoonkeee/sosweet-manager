module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'import'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/no-extraneous-dependencies': 0,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'react/function-component-definition': [
      0,
      {
        namedComponents: 'arrow-function',
      },
    ],
    'react/require-default-props': 0,
    'import/prefer-default-export': 'off',
    'react/jsx-sort-props': 1,
    'react/jsx-props-no-spreading': 'off',
    'prettier/prettier': 0,
  },
  ignorePatterns: ['node_modules/', 'dist/'],
};
