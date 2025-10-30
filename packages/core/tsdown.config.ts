import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: ['src/index.ts', 'src/alien-deepsignals/index.ts'],
    target: 'es6',
    platform: 'browser',
    exports: true,
    external: ['alien-deepsignals', 'alien-signals'],
})
