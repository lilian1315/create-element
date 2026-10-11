import { h } from '@lilian1315/create-element'
import { build } from '@lilian1315/create-element/dom'
import { bind as baseBind, dispose as baseDispose } from '@lilian1315/create-element/dom'
import { h as reactiveH, type VNodeChildValue } from '@lilian1315/create-element/preact-signals'
import { build as reactiveBuild } from '@lilian1315/create-element/preact-signals/dom'
import { bind, dispose, mount } from '@lilian1315/create-element/preact-signals/dom'
import { signal } from '@preact/signals-core'
import { describe, expect, it, vi } from 'vite-plus/test'

describe('single element binding owner', () => {
  it.each([
    { title: signal('source') },
    { class: { active: signal(true) } },
    { style: { color: signal('red') } },
    { data: { state: signal('ready') } },
    { onclick: vi.fn() },
    { ref: () => vi.fn() },
    { children: signal('source') },
    { innerHTML: signal('<b>source</b>') },
  ])('rejects another binding even for unrelated props: %o', (props) => {
    const element = document.createElement('button')
    const stop = bind(element, props)
    const content = element.innerHTML
    expect(() => baseBind(element, { id: 'conflict', children: 'replaced' })).toThrow(
      'active binding',
    )
    expect(element.id).toBe('')
    expect(element.innerHTML).toBe(content)
    stop()
    const stopNext = baseBind(element, { id: 'next' })
    stop()
    expect(() => bind(element, { title: 'conflict' })).toThrow('active binding')
    stopNext()
  })

  it('refuses to bind built elements across integrations before mutation', () => {
    const clicked = vi.fn()
    const title = signal('source')
    const button = reactiveBuild(reactiveH('button', { title, onclick: clicked }))
    expect(() => baseBind(button, { title: 'conflict', onclick: vi.fn() })).toThrow(
      'active binding',
    )
    expect(button.title).toBe('source')
    button.click()
    expect(clicked).toHaveBeenCalledOnce()
    title.value = 'updated'
    expect(button.title).toBe('updated')
    // The shared binding marker also makes cross-integration disposal work.
    baseDispose(button)
    const replacement = vi.fn()
    const stop = bind(button, { title: 'bound', onclick: replacement })
    title.value = 'stopped'
    expect(button.title).toBe('bound')
    button.click()
    expect(clicked).toHaveBeenCalledOnce()
    expect(replacement).toHaveBeenCalledOnce()
    stop()
  })

  it('rejects a plain built element and permits binding after disposal', () => {
    const element = build(h('input', { value: 'built' }))
    expect(() => bind(element, { value: 'conflict' })).toThrow('active binding')
    baseDispose(element)
    const stop = bind(element, { value: 'bound' })
    expect(element.value).toBe('bound')
    stop()
  })

  it('uses identical initialization and cleanup for build and bind', () => {
    for (const materialize of [
      (props: Parameters<typeof bind<HTMLSelectElement>>[1]) => {
        const element = document.createElement('select')
        return { element, stop: bind(element, props) }
      },
      (props: Parameters<typeof bind<HTMLSelectElement>>[1]) => {
        const element = reactiveBuild(reactiveH('select', props))
        return { element, stop: () => dispose(element) }
      },
    ]) {
      const selection = signal('b')
      const release = vi.fn()
      let observed = ''
      const { element, stop } = materialize({
        value: selection,
        children: [reactiveH('option', { value: 'a' }), reactiveH('option', { value: 'b' })],
        ref: (select) => {
          observed = select.value
          return release
        },
      })
      expect(observed).toBe('b')
      selection.value = 'a'
      expect(element.value).toBe('a')
      stop()
      stop()
      selection.value = 'b'
      expect(element.value).toBe('a')
      expect(release).toHaveBeenCalledOnce()
    }
  })
})

describe('ownership follows rendered trees', () => {
  it('disposes a moved child when its former parent is disposed', () => {
    const title = signal('before')
    const release = vi.fn()
    const parent = reactiveBuild(
      reactiveH('div', { children: reactiveH('button', { title, ref: () => release }) }),
    )
    const child = parent.querySelector('button')!
    const destination = document.createElement('section')
    destination.append(child)
    dispose(parent)
    expect(child.parentNode).toBe(destination)
    expect(release).toHaveBeenCalledOnce()
    title.value = 'after'
    expect(child.title).toBe('before')
    dispose(destination)
    expect(release).toHaveBeenCalledOnce()
  })

  it('disposes a moved child when reconciliation removes it from its former parent', () => {
    const title = signal('before')
    const release = vi.fn()
    const content = signal<VNodeChildValue>(reactiveH('button', { title, ref: () => release }))
    const parent = reactiveBuild(reactiveH('div', { children: content }))
    const child = parent.querySelector('button')!
    const destination = document.createElement('section')
    destination.append(child)
    content.value = reactiveH('span', { children: 'replacement' })
    expect(child.parentNode).toBe(destination)
    expect(release).toHaveBeenCalledOnce()
    title.value = 'after'
    expect(child.title).toBe('before')
    dispose(parent)
    dispose(destination)
    expect(release).toHaveBeenCalledOnce()
  })

  it('bind cleanup disposes a moved managed child without removing it', () => {
    const title = signal('before')
    const target = document.createElement('div')
    const stop = bind(target, { children: reactiveH('span', { title }) })
    const child = target.firstElementChild as HTMLSpanElement
    const destination = document.createElement('div')
    destination.append(child)
    stop()
    expect(child.parentNode).toBe(destination)
    title.value = 'after'
    expect(child.title).toBe('before')
    dispose(destination)
  })

  it('mount cleanup disposes a moved child and removes its remaining range', () => {
    const title = signal('before')
    const target = document.createElement('div')
    const stop = mount(target, [reactiveH('span', { title }), reactiveH('i')])
    const child = target.querySelector('span')!
    const destination = document.createElement('div')
    destination.append(child)
    stop()
    expect(target.childNodes).toHaveLength(0)
    expect(child.parentNode).toBe(destination)
    title.value = 'after'
    expect(child.title).toBe('before')
    dispose(destination)
  })
})
