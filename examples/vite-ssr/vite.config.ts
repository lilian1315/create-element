import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  plugins: nitro(),
  lint: {
    jsPlugins: ['@lilian1315/oxlint-plugin-create-element'],
    rules: {
      'create-element/valid-jsx-element-type-assertion': 'error',
    },
  },
  oxc: {
    jsx: {
      throwIfNamespace: false,
    },
  },
})
