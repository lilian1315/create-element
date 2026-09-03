import { describe, expect, it, vi } from 'vitest'

import { createElement } from '../src/index'
import { h, mount } from '../src/virtual/index'
import { Fragment, jsx, jsxs } from '../src/virtual/jsx-runtime'
import { isVNode } from '../src/virtual/vnode'

describe('virtual nodes', () => {
  it('creates a Preact-style VNode object', () => {
    const vnode = h('a', { href: '#', key: 'link' })

    expect(isVNode(vnode)).toBe(true)
    expect(vnode.type).toBe('a')
    expect(vnode.props).toEqual({ href: '#' })
    expect(vnode.key).toBe('link')
    expect(vnode.constructor).toBeUndefined()
  })

  it('appends children arguments after props.children', () => {
    const vnode = h('div', { children: 'from props' }, 'from argument', 0)

    expect(vnode.props.children).toEqual(['from props', 'from argument', 0])
    expect(h('div', { children: 0 }).props.children).toBe(0)
    expect(h('div', { innerHTML: '' }).props).toEqual({ innerHTML: '' })

    const directElement = createElement('div', { children: 'from props' }, 'from argument', 0)
    const target = document.createElement('main')
    mount(target, vnode)

    expect(target.innerHTML).toBe(directElement.outerHTML)
  })

  it('uses the same VNode representation from JSX', () => {
    const vnode = jsx('div', { children: 'child' }, 'key')
    const multipleChildren = jsxs('div', { children: ['first', 'second'] })

    expect(vnode).toEqual(h('div', { children: 'child', key: 'key' }))
    expect(multipleChildren.props).toEqual({ children: ['first', 'second'] })
  })

  it('represents components and fragments as VNodes', () => {
    const Greeting = ({ name }: { name: string }) => h('strong', null, `Hello ${name}`)
    const component = jsx(Greeting, { name: 'Ada' })
    const fragment = jsxs(Fragment, { children: [component, '!', false] })

    expect(component.type).toBe(Greeting)
    expect(fragment.type).toBe(Fragment)
    expect(isVNode(fragment)).toBe(true)
  })
})

describe('virtual tree mount', () => {
  it('mounts one VNode, components, fragments, and nested children', () => {
    const target = document.createElement('main')
    const Greeting = ({ name }: { name: string }) => h('strong', null, `Hello ${name}`)

    mount(
      target,
      jsxs(Fragment, {
        children: [jsx(Greeting, { name: 'Ada' }), [' ', 0, null, false, h('span', null, '!')]],
      }),
    )

    expect(target.innerHTML).toBe('<strong>Hello Ada</strong> 0<span>!</span>')
  })

  it('applies DOM props and listeners when materializing VNodes', () => {
    const target = document.createElement('main')
    const onclick = vi.fn()

    mount(
      target,
      h(
        'button',
        {
          class: ['primary', 'large'],
          data: { action: 'save' },
          onclick,
          style: { color: 'red' },
        },
        'Save',
      ),
    )

    const button = target.querySelector('button')
    expect(button?.className).toBe('primary large')
    expect(button?.dataset.action).toBe('save')
    expect(button?.style.color).toBe('red')
    button?.click()
    expect(onclick).toHaveBeenCalledOnce()
  })

  it('creates namespace-aware SVG and MathML elements', () => {
    const target = document.createElement('main')

    mount(target, [h('svg', null, h('svg:circle')), h('math', null, h('math:mi', null, 'x'))])

    expect(target.firstElementChild?.namespaceURI).toBe('http://www.w3.org/2000/svg')
    expect(target.querySelector('circle')?.namespaceURI).toBe('http://www.w3.org/2000/svg')
    expect(target.lastElementChild?.namespaceURI).toBe('http://www.w3.org/1998/Math/MathML')
  })
})
