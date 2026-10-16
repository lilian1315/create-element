import { createVNode } from '@lilian1315/create-element'
import { bind, createElement, dispose } from '@lilian1315/create-element/dom'
import { describe, expect, it, vi } from 'vite-plus/test'

import { fixtures } from './reactivity-fixtures'

describe.each([{ name: 'plain', createElement, bind, dispose, h: createVNode }, ...fixtures])(
  '$name createElement',
  ({ createElement, bind, dispose, h }) => {
    it('creates HTML elements with omitted or null props', () => {
      expect(createElement('button')).toBeInstanceOf(HTMLButtonElement)
      expect(createElement('input', null)).toBeInstanceOf(HTMLInputElement)
    })

    it.each([
      ['svg', 'http://www.w3.org/2000/svg', 'svg'],
      ['svg:circle', 'http://www.w3.org/2000/svg', 'circle'],
      ['math', 'http://www.w3.org/1998/Math/MathML', 'math'],
      ['math:mi', 'http://www.w3.org/1998/Math/MathML', 'mi'],
    ] as const)('creates %s in its namespace', (tag, namespace, localName) => {
      const element = createElement(tag)
      expect(element.namespaceURI).toBe(namespace)
      expect(element.localName).toBe(localName)
    })

    it('initializes props and mixed children before calling the ref', () => {
      const child = document.createElement('em')
      const release = vi.fn()
      const ref = vi.fn((element: HTMLButtonElement) => {
        expect(element.textContent).toBe('Save 2')
        expect(element.disabled).toBe(true)
        return release
      })
      const button = createElement('button', {
        disabled: true,
        class: ['primary', 'active'],
        style: { color: 'red' },
        data: { state: 'ready' },
        children: ['Save ', 2, null, [child, h('span')]],
        ref,
      })
      expect(button.className).toBe('primary active')
      expect(button.style.color).toBe('red')
      expect(button.dataset.state).toBe('ready')
      expect(button.contains(child)).toBe(true)
      expect(ref).toHaveBeenCalledExactlyOnceWith(button)
      expect(() => bind(button, {})).toThrow('active binding')
      dispose(button)
      dispose(button)
      expect(release).toHaveBeenCalledOnce()
      const stop = bind(button, {})
      stop()
    })

    it('supports innerHTML and removes event listeners on disposal', () => {
      const onclick = vi.fn()
      const button = createElement('button', { innerHTML: '<strong>Save</strong>', onclick })
      expect(button.innerHTML).toBe('<strong>Save</strong>')
      button.click()
      expect(onclick).toHaveBeenCalledOnce()
      dispose(button)
      button.click()
      expect(onclick).toHaveBeenCalledOnce()
    })
  },
)

describe.each(fixtures)('$name createElement', (fixture) => {
  it('updates native props and children until disposal', () => {
    const title = fixture.source('before')
    const child = fixture.source('A')
    const release = vi.fn()
    const element = fixture.createElement('button', {
      title: title.value,
      children: child.value,
      ref: () => release,
    })
    expect(element.title).toBe('before')
    expect(element.textContent).toBe('A')
    title.set('after')
    child.set('B')
    expect(element.title).toBe('after')
    expect(element.textContent).toBe('B')
    fixture.dispose(element)
    title.set('disposed')
    child.set('C')
    expect(element.title).toBe('after')
    expect(element.textContent).toBe('B')
    expect(release).toHaveBeenCalledOnce()
  })
})
