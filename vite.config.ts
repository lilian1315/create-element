import { defineConfig } from 'vite-plus'

const ignorePatterns = ['**/generated/**']

export default defineConfig({
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
