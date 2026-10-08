import { h as deepH } from '@lilian1315/create-element/alien-deepsignals'
import { build as deepBuild } from '@lilian1315/create-element/alien-deepsignals/dom'
import { dispose as deepDispose } from '@lilian1315/create-element/alien-deepsignals/dom'
import {
  jsx as deepJSX,
  type JSX as DeepJSX,
} from '@lilian1315/create-element/alien-deepsignals/jsx-runtime'
import { renderToString as deepSSR } from '@lilian1315/create-element/alien-deepsignals/server'
import { h as alienH } from '@lilian1315/create-element/alien-signals'
import { build as alienBuild } from '@lilian1315/create-element/alien-signals/dom'
import { dispose as alienDispose } from '@lilian1315/create-element/alien-signals/dom'
import {
  jsx as alienJSX,
  type JSX as AlienJSX,
} from '@lilian1315/create-element/alien-signals/jsx-runtime'
import { renderToString as alienSSR } from '@lilian1315/create-element/alien-signals/server'
import { h as faisceauH } from '@lilian1315/create-element/faisceau'
import { build as faisceauBuild } from '@lilian1315/create-element/faisceau/dom'
import { dispose as faisceauDispose } from '@lilian1315/create-element/faisceau/dom'
import {
  jsx as faisceauJSX,
  type JSX as FaisceauJSX,
} from '@lilian1315/create-element/faisceau/jsx-runtime'
import { renderToString as faisceauSSR } from '@lilian1315/create-element/faisceau/server'
import { jsx } from '@lilian1315/create-element/jsx-runtime'
import { h as preactH, type VNodeChildValue } from '@lilian1315/create-element/preact-signals'
import { build as preactBuild } from '@lilian1315/create-element/preact-signals/dom'
import { dispose as preactDispose } from '@lilian1315/create-element/preact-signals/dom'
import { bind as preactBind } from '@lilian1315/create-element/preact-signals/dom'
import {
  jsx as preactJSX,
  type JSX as PreactJSX,
} from '@lilian1315/create-element/preact-signals/jsx-runtime'
import { renderToString as preactSSR } from '@lilian1315/create-element/preact-signals/server'
import { h as vueH } from '@lilian1315/create-element/vue-reactivity'
import { build as vueBuild } from '@lilian1315/create-element/vue-reactivity/dom'
import { dispose as vueDispose } from '@lilian1315/create-element/vue-reactivity/dom'
import {
  jsx as vueJSX,
  type JSX as VueJSX,
} from '@lilian1315/create-element/vue-reactivity/jsx-runtime'
import { renderToString as vueSSR } from '@lilian1315/create-element/vue-reactivity/server'
import { effect as preactEffect, signal as preactSignal } from '@preact/signals-core'
import { effect as vueEffect, shallowRef, stop as stopVueEffect } from '@vue/reactivity'
import { effect as deepEffect, signal as deepSignal } from 'alien-deepsignals'
import { effect as alienEffect, signal as alienSignal } from 'alien-signals'
import { effect as faisceauEffect, signal as faisceauSignal } from 'faisceau'
import { describe, expect, it, vi } from 'vite-plus/test'

import type { VNode } from '../src/types'

type Source = object | Function
type Fixture = {
  name: string
  source(value: unknown): { value: Source; set(value: unknown): void; read(): unknown }
  observe(run: () => void): () => void
  h(props: object): VNode<'span'>
  build(tree: VNode<'span'>): HTMLSpanElement
  dispose(element: HTMLElement): void
  ssr(tree: VNode): string
  jsx: typeof jsx
}

