import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    entry: ['src/index.ts'],
    target: 'es2022',
    platform: 'node',
    exports: true,
    deps: {
      neverBundle: ['@lilian1315/elements-writable-properties-types', '@oxlint/plugins'],
    },
    dts: true,
    unbundle: true,
  },
})
