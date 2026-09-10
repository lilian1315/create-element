import { defineConfig } from 'vite-plus'

export default defineConfig({
  oxc: {
    jsx: {
      throwIfNamespace: false,
    },
  },
  lint: {
    jsPlugins: ['@lilian1315/oxlint-plugin-create-element'],
    rules: {
      'create-element/valid-jsx-element-type-assertion': 'error',
    },
  },
})
