import { playwright } from 'vite-plus/test/browser-playwright'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    entry: ['src/**/index.ts', 'src/**/jsx-runtime.ts', 'src/**/jsx-dev-runtime.ts'],
    target: 'es6',
    platform: 'browser',
    exports: true,
    external: ['alien-deepsignals', 'alien-signals', '@preact/signals-core', 'faisceau'],
    dts: true,
    unbundle: true,
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium', headless: true }],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text'],
    },
    typecheck: {
      enabled: true,
    },
  },
})
