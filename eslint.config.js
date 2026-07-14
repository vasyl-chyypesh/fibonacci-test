import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import security from 'eslint-plugin-security';
import eslintNodeTest from 'eslint-node-test';

export default defineConfig([{
  files: ['**/*.{js,ts}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
    security.configs.recommended,
    eslintNodeTest.configs.recommended,
  ],
  ignores: ['**/dist', '**/node_modules'],
  rules: {
    'no-console': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-definitions': 'off',
  },
}, {
  files: ['**/*.test.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'node-test/prefer-context-mock': 'off',
  },
}]);
