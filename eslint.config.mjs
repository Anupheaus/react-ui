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
      // The codebase intentionally uses the bare `Function` type in low-level generic utilities and test casts.
      '@typescript-eslint/no-unsafe-function-type': 'off',
      // Namespaces are used here for module/type augmentation, which is a legitimate use.
      '@typescript-eslint/no-namespace': 'off',
      'react/prop-types': 'off',
      // Components are created through the `createComponent` factory, which assigns the display name dynamically,
      // so this rule only produces false positives in this codebase.
      'react/display-name': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-children-prop': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
);
