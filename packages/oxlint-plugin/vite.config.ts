import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    entry: ['src/index.ts'],
    target: 'es2022',
    platform: 'node',
    exports: true,
    dts: true,
    minify: true,
  },
  run: {
    tasks: {
      build: {
        command: 'vp pack',
        dependsOn: [{ task: 'build', from: 'dependencies' }],
      },
      test: 'vp test run',
    },
  },
})
