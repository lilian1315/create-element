import { defineConfig } from 'vite-plus'

const ignorePatterns = ['**/generated/**']

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
    'pnpm-workspace.yaml': 'vpr generate-deno-config',
  },
  lint: {
    ignorePatterns,
    jsPlugins: ['./packages/oxlint-plugin/src/index.ts'],
    rules: {
      'create-element/valid-jsx-element-type-assertion': 'error',
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    ignorePatterns,
    semi: false,
    singleQuote: true,
    sortImports: true,
  },
})
