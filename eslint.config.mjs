import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat';

export default defineConfig([
  expoConfig,
  {
    ignores: ['node_modules/', '.expo/', 'dist/', 'build/'],
  },
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]);
