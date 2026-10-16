/** @jsxImportSource @lilian1315/create-element */

import { bind, dispose, type Child, type Component } from '@lilian1315/create-element'
import { createVNode } from '@lilian1315/create-element/virtual'
import { build } from '@lilian1315/create-element/virtual/dom'
import { assert, expect, it, vi } from 'vite-plus/test'

it('mixes DOM and virtual children without losing identity or cleanup', () => {
  const release = vi.fn()
  const child = <button ref={() => release}>Save</button>
  const tree = createVNode('section', { children: child })
  const parent = <main>{tree}</main>
  expect(parent.firstChild?.firstChild).toBe(child)
  const outer = build(createVNode('div', { children: parent }))
  expect(outer.firstChild).toBe(parent)
  dispose(outer)
  dispose(outer)
  expect(release).toHaveBeenCalledOnce()
})

it('creates initialized DOM immediately and disposes refs and events once', () => {
  const onclick = vi.fn()
  const release = vi.fn()
  const ref = vi.fn((button: HTMLButtonElement) => {
    expect(button.textContent).toBe('Save 1')
    return release
  })
  const button = (
    <button class="primary" onclick={onclick} ref={ref}>
      Save {1}
    </button>
  )
  assert.instanceOf(button, HTMLButtonElement)
  expect(button).toBeInstanceOf(HTMLButtonElement)
  expect(button.className).toBe('primary')
  expect(ref).toHaveBeenCalledExactlyOnceWith(button)
  expect(() => bind(button, {})).toThrow('active binding')
  button.click()
  expect(onclick).toHaveBeenCalledOnce()
  dispose(button)
  dispose(button)
  button.click()
  expect(onclick).toHaveBeenCalledOnce()
  expect(release).toHaveBeenCalledOnce()
})

it('calls components once with their props and JSX children', () => {
  const child = <span>child</span>
  let calls = 0
  const Label: Component<{ label: string; children: Child }> = ({ label, children }) => {
    calls++
    return <button title={label}>{children}</button>
  }
  const button = <Label label="Save">{child}</Label>
  assert.instanceOf(button, HTMLButtonElement)
  expect(calls).toBe(1)
  expect(button.title).toBe('Save')
  expect(button.firstChild).toBe(child)
  dispose(button)
})

it('consumes nested fragments without losing nodes or cleanup', () => {
  const release = vi.fn()
  const child = <span ref={() => release}>A</span>
  const fragment = (
    <>
      <>
        {child}
        {null}
      </>
      {['B', 2]}
    </>
  )
  expect(fragment).toBeInstanceOf(DocumentFragment)
  const parent = <div>{fragment}C</div>
  assert.instanceOf(parent, HTMLDivElement)
  expect(parent.textContent).toBe('AB2C')
  expect(parent.firstElementChild).toBe(child)
  expect(fragment.childNodes).toHaveLength(0)
  expect(release).not.toHaveBeenCalled()
  dispose(parent)
  expect(release).toHaveBeenCalledOnce()
})

it('supports empty fragments and text or empty component results', () => {
  const Text: Component = () => 'hello'
  const Empty: Component = () => null
  const parent = (
    <div>
      <></>
      <Text />
      <Empty />
    </div>
  )
  expect(parent.textContent).toBe('hello')
  dispose(parent)
})

it('creates SVG and MathML nodes in the correct namespaces', () => {
  const svg = (
    <svg>
      <svg:circle />
    </svg>
  )
  assert.instanceOf(svg, SVGSVGElement)
  const math = (
    <math>
      <math:mi>x</math:mi>
    </math>
  )
  assert.instanceOf(math, MathMLElement)
  expect(svg.firstElementChild).toBeInstanceOf(SVGCircleElement)
  expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg')
  expect(math.firstElementChild?.namespaceURI).toBe('http://www.w3.org/1998/Math/MathML')
  dispose(svg)
  dispose(math)
})

it('propagates component errors', () => {
  const error = new Error('component failed')
  const Broken = (): never => {
    throw error
  }
  expect(() => <Broken />).toThrow(error)
})
