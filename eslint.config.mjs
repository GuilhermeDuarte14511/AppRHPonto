import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const sourceFiles = ['**/*.{js,jsx,ts,tsx,mjs,cjs}'];
const tsSourceFiles = ['**/*.{ts,tsx,mts,cts}'];
const reactFiles = ['**/*.{jsx,tsx}'];
const adminFiles = ['apps/admin-web/**/*.{js,jsx,ts,tsx}'];
const mobileFiles = ['apps/employee-app/**/*.{js,jsx,ts,tsx}', 'apps/kiosk-app/**/*.{js,jsx,ts,tsx}'];
const { plugins: jsxA11yPlugins, ...jsxA11yRecommendedConfig } = jsxA11y.flatConfigs.recommended;

export default [
  {
    ignores: [
      '.next/**',
      '.expo/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.turbo/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.expo/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/generated/**',
    ],
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  js.configs.recommended,
  {
    files: sourceFiles,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-duplicate-imports': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      'unused-imports/no-unused-imports': 'error',
    },
  },
  {
    files: tsSourceFiles,
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ),
  ...compat.extends('next/core-web-vitals').map((config) => ({
    ...config,
    files: adminFiles,
    settings: {
      ...config.settings,
      next: {
        rootDir: 'apps/admin-web/',
      },
    },
    rules: {
      ...config.rules,
      '@next/next/no-html-link-for-pages': 'off',
    },
  })),
  {
    ...jsxA11yRecommendedConfig,
    files: ['apps/admin-web/**/*.{tsx,jsx}', 'packages/ui/**/*.{tsx,jsx}'],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      ...jsxA11yRecommendedConfig.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['apps/admin-web/**/*.{ts,tsx}', 'packages/ui/**/*.{ts,tsx}'],
    rules: {
      'jsx-a11y/anchor-is-valid': 'off',
    },
  },
  ...compat.extends('expo').map((config) => ({
    ...config,
    files: mobileFiles,
  })),
  {
    files: reactFiles,
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@rh-ponto/*/src/*'],
              message: 'Importe pelos entrypoints públicos dos packages para manter os boundaries estáveis.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['apps/*/babel.config.js', 'apps/*/metro.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
