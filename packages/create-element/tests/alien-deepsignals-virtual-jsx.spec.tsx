/** @jsxImportSource ../src/alien-deepsignals/virtual */

import { signal } from 'alien-deepsignals'
import { expect, it } from 'vitest'

import { renderToString } from '../src/alien-deepsignals/server/index'
import { isVNode } from '../src/virtual/vnode'

it('renders reactive alien-deepsignals VNodes from the automatic JSX transform', () => {
  const count = signal(1)

  function Counter({ value }: { value: typeof count }) {
    return <button class={{ active: true }}>count is: {value}</button>
  }

  const tree = <Counter value={count} />

  expect(isVNode(tree)).toBe(true)
  expect(renderToString(tree)).toBe('<button class="active">count is: 1</button>')

  count.set(2)
  expect(renderToString(tree)).toBe('<button class="active">count is: 2</button>')
})
