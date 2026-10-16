import { defineConfig } from 'vite-plus'
import type { PackUserConfig } from 'vite-plus/pack'
import { playwright } from 'vite-plus/test/browser-playwright'
import { replacePlugin } from 'vite/rolldown/plugins'

import { entries, integrations } from './scripts/entries'
import { specializeReactivity } from './scripts/specialize-reactivity'

export default defineConfig({
  pack: [undefined, ...integrations].map((integration): PackUserConfig => ({
    entry: entries,
    outDir: integration ? `dist/${integration}` : 'dist',
    target: 'es6',
    platform: 'browser',
    dts: true,
    plugins: [
      // Fold before chunk splitting so plain entries retain no reactive primitives.
      replacePlugin(
        { 'reactivity.REACTIVE_ENABLED': typeof integration === 'string' ? 'true' : 'false' },
        { preventAssignment: true, sourcemap: true },
      ),
      specializeReactivity(integration),
    ],
  })),
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text'],
    },

    projects: [
      {
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
          typecheck: {
            enabled: true,
          },
        },
      },
    ],
  },
  run: {
    tasks: {
      build: {
        command: 'vp pack',
        dependsOn: ['generate-exports', { task: 'build', from: 'dependencies' }],
      },
      dev: {
        command: 'vp pack -w',
        dependsOn: ['generate-exports'],
      },
      coverage: {
        command: 'vp test run --project browser --coverage',
        dependsOn: ['build'],
      },
      test: {
        command: 'vp test run',
        dependsOn: ['build'],
      },
      'generate-exports': 'node scripts/generate-exports.ts',
    },
  },
})
