import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/jsx-runtime.ts',
        'src/jsx-dev-runtime.ts',
        'src/alien-deepsignals/index.ts',
        'src/alien-deepsignals/jsx-runtime.ts',
        'src/alien-deepsignals/jsx-dev-runtime.ts',
    ],
    target: 'es6',
    platform: 'browser',
    exports: true,
    external: ['alien-deepsignals', 'alien-signals'],
})
