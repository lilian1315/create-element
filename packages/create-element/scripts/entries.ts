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
  'dom/index': 'src/dom.ts',
  'server/index': 'src/server.ts',
  'jsx-runtime': 'src/jsx-runtime.ts',
  'jsx-dev-runtime': 'src/jsx-dev-runtime.ts',
} as const

export const publicExports = Object.fromEntries(
  ['', ...integrations].flatMap((integration) =>
    Object.keys(entries).map((entry) => {
      const prefix = integration ? integration + '/' : ''
      const subpath = prefix + (entry === 'index' ? '' : entry.replace(/\/index$/, ''))
      return [subpath ? './' + subpath.replace(/\/$/, '') : '.', './dist/' + prefix + entry + '.js']
    }),
  ),
)
