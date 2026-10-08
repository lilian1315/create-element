import { h, type VNodeChildValue } from '@lilian1315/create-element/preact-signals'
import { build } from '@lilian1315/create-element/preact-signals/dom'
import { dispose, mount } from '@lilian1315/create-element/preact-signals/dom'
import { Fragment, jsx } from '@lilian1315/create-element/preact-signals/jsx-runtime'
import { signal } from '@preact/signals-core'
import { describe, expect, it, vi } from 'vite-plus/test'

describe('reactive child reconciliation', () => {
  it('patches unkeyed elements and text in place', () => {
    const content = signal(h('span', { title: 'before', children: 'one' }))
    const element = build(h('div', { children: content }))
    const span = element.querySelector('span')!
    const text = span.firstChild
    content.value = h('span', { title: 'after', children: 'two' })
    expect(element.querySelector('span')).toBe(span)
    expect(span.firstChild).toBe(text)
    expect(span.title).toBe('after')
    expect(span.textContent).toBe('two')
    dispose(element)
  })

  it('keeps keyed nodes, input state, and refs across reorder and insertion', () => {
    const release = vi.fn()
    const ref = vi.fn(() => release)
    const item = (key: string) => h('input', { key, ref, title: key })
    const content = signal([item('a'), item('b'), item('c')])
    const element = build(h('div', { children: content }))
    const [a, b, c] = [...element.querySelectorAll('input')]
    b!.value = 'typed by user'
    content.value = [item('c'), item('d'), item('b'), item('a')]
    const inputs = [...element.querySelectorAll('input')]
    expect(inputs).toEqual([c, inputs[1], b, a])
    expect(inputs[1]!.title).toBe('d')
    expect(b!.value).toBe('typed by user')
    expect(ref).toHaveBeenCalledTimes(4)
    expect(release).not.toHaveBeenCalled()
    content.value = [item('b')]
    expect(element.querySelector('input')).toBe(b)
    expect(release).toHaveBeenCalledTimes(3)
    dispose(element)
    expect(release).toHaveBeenCalledTimes(4)
  })

  it('uses native moveBefore for connected reorders and preserves focus', () => {
    const target = document.createElement('div')
    document.body.append(target)
    const content = signal([h('input', { key: 'a' }), h('input', { key: 'b' })])
    const move = vi.spyOn(target, 'moveBefore')
    const stop = mount(target, content)
    const [a, b] = [...target.querySelectorAll('input')]
    a!.focus()
    a!.value = 'hello'
    a!.setSelectionRange(1, 3)
    expect(move).not.toHaveBeenCalled()
    content.value = [h('input', { key: 'b' }), h('input', { key: 'a' })]
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
    const content = signal([h('i', { key: 'a' }), h('i', { key: 'b' })])
    const element = build(h('div', { children: content }))
    Object.defineProperty(element, 'moveBefore', { value: undefined })
    const insert = vi.spyOn(element, 'insertBefore')
    const [a, b] = [...element.children]
    content.value = [h('i', { key: 'b' }), h('i', { key: 'a' })]
    expect([...element.children]).toEqual([b, a])
    expect(insert).toHaveBeenCalled()
    dispose(element)
  })

  it('replaces nodes when either their key or type changes', () => {
    const release = vi.fn()
    const content = signal<VNodeChildValue>(h('button', { key: 'a', ref: () => release }))
    const element = build(h('div', { children: content }))
    const first = element.firstElementChild
    content.value = h('button', { key: 'b' })
    const second = element.firstElementChild
    expect(second).not.toBe(first)
    expect(release).toHaveBeenCalledOnce()
    content.value = h('span', { key: 'b' })
    expect(element.firstElementChild).not.toBe(second)
    dispose(element)
  })

  it('updates props, removes stale props, and replaces listeners and sources', () => {
    const title = signal('before')
    const nextTitle = signal('after')
    const oldClick = vi.fn()
    const nextClick = vi.fn()
    const content = signal(
      jsx('button', {
        title,
        disabled: true,
        'aria-label': 'old',
        onclick: oldClick,
        class: { old: true },
        style: { color: 'red' },
        data: { old: 'one' },
      }),
    )
    const element = build(h('div', { children: content }))
    const button = element.querySelector('button')!
    content.value = h('button', {
      title: nextTitle,
      onclick: nextClick,
      class: { next: true },
      style: { fontSize: '20px' },
      data: { next: 'two' },
    })
    expect(element.querySelector('button')).toBe(button)
    expect(button.disabled).toBe(false)
    expect(button.hasAttribute('aria-label')).toBe(false)
    expect(button.className).toBe('next')
    expect(button.style.color).toBe('')
    expect(button.style.fontSize).toBe('20px')
    expect(button.dataset.old).toBeUndefined()
    expect(button.dataset.next).toBe('two')
    title.value = 'stale'
    expect(button.title).toBe('after')
    nextTitle.value = 'latest'
    expect(button.title).toBe('latest')
    button.click()
    expect(oldClick).not.toHaveBeenCalled()
    expect(nextClick).toHaveBeenCalledOnce()
    content.value = h('button', {})
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
    const content = signal([
      jsx(component, { key: 'a', label: 'A' }),
      jsx(component, { key: 'b', label: 'B' }),
    ])
    const element = build(h('div', { children: content }))
    const [a, aa, b, bb] = [...element.children]
    content.value = [
      jsx(component, { key: 'b', label: 'B!' }),
      jsx(component, { key: 'a', label: 'A!' }),
    ]
    expect([...element.children]).toEqual([b, bb, a, aa])
    expect(element.textContent).toBe('B!B!A!A!')
    content.value = [
      jsx(component, { key: 'b', label: '' }),
      jsx(component, { key: 'a', label: 'A' }),
    ]
    expect([...element.children]).toEqual([a, aa])
    content.value = [
      jsx(component, { key: 'b', label: 'back' }),
      jsx(component, { key: 'a', label: 'A' }),
    ]
    expect(element.textContent).toBe('backbackAA')
    expect(element.children[2]).toBe(a)
    dispose(element)
  })

  it('moves keyed fragments while preserving their nested reactive regions', () => {
    const text = signal('one')
    const fragment = (key: string) =>
      jsx(
        Fragment,
        {
          children: [h('span', { children: text }), h('em', { children: key })],
        },
        key,
      )
    const content = signal([fragment('a'), fragment('b')])
    const element = build(h('div', { children: content }))
    const [a, aa, b, bb] = [...element.children]
    content.value = [fragment('b'), fragment('a')]
    expect([...element.children]).toEqual([b, bb, a, aa])
    text.value = 'two'
    expect(a!.textContent).toBe('two')
    expect(b!.textContent).toBe('two')
    dispose(element)
    text.value = 'stopped'
    expect(a!.textContent).toBe('two')
  })

  it('switches between children and innerHTML and releases old resources', () => {
    const release = vi.fn()
    const html = signal('<b>raw</b>')
    const content = signal(h('section', { children: h('i', { ref: () => release }) }))
    const element = build(h('div', { children: content }))
    const section = element.querySelector('section')!
    content.value = h('section', { innerHTML: html })
    expect(release).toHaveBeenCalledOnce()
    expect(section.innerHTML).toBe('<b>raw</b>')
    content.value = h('section', { children: h('span', { children: 'managed' }) })
    expect(element.querySelector('section')).toBe(section)
    html.value = '<b>stale</b>'
    expect(section.innerHTML).toBe('<span>managed</span>')
    dispose(element)
  })

  it('retains opaque DOM nodes and removes only the owned range', () => {
    const node = document.createElement('input')
    const content = signal<VNodeChildValue>([node, h('span', { key: 'a' })])
    const target = document.createElement('div')
    const stop = mount(target, content)
    const external = document.createElement('aside')
    target.append(external)
    node.value = 'typed'
    content.value = [h('span', { key: 'a' }), node]
    expect(target.querySelector('input')).toBe(node)
    expect(node.value).toBe('typed')
    expect(target.lastElementChild).toBe(external)
    stop()
    expect([...target.children]).toEqual([external])
  })
})
