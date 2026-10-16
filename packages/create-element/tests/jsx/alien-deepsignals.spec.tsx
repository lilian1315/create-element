/** @jsxImportSource @lilian1315/create-element/alien-deepsignals */

import { dispose } from '@lilian1315/create-element/alien-deepsignals'
import { createVNode } from '@lilian1315/create-element/alien-deepsignals/virtual'
import { build } from '@lilian1315/create-element/alien-deepsignals/virtual/dom'
import { signal } from 'alien-deepsignals'
import { assert, expect, it, vi } from 'vite-plus/test'

it('keeps mixed DOM and virtual children reactive with single cleanup', () => {
  const count = signal(1)
  const release = vi.fn()
  const child = <button ref={() => release}>{count}</button>
  const parent = <main>{createVNode('section', { children: [child, count] })}</main>
  const outer = build(createVNode('div', { children: parent }))
  expect(outer.firstChild?.firstChild?.firstChild).toBe(child)
  count.set(2)
  expect(outer.textContent).toBe('22')
  dispose(outer)
  dispose(outer)
  count.set(3)
  expect(outer.textContent).toBe('22')
  expect(release).toHaveBeenCalledOnce()
})

it('executes components immediately and updates native props and children', () => {
  const title = signal('save')
  const count = signal(1)
  let calls = 0
  const Counter = ({ label }: { label: string }) => {
    calls++
    return (
      <button title={title}>
        {label}: {count}
      </button>
    )
  }
  const button = <Counter label="Count" />
  assert.instanceOf(button, HTMLButtonElement)
  expect(button).toBeInstanceOf(HTMLButtonElement)
  expect(calls).toBe(1)
  expect(button.title).toBe('save')
  expect(button.textContent).toBe('Count: 1')
  title.set('updated')
  count.set(2)
  expect(button.title).toBe('updated')
  expect(button.textContent).toBe('Count: 2')
  expect(calls).toBe(1)
  dispose(button)
  count.set(3)
  title.set('disposed')
  expect(button.textContent).toBe('Count: 2')
  expect(button.title).toBe('updated')
})

it('keeps reactive fragment ranges alive after insertion and cleans them on disposal', () => {
  const count = signal(1)
  const release = vi.fn()
  const fragment = (
    <>
      <span ref={() => release}>A</span>
      <>{count}</>
    </>
  )
  const parent = <div>{fragment}</div>
  expect(fragment).toBeInstanceOf(DocumentFragment)
  expect(parent.textContent).toBe('A1')
  count.set(2)
  expect(parent.textContent).toBe('A2')
  dispose(parent)
  count.set(3)
  expect(parent.textContent).toBe('A2')
  expect(release).toHaveBeenCalledOnce()
  const detached = <>{count}</>
  dispose(detached)
  count.set(4)
  expect(detached.textContent).toBe('3')
})

it('replaces consumed document fragments without retaining stale children', () => {
  const content = signal(
    <>
      <span>A</span>
    </>,
  )
  const parent = <div>{content}</div>
  expect(parent.textContent).toBe('A')
  content.set(
    <>
      <span>B</span>
      <span>C</span>
    </>,
  )
  expect(parent.textContent).toBe('BC')
  dispose(parent)
})
