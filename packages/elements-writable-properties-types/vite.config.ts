import { defineConfig } from 'vite-plus'

export default defineConfig({
  run: {
    tasks: {
      build: 'node scripts/generate.ts',
    },
  },
})
