import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    ignores: ['dist/**', 'coverage/**'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      'no-console': 'off',
      'no-debugger': 'error',
      'prefer-const': 'warn',
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
];
