import { defineConfig } from 'vite-plus'

export default defineConfig({
  build: {
    rolldownOptions: {
      input: ['index.html', 'news.html'],
    },
  },
})
