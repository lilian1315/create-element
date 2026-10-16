/** @jsxImportSource @lilian1315/create-element/preact-signals/virtual */

import { dispose } from '@lilian1315/create-element/preact-signals'
import { build, mount } from '@lilian1315/create-element/preact-signals/virtual/dom'
import { computed, signal } from '@preact/signals-core'
import { expect, it } from 'vite-plus/test'

it('defers components and updates native signal children', () => {
  const count = signal(1)
  let calls = 0
  const Counter = () => {
    calls++
    return <button>Count: {count}</button>
  }
  const tree = <Counter />
  expect(calls).toBe(0)
  const fragment = build(tree)
  expect(calls).toBe(1)
  expect(fragment.textContent).toBe('Count: 1')
  count.value = 2
  expect(fragment.textContent).toBe('Count: 2')
  // Component build results are fragments; dispose their managed element.
  dispose(fragment)
  count.value = 3
  expect(fragment.textContent).toBe('Count: 2')
})

it('mounts fragments and builds them as document fragments', () => {
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
  const fragment = build(tree)
  expect(fragment).toBeInstanceOf(DocumentFragment)
  expect(fragment.textContent).toBe('AB')
  dispose(fragment)
})

it('renders native computed props and children', () => {
  const derived = computed(() => 'derived')
  const button = build<'button'>(<button title={derived}>{derived}</button>)
  expect(button.title).toBe('derived')
  expect(button.textContent).toBe('derived')
  dispose(button)
})
