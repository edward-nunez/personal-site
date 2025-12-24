import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  },
  // Client (React) config
  {
    files: ['client/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules, // For React 17+ without JSX import
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  // Server (Express/Node) config
  {
    files: ['server/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    plugins: {
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-console': 'warn', // Example Node-specific rule; customize as needed
    },
  },
];
