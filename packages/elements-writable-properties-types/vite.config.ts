import { defineConfig } from 'vite-plus'

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
      only: true,
    },
  },
  run: {
    tasks: {
      build: 'node scripts/generate.ts',
      test: {
        command: 'vp test run',
        dependsOn: ['build'],
      },
    },
  },
})
