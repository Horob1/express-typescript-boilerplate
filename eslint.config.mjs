import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import jest from 'eslint-plugin-jest'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig([
  {
    ignores: ['dist/'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    files: ['**/*.{test,spec}.{js,mjs,cjs,ts}'],
    plugins: { jest },
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
    },
  },
  eslintPluginPrettierRecommended,
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          printWidth: 300,
          tabWidth: 2,
          singleQuote: true,
          trailingComma: 'es5',
          semi: false,
          arrowParens: 'avoid',
          endOfLine: 'auto',
        },
      ],
      'no-explicit-any': 'off',
      'no-useless-catch': 'off',
      'no-console': 'warn',
      'no-extra-boolean-cast': 'off',
      'no-lonely-if': 'warn',
      'no-unused-vars': 'warn',
      'no-trailing-spaces': 'off',
      'no-multi-spaces': 'warn',
      'no-multiple-empty-lines': 'warn',
      'space-before-blocks': ['error', 'always'],
      'object-curly-spacing': ['warn', 'always'],
      indent: ['warn', 2], // Indentation set to 2 spaces
      semi: ['warn', 'never'], // No semicolons
      quotes: ['error', 'single'], // Enforce single quotes
      'array-bracket-spacing': 'warn',
      'linebreak-style': 'off',
      'no-unexpected-multiline': 'warn',
      'keyword-spacing': 'warn',
      'comma-dangle': 'off',
      'comma-spacing': 'warn',
      'arrow-spacing': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])
