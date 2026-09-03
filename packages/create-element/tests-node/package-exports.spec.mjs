import assert from 'node:assert/strict'
import { test } from 'node:test'

const packageName = '@lilian1315/create-element'
const adapters = [
  'alien-deepsignals',
  'alien-signals',
  'faisceau',
  'preact-signals',
  'vue-reactivity',
]

void test('built server entry renders without a DOM implementation', async () => {
  assert.equal(globalThis.document, undefined)

  const { h } = await import(`${packageName}/virtual`)
  const { renderToString } = await import(`${packageName}/server`)

  assert.equal(
    renderToString(h('main', { class: 'page' }, h('h1', null, 'Rendered in Node'))),
    '<main class="page"><h1>Rendered in Node</h1></main>',
  )
})

void test('built reactive server entry renders a snapshot without a DOM implementation', async () => {
  const { shallowRef } = await import('@vue/reactivity')
  const { h } = await import(`${packageName}/vue-reactivity/virtual`)
  const { renderToString } = await import(`${packageName}/vue-reactivity/server`)
  const count = shallowRef(1)
  const tree = h('p', null, 'Count: ', count)

  assert.equal(renderToString(tree), '<p>Count: 1</p>')
  count.value = 2
  assert.equal(renderToString(tree), '<p>Count: 2</p>')
})

void test('built public entries expose only their intended runtime APIs', async (context) => {
  await assertExports(context, packageName, ['createElement', 'h'])
  await assertJsxRuntimeExports(context, packageName)
  await assertExports(context, `${packageName}/virtual`, [
    'createElementFromVNode',
    'createVNode',
    'h',
    'mount',
  ])
  await assertJsxRuntimeExports(context, `${packageName}/virtual`)
  await assertExports(context, `${packageName}/server`, ['renderToString'])

  for (const adapter of adapters) {
    await assertExports(context, `${packageName}/${adapter}`, ['createElement', 'h'])
    await assertJsxRuntimeExports(context, `${packageName}/${adapter}`)
    await assertExports(context, `${packageName}/${adapter}/virtual`, [
      'createElementFromVNode',
      'createVNode',
      'h',
      'mount',
    ])
    await assertJsxRuntimeExports(context, `${packageName}/${adapter}/virtual`)
    await assertExports(context, `${packageName}/${adapter}/server`, ['renderToString'])
  }
})

async function assertJsxRuntimeExports(context, entry) {
  const expected = ['Fragment', 'jsx', 'jsxDEV', 'jsxs']
  await assertExports(context, `${entry}/jsx-runtime`, expected)
  await assertExports(context, `${entry}/jsx-dev-runtime`, expected)
}

async function assertExports(context, entry, expected) {
  await context.test(entry, async () => {
    const exports = await import(entry)
    assert.deepEqual(Object.keys(exports).sort(), expected.sort())
  })
}
