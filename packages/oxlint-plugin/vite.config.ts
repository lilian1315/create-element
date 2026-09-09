import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    entry: ['src/index.ts'],
    target: 'es2022',
    platform: 'node',
    exports: true,
    dts: true,
    unbundle: true,
  },
})
