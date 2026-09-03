import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  plugins: nitro(),
  oxc: {
    jsx: {
      throwIfNamespace: false,
    },
  },
})