const fixtures: Fixture[] = [
  {
    name: 'preact-signals',
    source(value) {
      const source = preactSignal(value)
      return { value: source, set: (next) => (source.value = next), read: () => source.value }
    },
    observe: preactEffect,
    h: (props) => preactH('span', props as PreactJSX.IntrinsicElements['span']),
    build: preactBuild,
    dispose: preactDispose,
    ssr: preactSSR,
    jsx: preactJSX,
  },
  {
    name: 'alien-signals',
    source(value) {
      const source = alienSignal(value)
      return { value: source, set: (next) => source(next), read: () => source() }
    },
    observe: alienEffect,
    h: (props) => alienH('span', props as AlienJSX.IntrinsicElements['span']),
    build: alienBuild,
    dispose: alienDispose,
    ssr: alienSSR,
    jsx: alienJSX,
  },
  {
    name: 'alien-deepsignals',
    source(value) {
      const source = deepSignal(value)
      return { value: source, set: (next) => source.set(next), read: () => source.get() }
    },
    observe(run) {
      const observer = deepEffect(run)
      return () => observer.stop()
    },
    h: (props) => deepH('span', props as DeepJSX.IntrinsicElements['span']),
    build: deepBuild,
    dispose: deepDispose,
    ssr: deepSSR,
    jsx: deepJSX,
  },
  {
    name: 'faisceau',
    source(value) {
      const source = faisceauSignal(value)
      return { value: source, set: (next) => source.set(next), read: () => source.get() }
    },
    observe: faisceauEffect,
    h: (props) => faisceauH('span', props as FaisceauJSX.IntrinsicElements['span']),
    build: faisceauBuild,
    dispose: faisceauDispose,
    ssr: faisceauSSR,
    jsx: faisceauJSX,
  },
  {
    name: 'vue-reactivity',
    source(value) {
      const source = shallowRef(value)
      return { value: source, set: (next) => (source.value = next), read: () => source.value }
    },
    observe(run) {
      const observer = vueEffect(run)
      return () => stopVueEffect(observer)
    },
    h: (props) => vueH('span', props as VueJSX.IntrinsicElements['span']),
    build: vueBuild,
    dispose: vueDispose,
    ssr: vueSSR,
    jsx: vueJSX,
  },
]

describe.each(fixtures)('$name specialization', (fixture) => {
  it('keeps components untracked during SSR and restores tracking after errors', () => {
    const snapshot = fixture.source('snapshot')
    const tracked = fixture.source('tracked')
    const tree = fixture.jsx(() => fixture.h({ children: snapshot.read() }), {})
    const throwing = fixture.jsx(() => {
      snapshot.read()
      throw new Error('component failed')
    }, {})
    const render = vi.fn(() => {
      expect(fixture.ssr(tree)).toBe('<span>snapshot</span>')
      expect(() => fixture.ssr(throwing)).toThrow('component failed')
      tracked.read()
    })
    const stop = fixture.observe(render)
    try {
      snapshot.set('new snapshot')
      expect(render).toHaveBeenCalledOnce()
      // Restore the snapshot without adding a tracked dependency.
      snapshot.set('snapshot')
      tracked.set('updated tracked value')
      expect(render).toHaveBeenCalledTimes(2)
    } finally {
      stop()
    }
  })

  it('keeps a managed child alive after moving it out of a disposed parent', () => {
    const title = fixture.source('before')
    const parent = fixture.build(fixture.h({ children: fixture.h({ title: title.value }) }))
    const child = parent.firstElementChild as HTMLElement
    const destination = document.createElement('div')
    destination.append(child)
    fixture.dispose(parent)
    title.set('after')
    expect(child.title).toBe('after')
    fixture.dispose(destination)
    title.set('stopped')
    expect(child.title).toBe('after')
  })

  it('reuses keyed children across native source updates and stops removed bindings', () => {
    const title = fixture.source('before')
    const a = () => fixture.h({ key: 'a', title: title.value, children: 'A' })
    const b = () => fixture.h({ key: 'b', children: 'B' })
    const content = fixture.source([a(), b()])
    const element = fixture.build(fixture.h({ children: content.value }))
    const [first, second] = [...element.children] as HTMLElement[]
    content.set([b(), a()])
    expect([...element.children]).toEqual([second, first])
    title.set('after')
    expect(first!.title).toBe('after')
    content.set([b()])
    title.set('removed')
    expect(first!.title).toBe('after')
    expect(element.firstElementChild).toBe(second)
    fixture.dispose(element)
    content.set([a()])
    expect(element.firstElementChild).toBe(second)
  })

  it('keeps SSR reads untracked and restores tracking for subsequent reads', () => {
    const snapshot = fixture.source('snapshot')
    const tracked = fixture.source('tracked')
    const tree = fixture.h({ children: snapshot.value })
    const render = vi.fn(() => {
      fixture.ssr(tree)
      tracked.read()
    })
    const stop = fixture.observe(render)
    try {
      snapshot.set('new snapshot')
      expect(render).toHaveBeenCalledOnce()
      tracked.set('new tracked value')
      expect(render).toHaveBeenCalledTimes(2)
    } finally {
      stop()
    }
  })

  it('tracks native sources, stops on dispose, and peeks during SSR', () => {
    const title = fixture.source('one')
    const child = fixture.source('A')
    const tree = fixture.h({ title: title.value, children: child.value })
    expect(fixture.ssr(tree)).toBe('<span title="one">A</span>')
    const element = fixture.build(tree)
    expect(element.title).toBe('one')
    expect(element.textContent).toBe('A')
    title.set('two')
    child.set('B')
    expect(element.title).toBe('two')
    expect(element.textContent).toBe('B')
    fixture.dispose(element)
    title.set('three')
    child.set('C')
    expect(element.title).toBe('two')
    expect(element.textContent).toBe('B')
  })

  it('updates class, style, and data from native sources', () => {
    const name = fixture.source('before')
    const tree = fixture.h({
      class: name.value,
      style: { color: name.value },
      data: { state: name.value },
    })
    const element = fixture.build(tree)
    expect(element.className).toBe('before')
    expect(element.style.color).toBe('')
    expect(element.dataset.state).toBe('before')
    name.set('red')
    expect(element.className).toBe('red')
    expect(element.style.color).toBe('red')
    expect(element.dataset.state).toBe('red')
    expect(fixture.ssr(tree)).toContain('data-state="red"')
    fixture.dispose(element)
  })

  it('does not mistake an object with a value field for a native source', () => {
    const fake = { value: 'not a source' }
    const tree = fixture.h({ title: fake, children: fake })
    const element = fixture.build(tree)
    expect(element.textContent).toBe('')
    fixture.dispose(element)
  })
})

