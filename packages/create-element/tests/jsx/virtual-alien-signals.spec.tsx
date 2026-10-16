/** @jsxImportSource @lilian1315/create-element/alien-signals/virtual */

import { dispose } from '@lilian1315/create-element/alien-signals'
import { build, mount } from '@lilian1315/create-element/alien-signals/virtual/dom'
import { signal } from 'alien-signals'
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
  count(2)
  expect(fragment.textContent).toBe('Count: 2')
  dispose(fragment)
  count(3)
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

it('renders native signal props and children', () => {
  const title = signal('save')
  const button = build<'button'>(<button title={title}>{signal(1)}</button>)
  expect(button.title).toBe('save')
  expect(button.textContent).toBe('1')
  dispose(button)
})
