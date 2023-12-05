module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  plugins: ['import'],
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
      2,
      {
        namedComponents: 'arrow-function',
      },
    ],
    'react/require-default-props': 0,
    'import/prefer-default-export': 'off',
    'react/jsx-sort-props': 1,
    'react/jsx-props-no-spreading': 'off',
  },
  ignorePatterns: ['node_modules/', 'dist/'],
};
