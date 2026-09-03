import { defineConfig } from 'vite-plus'

const ignorePatterns = ['**/generated/**', 'examples/**']

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
    'pnpm-workspace.yaml': 'vpr generate-deno-config',
  },
  lint: {
    ignorePatterns,
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
