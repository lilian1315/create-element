/** @jsxImportSource ../src/vue-reactivity/virtual */

import { shallowRef } from '@vue/reactivity'
import { expect, it } from 'vite-plus/test'

import { isVNode } from '../src/virtual/vnode'
import { renderToString } from '../src/vue-reactivity/server/index'

it('renders reactive vue-reactivity VNodes from the automatic JSX transform', () => {
  const count = shallowRef(1)

  function Counter({ value }: { value: typeof count }) {
    return <button class={{ active: true }}>count is: {value}</button>
  }

  const tree = <Counter value={count} />

  expect(isVNode(tree)).toBe(true)
  expect(renderToString(tree)).toBe('<button class="active">count is: 1</button>')

  count.value = 2
  expect(renderToString(tree)).toBe('<button class="active">count is: 2</button>')
})
