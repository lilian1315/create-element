import { defineConfig } from 'vite-plus'

export default defineConfig({
  oxc: {
    jsx: {
      throwIfNamespace: false,
    },
  },
})
