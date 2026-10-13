/** @jsxImportSource @lilian1315/create-element/preact-signals */

import { build } from '@lilian1315/create-element/preact-signals/dom'
import { dispose, mount } from '@lilian1315/create-element/preact-signals/dom'
import { Fragment } from '@lilian1315/create-element/preact-signals/jsx-runtime'
import { signal } from '@preact/signals-core'
import { expect, it } from 'vite-plus/test'

it('defers JSX component work and preserves native signal children', () => {
  const count = signal(1)
  let calls = 0
  const Counter = () => {
    calls++
    return <button>Count: {count}</button>
  }
  const tree = <Counter />
  expect(calls).toBe(0)
  const button = build<'button'>(tree)
  expect(calls).toBe(1)
  expect(button.textContent).toBe('Count: 1')
  count.value = 2
  expect(button.textContent).toBe('Count: 2')
  dispose(button)
})

it('mounts a JSX Fragment and builds it as a document fragment', () => {
  const tree = (
    <>
      <span>A</span>
      <span>B</span>
    </>
  )
  const target = document.createElement('main')
  const stop = mount(target, tree)
  expect(target.textContent).toBe('AB')
  stop()
  expect(target.textContent).toBe('')
  expect(build(tree)).toBeInstanceOf(DocumentFragment)
  expect(Fragment).toBeTypeOf('function')
})
