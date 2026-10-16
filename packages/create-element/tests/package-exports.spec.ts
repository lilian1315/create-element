/// <reference types="node" />

import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vite-plus/test'

import { integrations, publicExports } from '../scripts/entries'

const packageName = '@lilian1315/create-element'
const reactivePackages = new Set([
  'alien-deepsignals',
  'alien-signals',
  'faisceau',
  '@preact/signals-core',
  '@vue/reactivity',
])
const packageForAdapter: Record<string, string> = {
  'alien-deepsignals': 'alien-deepsignals',
  'alien-signals': 'alien-signals',
  faisceau: 'faisceau',
  'preact-signals': '@preact/signals-core',
  'vue-reactivity': '@vue/reactivity',
}
const dist = fileURLToPath(new URL('../dist/', import.meta.url))

async function dependencies(
  entry: string,
  declarations = false,
  visited = new Set<string>(),
): Promise<Set<string>> {
  const file = resolve(dist, entry)
  if (visited.has(file)) return new Set()
  visited.add(file)
  const source = await readFile(file, 'utf8')
  const packages = new Set<string>()
  for (const match of source.matchAll(/\b(?:from\s*|import\s*(?:\(\s*)?)["']([^"']+)["']/g)) {
    const specifier = match[1]
    if (specifier.startsWith('.')) {
      const dependencyPath = resolve(
        dirname(file),
        declarations ? specifier.replace(/\.js$/, '.d.ts') : specifier,
      )
      for (const dependency of await dependencies(dependencyPath, declarations, visited)) {
        packages.add(dependency)
      }
    } else if (reactivePackages.has(specifier)) {
      packages.add(specifier)
    }
  }
  return packages
}

const exportCases: Array<[string, string[]]> = [
  [packageName, ['createVNode']],
  [`${packageName}/dom`, ['bind', 'build', 'createElement', 'dispose', 'mount']],
  [`${packageName}/jsx-runtime`, ['Fragment', 'jsx', 'jsxDEV', 'jsxs']],
  [`${packageName}/server`, ['renderToString']],
  ...integrations.flatMap((adapter): Array<[string, string[]]> => [
    [`${packageName}/${adapter}`, ['createVNode']],
    [`${packageName}/${adapter}/dom`, ['bind', 'build', 'createElement', 'dispose', 'mount']],
    [`${packageName}/${adapter}/jsx-runtime`, ['Fragment', 'jsx', 'jsxDEV', 'jsxs']],
    [`${packageName}/${adapter}/server`, ['renderToString']],
  ]),
]

describe('built package exports (no DOM implementation)', () => {
  it.each(['', ...integrations])(
    '%s shares the VNode brand across built entries',
    { timeout: 10_000 },
    async (adapter) => {
      const entry = adapter ? `${packageName}/${adapter}` : packageName
      const { createVNode } = await import(entry)
      const { jsx, jsxDEV } = await import(`${entry}/jsx-runtime`)
      const { renderToString } = await import(`${entry}/server`)

      expect(
        renderToString(createVNode('main', { children: jsx('span', { children: 'jsx' }) })),
      ).toBe('<main><span>jsx</span></main>')
      expect(
        renderToString(jsxDEV('main', { children: createVNode('span', { children: 'h' }) })),
      ).toBe('<main><span>h</span></main>')
    },
  )

  it.each(['index', 'dom/index', 'server/index'])(
    '%s removes reactive primitives from the plain build',
    async (entry) => {
      const files = new Set<string>()
      await dependencies(`${entry}.js`, false, files)
      const source = (await Promise.all([...files].map((file) => readFile(file, 'utf8')))).join(
        '\n',
      )

      expect(source).not.toContain('src/reactivity-ops/')
      expect(source).not.toContain('No reactive source is configured')
      expect(source).not.toContain('function track(')
    },
  )

  it.each(['', ...integrations])(
    '%s isolates native dependencies in runtime and declarations',
    async (adapter) => {
      const nativePackage = adapter ? [packageForAdapter[adapter]] : []
      for (const entry of ['index', 'dom/index', 'server/index', 'jsx-runtime']) {
        const prefix = adapter ? `${adapter}/` : ''
        expect([...(await dependencies(`${prefix}${entry}.js`))]).toEqual(
          entry === 'index' || entry.startsWith('jsx-') ? [] : nativePackage,
        )
        expect([...(await dependencies(`${prefix}${entry}.d.ts`, true))]).toEqual(nativePackage)
      }
    },
  )

  it('publishes the entry inventory with matching declarations', async () => {
    const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
    const { './package.json': _packageJson, ...entries } = manifest.exports
    expect(entries).toEqual(publicExports)

    for (const entry of Object.values(entries) as string[]) {
      const file = fileURLToPath(new URL(`../${entry}`, import.meta.url))
      expect(await readFile(file, 'utf8')).toContain('export')
      expect(await readFile(file.replace(/\.js$/, '.d.ts'), 'utf8')).toContain('export')
    }
  })
  it('built server entry renders without a DOM implementation', async () => {
    expect(globalThis.document).toBeUndefined()

    const { createVNode } = await import(packageName)
    const { renderToString } = await import(`${packageName}/server`)

    expect(
      renderToString(
        createVNode('main', {
          class: 'page',
          children: createVNode('h1', { children: 'Rendered in Node' }),
        }),
      ),
    ).toBe('<main class="page"><h1>Rendered in Node</h1></main>')
  })

  it('built reactive server entry renders a snapshot without a DOM implementation', async () => {
    const { shallowRef } = await import('@vue/reactivity')
    const { createVNode } = await import(`${packageName}/vue-reactivity`)
    const { renderToString } = await import(`${packageName}/vue-reactivity/server`)
    const count = shallowRef(1)
    const tree = createVNode('p', { children: ['Count: ', count] })

    expect(renderToString(tree)).toBe('<p>Count: 1</p>')
    count.value = 2
    expect(renderToString(tree)).toBe('<p>Count: 2</p>')
  })

  describe('built public entries expose only their intended runtime APIs', () => {
    for (const [entry, expected] of exportCases) {
      it(entry, async () => {
        const exports = await import(entry)
        expect(Object.keys(exports).sort()).toEqual([...expected].sort())
      })
    }
  })
})
