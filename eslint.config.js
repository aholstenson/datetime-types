import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [ 'dist', 'coverage' ]
	},

	js.configs.recommended,
	tseslint.configs.recommended,

	{
		rules: {
			// Intentionally allowed for loosely typed inputs.
			'@typescript-eslint/no-explicit-any': 'off',

			'prefer-const': 'warn',
			'no-console': 'error',
			'no-var': 'error',
			eqeqeq: [ 'error', 'always', { null: 'ignore' } ],
			quotes: [ 'error', 'single', { avoidEscape: true } ],
			semi: [ 'error', 'always' ],
			radix: 'error',
			'no-shadow': 'error'
		}
	}
);
