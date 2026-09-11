import { defineConfig } from 'vite-plus'
import { playwright } from 'vite-plus/test/browser-playwright'

export default defineConfig({
  pack: {
    deps: { resolveDepSubpath: true },
    entry: ['src/**/index.ts', 'src/**/jsx-runtime.ts', 'src/**/jsx-dev-runtime.ts'],
    target: 'es6',
    platform: 'browser',
    exports: true,
    dts: true,
    unbundle: true,
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text'],
    },

    projects: [
      {
        oxc: {
          jsx: {
            throwIfNamespace: false,
          },
        },
        test: {
          name: 'browser',
          exclude: ['tests/package-exports.spec.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium', headless: true }],
          },
          typecheck: {
            enabled: true,
          },
        },
      },
      {
        test: {
          name: 'exports',
          include: ['tests/package-exports.spec.ts'],
        },
      },
    ],
  },
  run: {
    tasks: {
      '_test:exports': {
        command: 'vp test run --project exports',
        dependsOn: ['build'],
      },
    },
  },
})
