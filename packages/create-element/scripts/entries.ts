/** The public entry inventory shared by the build and npm/JSR manifests. */
export const integrations = [
  'alien-deepsignals',
  'alien-signals',
  'faisceau',
  'preact-signals',
  'vue-reactivity',
] as const

export const entries = {
  index: 'src/index.ts',
  'dom/index': 'src/dom/index.ts',
  'server/index': 'src/server.ts',
  'jsx-runtime': 'src/jsx-runtime.ts',
}

const jsxRe = /\bjsx-runtime$/

export const publicExports = Object.fromEntries(
  (function* () {
    for (const integration of ['', ...integrations]) {
      for (const entry in entries) {
        const prefix = integration ? integration + '/' : ''
        const subpath = prefix + (entry === 'index' ? '' : entry.replace(/\/index$/, ''))
        const key = subpath ? './' + subpath.replace(/\/$/, '') : '.'
        const value = './dist/' + prefix + entry + '.js'
        yield [key, value]
        if (key.match(jsxRe)) yield [key.replace(jsxRe, 'jsx-dev-runtime'), value]
      }
    }
  })(),
)
