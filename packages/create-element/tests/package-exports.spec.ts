import { describe, expect, it } from 'vite-plus/test'

const packageName = '@lilian1315/create-element'
const adapters = [
  'alien-deepsignals',
  'alien-signals',
  'faisceau',
  'preact-signals',
  'vue-reactivity',
]

function jsxRuntimeEntries(entry: string, includeAsDom = false): Array<[string, string[]]> {
  const expected = ['Fragment', 'jsx', 'jsxDEV', 'jsxs']
  if (includeAsDom) expected.push('asDom')
  return [
    [`${entry}/jsx-runtime`, expected],
    [`${entry}/jsx-dev-runtime`, expected],
  ]
}

const exportCases: Array<[string, string[]]> = [
  [packageName, ['asDom', 'createElement', 'h']],
  ...jsxRuntimeEntries(packageName, true),
  [`${packageName}/virtual`, ['createElementFromVNode', 'createVNode', 'h', 'mount']],
  ...jsxRuntimeEntries(`${packageName}/virtual`),
  [`${packageName}/server`, ['renderToString']],
  ...adapters.flatMap((adapter): Array<[string, string[]]> => [
    [`${packageName}/${adapter}`, ['createElement', 'h']],
    ...jsxRuntimeEntries(`${packageName}/${adapter}`, true),
    [`${packageName}/${adapter}/virtual`, ['createElementFromVNode', 'createVNode', 'h', 'mount']],
    ...jsxRuntimeEntries(`${packageName}/${adapter}/virtual`),
    [`${packageName}/${adapter}/server`, ['renderToString']],
  ]),
]

describe('built package exports (no DOM implementation)', () => {
  it('built server entry renders without a DOM implementation', async () => {
    expect(globalThis.document).toBeUndefined()

    const { h } = await import(`${packageName}/virtual`)
    const { renderToString } = await import(`${packageName}/server`)

    expect(renderToString(h('main', { class: 'page' }, h('h1', null, 'Rendered in Node')))).toBe(
      '<main class="page"><h1>Rendered in Node</h1></main>',
    )
  })

  it('built reactive server entry renders a snapshot without a DOM implementation', async () => {
    const { shallowRef } = await import('@vue/reactivity')
    const { h } = await import(`${packageName}/vue-reactivity/virtual`)
    const { renderToString } = await import(`${packageName}/vue-reactivity/server`)
    const count = shallowRef(1)
    const tree = h('p', null, 'Count: ', count)

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
