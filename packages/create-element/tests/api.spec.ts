import { bind, createElement, dispose } from '@lilian1315/create-element'
import { createVNode as h } from '@lilian1315/create-element/virtual'
import { build, mount } from '@lilian1315/create-element/virtual/dom'
import { Fragment, jsx } from '@lilian1315/create-element/virtual/jsx-runtime'
import { renderToString } from '@lilian1315/create-element/virtual/server'
import { assert, describe, expect, it, vi } from 'vite-plus/test'

describe('deferred tree API', () => {
  it('does not create DOM or execute components until rendering', () => {
    const component = vi.fn(() => h('button', { children: 'save' }))
    const tree = jsx(component, {})

    expect(component).not.toHaveBeenCalled()
    const frag = build(tree)
    expect(frag.firstElementChild?.outerHTML).toBe('<button>save</button>')
    expect(component).toHaveBeenCalledOnce()
  })

  it('builds a single element root from a VNode', () => {
    const button: HTMLButtonElement = build(h('button', { children: 'ok' }))
    expect(button).toBeInstanceOf(HTMLButtonElement)
  })

  it('`build` a document fragment from a JSX fragment', () => {
    const fragment = build(jsx(Fragment as any, { children: h('span') }))
    expect(fragment).toBeInstanceOf(DocumentFragment)
    expect(fragment.childElementCount).toBe(1)
    expect(fragment.firstElementChild).toBeInstanceOf(HTMLSpanElement)
  })

  it('binds props without erasing absent props or children', () => {
    const element = document.createElement('button')
    element.id = 'existing'
    element.append(document.createTextNode('original'))
    const stop = bind(element, { class: { selected: true } })
    expect(element.id).toBe('existing')
    expect(element.textContent).toBe('original')
    expect(element.classList.contains('selected')).toBe(true)
    expect(() => bind(element, { title: 'second' })).toThrow('active bind')
    stop()
    expect(() => bind(element, { title: 'second' })).not.toThrow()
    dispose(element)
  })

  it('applies class, style, and data forms to existing elements', () => {
    const element = document.createElement('div')
    element.className = 'keep'
    element.style.backgroundColor = 'blue'
    const stop = bind(element, {
      class: { active: true },
      style: { color: 'red' },
      data: { state: 'ready', empty: true, removed: false },
    })
    expect(element.className).toContain('keep')
    expect(element.className).toContain('active')
    expect(element.style.backgroundColor).toBe('blue')
    expect(element.style.color).toBe('red')
    expect(element.dataset.state).toBe('ready')
    expect(element.hasAttribute('data-empty')).toBe(true)
    expect(element.hasAttribute('data-removed')).toBe(false)
    stop()
    expect(element.style.color).toBe('red')
  })

  it('cleans a ref supplied through bind', () => {
    const element = document.createElement('button')
    const release = vi.fn()
    const stop = bind(element, { ref: () => release })
    stop()
    dispose(element)
    expect(release).toHaveBeenCalledOnce()
  })

  it('replaces children and cleans refs on removed elements', () => {
    const cleanup = vi.fn()
    const target = document.createElement('section')
    target.append(build(h('span', { ref: () => cleanup, children: 'old' })))
    const stop = bind(target, { children: createElement('strong', { children: 'new' }) })
    expect(target.innerHTML).toBe('<strong>new</strong>')
    expect(cleanup).toHaveBeenCalledOnce()
    stop()
    dispose(target)
  })

  it('calls refs after initialization and cleans them once', () => {
    const release = vi.fn()
    let observed = ''
    const button = build(
      h('button', {
        children: 'ready',
        ref: (element) => {
          observed = element.textContent ?? ''
          return release
        },
      }),
    )
    expect(observed).toBe('ready')
    dispose(button)
    dispose(button)
    expect(release).toHaveBeenCalledOnce()
  })

  it('keeps cleanup associated with an element after it moves', () => {
    const release = vi.fn()
    const element = build(h('button', { ref: () => release }))
    const first = document.createElement('div')
    const second = document.createElement('div')
    first.append(element)
    second.append(element)
    expect(first.childElementCount).toBe(0)
    dispose(element)
    expect(release).toHaveBeenCalledOnce()
  })

  it('keeps an opaque DOM child by identity and refuses it in SSR', () => {
    const node = document.createElement('em')
    const tree = h('div', { children: node })
    const element = build(tree)
    expect(element.firstChild).toBe(node)
    expect(() => renderToString(tree)).toThrow('Cannot render a DOM Node')
  })

  it('does not map the unsupported className prop to class', () => {
    expect(renderToString(jsx('div', { className: 'legacy' }))).toBe(
      '<div className="legacy"></div>',
    )
  })

  it('keeps DOM and SSR data semantics aligned', () => {
    const tree = h('div', {
      // @ts-expect-error numeric data is outside the public type but supported at runtime
      data: { enabled: true, disabled: false, name: 'Ada', count: 2 },
    })
    const dom = build(tree)
    const parsed = document.createElement('div')
    parsed.innerHTML = renderToString(tree)
    const fromServer = parsed.firstElementChild
    assert.instanceOf(fromServer, HTMLDivElement)
    for (const name of ['enabled', 'disabled', 'name', 'count']) {
      expect(fromServer.getAttribute(`data-${name}`)).toBe(dom.getAttribute(`data-${name}`))
    }
  })

  it('keeps significant form properties aligned between DOM and SSR', () => {
    const tree = h('select', {
      value: 'b',
      children: [
        h('option', { value: 'a', children: 'A' }),
        h('option', { value: 'b', children: 'B' }),
      ],
    })
    const direct = build(tree)
    const parsed = document.createElement('div')
    const html = renderToString(tree)
    expect(html).toContain('<option value="b" selected>B</option>')
    parsed.innerHTML = html
    const fromServer = parsed.firstElementChild
    assert.instanceOf(fromServer, HTMLSelectElement)
    expect(direct.value).toBe(fromServer.value)
    expect(direct.selectedIndex).toBe(fromServer.selectedIndex)

    const textarea = h('textarea', { value: 'A & B' })
    const directTextarea = build(textarea)
    parsed.innerHTML = renderToString(textarea)
    const fromServerTextarea = parsed.firstElementChild
    assert.instanceOf(fromServerTextarea, HTMLTextAreaElement)
    expect(directTextarea.value).toBe(fromServerTextarea.value)

    const checkbox = h('input', { type: 'checkbox', checked: true, disabled: true })
    const directCheckbox = build(checkbox)
    parsed.innerHTML = renderToString(checkbox)
    const fromServerCheckbox = parsed.firstElementChild
    assert.instanceOf(fromServerCheckbox, HTMLInputElement)
    expect(directCheckbox.checked).toBe(fromServerCheckbox.checked)
    expect(directCheckbox.disabled).toBe(fromServerCheckbox.disabled)
  })

  it('materializes SVG and MathML with the same namespaces as SSR', () => {
    const parsed = document.createElement('div')
    for (const tree of [
      h('svg', { children: h('svg:circle') }),
      h('math', { children: h('math:mi', { children: 'x' }) }),
    ]) {
      const direct = build(tree)
      parsed.innerHTML = renderToString(tree)
      const server = parsed.firstElementChild
      assert.instanceOf(server, Element)
      expect(direct.namespaceURI).toBe(server.namespaceURI)
      expect(direct.firstElementChild?.namespaceURI).toBe(server.firstElementChild?.namespaceURI)
    }
  })

  it('cleans only the mount it owns', () => {
    const target = document.createElement('main')
    const stopOld = mount(target, h('p', { children: 'old' }))
    const stopNew = mount(target, h('p', { children: 'new' }))
    stopOld()
    expect(target.textContent).toBe('new')
    stopNew()
    expect(target.textContent).toBe('')
  })

  it('leaves nodes added outside a mount after it', () => {
    const target = document.createElement('main')
    const stop = mount(target, h('p', { children: 'owned' }))
    const external = document.createElement('aside')
    target.append(external)
    stop()
    expect(target.firstElementChild).toBe(external)
  })
})
