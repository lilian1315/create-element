import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['**/generated/**'],
  typescript: true,
  rules: {
    'antfu/if-newline': 'off',
    'nonblock-statement-body-position': 'error',
  },
  stylistic: {
    overrides: {
      'style/brace-style': ['error', '1tbs'],
      'style/arrow-parens': ['error', 'always'],
      'style/indent': ['error', 2, { flatTernaryExpressions: true }],
      'style/operator-linebreak': ['error', 'after', { overrides: { '|': 'before', '||': 'before' } }],
      'style/jsx-one-expression-per-line': ['error', { allow: 'single-line' }],
    },
  },
})
