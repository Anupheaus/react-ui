// @ts-check
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'storybook-static/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
    ],
    plugins: {
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      // Severities aligned with the team standard (legacy .eslintrc.js + ci-templates/eslint/react):
      // these patterns (createComponent factories, namespace models, Function types) are intentional,
      // and rules-of-hooks is noisy against them — kept as warn/off rather than blocking CI.
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      // Team standard: only flag when the whole destructure can be const (avoids
      // false positives where one binding is reassigned and another is not).
      'prefer-const': ['error', { destructuring: 'all' }],
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-children-prop': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
);