describe.each(fixtures.filter(({ name }) => name === 'alien-signals' || name === 'faisceau'))(
  '$name effect ownership',
  (fixture) => {
    it('keeps DOM effects alive when the surrounding native effect stops', () => {
      const source = fixture.source('before')
      let element!: HTMLElement
      const stopParent = fixture.observe(() => {
        element = fixture.build(fixture.h({ children: source.value }))
      })
      stopParent()
      try {
        source.set('after')
        expect(element.textContent).toBe('after')
      } finally {
        fixture.dispose(element)
      }
      source.set('disposed')
      expect(element.textContent).toBe('after')
    })
  },
)

describe('reactive content and structured props', () => {
  it('stops listeners on replaced reactive children', () => {
    const clicked = vi.fn()
    const content = preactSignal<VNodeChildValue>(
      preactH('button', { onclick: clicked, children: 'old' }),
    )
    const element = preactBuild(preactH('div', { children: content }))
    const oldButton = element.querySelector('button') as HTMLButtonElement
    content.value = preactH('span', { children: 'new' })
    oldButton.click()
    expect(clicked).not.toHaveBeenCalled()
    preactDispose(element)
  })

  it('replaces reactive innerHTML and stops after bind cleanup', () => {
    const html = preactSignal('<span>A</span>')
    const element = document.createElement('div')
    const stop = preactBind(element, { innerHTML: html })
    html.value = '<strong>B</strong>'
    expect(element.innerHTML).toBe('<strong>B</strong>')
    stop()
    html.value = '<em>C</em>'
    expect(element.innerHTML).toBe('<strong>B</strong>')
  })

  it('stops resources created for bind children while leaving their DOM', () => {
    const title = preactSignal('before')
    const element = document.createElement('div')
    const stop = preactBind(element, { children: preactH('span', { title }) })
    const child = element.firstElementChild as HTMLSpanElement
    expect(child.title).toBe('before')
    stop()
    title.value = 'after'
    expect(child.title).toBe('before')
    expect(element.firstElementChild).toBe(child)
  })

  it('replaces managed children and cleans their refs when a source changes', () => {
    const release = vi.fn()
    const content = preactSignal<VNodeChildValue>(
      preactH('span', { ref: () => release, children: 'old' }),
    )
    const element = preactBuild(preactH('div', { children: content }))
    expect(element.textContent).toBe('old')
    content.value = preactH('strong', { children: 'new' })
    expect(element.innerHTML).toContain('<strong>new</strong>')
    expect(release).toHaveBeenCalledOnce()
    preactDispose(element)
  })

  it('removes disappeared keys from a reactive object', () => {
    const classes = preactSignal<Record<string, boolean>>({ before: true })
    const styles = preactSignal<Record<string, string>>({ fontSize: '20px' })
    const data = preactSignal<Record<string, string>>({ before: 'one' })
    const element = document.createElement('div')
    const stop = preactBind(element, { class: classes, style: styles, data })
    expect(element.classList.contains('before')).toBe(true)
    expect(element.style.fontSize).toBe('20px')
    expect(element.dataset.before).toBe('one')
    classes.value = { after: true }
    styles.value = { color: 'red' }
    data.value = { after: 'two' }
    expect(element.classList.contains('before')).toBe(false)
    expect(element.style.fontSize).toBe('')
    expect(element.dataset.before).toBeUndefined()
    expect(element.classList.contains('after')).toBe(true)
    stop()
  })
})
