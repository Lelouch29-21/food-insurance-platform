import js from '@eslint/js';

export default [
  { ignores: ['node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
      },
    },
    rules: {
      'no-console': ['error', { allow: ['error', 'warn'] }],
    },
  },
  {
    files: ['src/__tests__/**/*.js'],
    rules: {
      'no-undef': 'off',
    },
  },
];
