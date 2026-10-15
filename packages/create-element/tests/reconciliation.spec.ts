import { describe, expect, it, vi } from 'vite-plus/test'

import { fixtures } from './reactivity-fixtures'

describe.each(fixtures)('$name reactive child reconciliation', (fixture) => {
  const { h, build, dispose, mount, jsx, Fragment, source } = fixture
  it('patches unkeyed elements and text in place', () => {
    const content = source(h('span', { title: 'before', children: 'one' }))
    const element = build(h('div', { children: content.value }))
    const span = element.querySelector('span')!
    const text = span.firstChild
    content.set(h('span', { title: 'after', children: 'two' }))
    expect(element.querySelector('span')).toBe(span)
    expect(span.firstChild).toBe(text)
    expect(span.title).toBe('after')
    expect(span.textContent).toBe('two')
    dispose(element)
  })

  it('keeps keyed nodes, input state, refs, and sources across reorder and insertion', () => {
    const release = vi.fn()
    const ref = vi.fn(() => release)
    const title = source('before')
    const item = (key: string) => h('input', { key, ref, title: key === 'a' ? title.value : key })
    const content = source([item('a'), item('b'), item('c')])
    const element = build(h('div', { children: content.value }))
    const [a, b, c] = [...element.querySelectorAll('input')]
    b!.value = 'typed by user'
    content.set([item('c'), item('d'), item('b'), item('a')])
    const inputs = [...element.querySelectorAll('input')]
    expect(inputs).toEqual([c, inputs[1], b, a])
    expect(inputs[1]!.title).toBe('d')
    expect(b!.value).toBe('typed by user')
    expect(ref).toHaveBeenCalledTimes(4)
    expect(release).not.toHaveBeenCalled()
    title.set('after')
    expect(a!.title).toBe('after')
    content.set([item('b')])
    title.set('removed')
    expect(a!.title).toBe('after')
    expect(element.querySelector('input')).toBe(b)
    expect(release).toHaveBeenCalledTimes(3)
    dispose(element)
    expect(release).toHaveBeenCalledTimes(4)
    content.set([item('a')])
    expect(element.querySelector('input')).toBe(b)
  })

  it('uses native moveBefore for connected reorders and preserves focus', () => {
    const target = document.createElement('div')
    document.body.append(target)
    const content = source([h('input', { key: 'a' }), h('input', { key: 'b' })])
    const move = vi.spyOn(target, 'moveBefore')
    const stop = mount(target, content.value)
    const [a, b] = [...target.querySelectorAll('input')]
    a!.focus()
    a!.value = 'hello'
    a!.setSelectionRange(1, 3)
    expect(move).not.toHaveBeenCalled()
    content.set([h('input', { key: 'b' }), h('input', { key: 'a' })])
    expect(move).toHaveBeenCalled()
    expect([...target.querySelectorAll('input')]).toEqual([b, a])
    expect(document.activeElement).toBe(a)
    expect(a!.selectionStart).toBe(1)
    expect(a!.selectionEnd).toBe(3)
    stop()
    move.mockRestore()
    target.remove()
  })

  it('falls back to insertBefore when moveBefore is unavailable', () => {
    const content = source([h('i', { key: 'a' }), h('i', { key: 'b' })])
    const element = build(h('div', { children: content.value }))
    Object.defineProperty(element, 'moveBefore', { value: undefined })
    const insert = vi.spyOn(element, 'insertBefore')
    const [a, b] = [...element.children]
    content.set([h('i', { key: 'b' }), h('i', { key: 'a' })])
    expect([...element.children]).toEqual([b, a])
    expect(insert).toHaveBeenCalled()
    dispose(element)
  })

  it('replaces nodes and cleans refs when either their key or type changes', () => {
    const release = vi.fn()
    const content = source(h('button', { key: 'a', ref: () => release, children: 'old' }))
    const element = build(h('div', { children: content.value }))
    const first = element.firstElementChild
    expect(element.textContent).toBe('old')
    content.set(h('button', { key: 'b', ref: () => release }))
    const second = element.firstElementChild
    expect(second).not.toBe(first)
    expect(release).toHaveBeenCalledOnce()
    content.set(h('span', { key: 'b', children: 'new' }))
    expect(element.firstElementChild).not.toBe(second)
    expect(element.innerHTML).toContain('<span>new</span>')
    expect(release).toHaveBeenCalledTimes(2)
    dispose(element)
    expect(release).toHaveBeenCalledTimes(2)
  })

  it('updates props, removes stale props, and replaces listeners and sources', () => {
    const title = source('before')
    const nextTitle = source('after')
    const oldClick = vi.fn()
    const nextClick = vi.fn()
    const content = source(
      jsx('button', {
        title: title.value,
        disabled: true,
        'aria-label': 'old',
        onclick: oldClick,
        class: { old: true },
        style: { color: 'red' },
        data: { old: 'one' },
      }),
    )
    const element = build(h('div', { children: content.value }))
    const button = element.querySelector('button')!
    content.set(
      h('button', {
        title: nextTitle.value,
        onclick: nextClick,
        class: { next: true },
        style: { fontSize: '20px' },
        data: { next: 'two' },
      }),
    )
    expect(element.querySelector('button')).toBe(button)
    expect(button.disabled).toBe(false)
    expect(button.hasAttribute('aria-label')).toBe(false)
    expect(button.className).toBe('next')
    expect(button.style.color).toBe('')
    expect(button.style.fontSize).toBe('20px')
    expect(button.dataset.old).toBeUndefined()
    expect(button.dataset.next).toBe('two')
    title.set('stale')
    expect(button.title).toBe('after')
    nextTitle.set('latest')
    expect(button.title).toBe('latest')
    button.click()
    expect(oldClick).not.toHaveBeenCalled()
    expect(nextClick).toHaveBeenCalledOnce()
    content.set(h('button', {}))
    expect(button.title).toBe('')
    expect(button.className).toBe('')
    expect(button.style.fontSize).toBe('')
    expect(button.dataset.next).toBeUndefined()
    button.click()
    expect(nextClick).toHaveBeenCalledOnce()
    dispose(element)
  })

  it('reconciles keyed component ranges including empty and multiple roots', () => {
    const component = ({ label }: { label: string }) =>
      label ? [h('i', { children: label }), h('b', { children: label })] : null
    const content = source([
      jsx(component as any, { key: 'a', label: 'A' }),
      jsx(component as any, { key: 'b', label: 'B' }),
    ])
    const element = build(h('div', { children: content.value }))
    const [a, aa, b, bb] = [...element.children]
    content.set([
      jsx(component as any, { key: 'b', label: 'B!' }),
      jsx(component as any, { key: 'a', label: 'A!' }),
    ])
    expect([...element.children]).toEqual([b, bb, a, aa])
    expect(element.textContent).toBe('B!B!A!A!')
    content.set([
      jsx(component as any, { key: 'b', label: '' }),
      jsx(component as any, { key: 'a', label: 'A' }),
    ])
    expect([...element.children]).toEqual([a, aa])
    content.set([
      jsx(component as any, { key: 'b', label: 'back' }),
      jsx(component as any, { key: 'a', label: 'A' }),
    ])
    expect(element.textContent).toBe('backbackAA')
    expect(element.children[2]).toBe(a)
    dispose(element)
  })

  it('moves keyed fragments while preserving their nested reactive regions', () => {
    const text = source('one')
    const fragment = (key: string) =>
      jsx(
        Fragment as any,
        {
          children: [h('span', { children: text.value }), h('em', { children: key })],
        },
        key,
      )
    const content = source([fragment('a'), fragment('b')])
    const element = build(h('div', { children: content.value }))
    const [a, aa, b, bb] = [...element.children]
    content.set([fragment('b'), fragment('a')])
    expect([...element.children]).toEqual([b, bb, a, aa])
    text.set('two')
    expect(a!.textContent).toBe('two')
    expect(b!.textContent).toBe('two')
    dispose(element)
    text.set('stopped')
    expect(a!.textContent).toBe('two')
  })

  it('switches between children and innerHTML and releases old resources', () => {
    const release = vi.fn()
    const html = source('<b>raw</b>')
    const content = source(h('section', { children: h('i', { ref: () => release }) }))
    const element = build(h('div', { children: content.value }))
    const section = element.querySelector('section')!
    content.set(h('section', { innerHTML: html.value }))
    expect(release).toHaveBeenCalledOnce()
    expect(section.innerHTML).toBe('<b>raw</b>')
    content.set(h('section', { children: h('span', { children: 'managed' }) }))
    expect(element.querySelector('section')).toBe(section)
    html.set('<b>stale</b>')
    expect(section.innerHTML).toBe('<span>managed</span>')
    dispose(element)
  })

  it('disposes children moved elsewhere when switching to innerHTML', () => {
    const release = vi.fn()
    const content = source(h('section', { children: h('i', { ref: () => release }) }))
    const element = build(h('div', { children: content.value }))
    const child = element.querySelector('i')!
    const destination = document.createElement('div')
    destination.append(child)
    content.set(h('section', { innerHTML: '<b>raw</b>' }))
    expect(release).toHaveBeenCalledOnce()
    expect(child.parentNode).toBe(destination)
    expect(element.querySelector('section')?.innerHTML).toBe('<b>raw</b>')
    dispose(element)
    expect(release).toHaveBeenCalledOnce()
  })

  it('retains opaque DOM nodes and removes only the owned range', () => {
    const node = document.createElement('input')
    const content = source([node, h('span', { key: 'a' })])
    const target = document.createElement('div')
    const stop = mount(target, content.value)
    const external = document.createElement('aside')
    target.append(external)
    node.value = 'typed'
    content.set([h('span', { key: 'a' }), node])
    expect(target.querySelector('input')).toBe(node)
    expect(node.value).toBe('typed')
    expect(target.lastElementChild).toBe(external)
    stop()
    expect([...target.children]).toEqual([external])
  })
})
