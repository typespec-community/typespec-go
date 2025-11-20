/** @type {import('eslint').Linter.Config} */
import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['**/dist/**/*', '**/.temp/**/*', '**/node_modules/**/*'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': plugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn', // Downgrade to warn for Phase 1
      '@typescript-eslint/no-explicit-any': 'warn', // Downgrade to warn for Phase 1
    },
  },
];
