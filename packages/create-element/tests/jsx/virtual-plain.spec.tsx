/** @jsxImportSource @lilian1315/create-element/virtual */

import { dispose } from '@lilian1315/create-element'
import { build } from '@lilian1315/create-element/virtual/dom'
import { expect, it, vi } from 'vite-plus/test'

it('builds DOM from deferred JSX and forwards component props', () => {
  let calls = 0
  const Label = ({ label }: { label: string }) => {
    calls++
    return <span>{label}</span>
  }
  const tree = (
    <div>
      <Label label="Save" />
    </div>
  )
  expect(calls).toBe(0)
  const element = build<'div'>(tree)
  expect(element).toBeInstanceOf(HTMLDivElement)
  expect(element.textContent).toBe('Save')
  expect(calls).toBe(1)
  dispose(element)
})

it('builds nested JSX fragments and cleans refs and listeners on disposal', () => {
  const release = vi.fn()
  const onclick = vi.fn()
  const element = build<'div'>(
    <div>
      <>
        <span>A</span>
        <button onclick={onclick} ref={() => release}>
          B
        </button>
      </>
    </div>,
  )
  expect(element.textContent).toBe('AB')
  const button = element.querySelector('button')!
  button.click()
  expect(onclick).toHaveBeenCalledOnce()
  dispose(element)
  button.click()
  expect(onclick).toHaveBeenCalledOnce()
  expect(release).toHaveBeenCalledOnce()
})
