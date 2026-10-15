import { describe, expect, it, vi } from 'vite-plus/test'

import { fixtures } from './reactivity-fixtures'

describe.each(fixtures)('$name specialization', (fixture) => {
  it('keeps components untracked during SSR and restores tracking after errors', () => {
    const snapshot = fixture.source('snapshot')
    const tracked = fixture.source('tracked')
    const tree = fixture.jsx(() => fixture.h('span', { children: snapshot.read() }), {})
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

  it('stops a moved managed child when its former parent is disposed', () => {
    const title = fixture.source('before')
    const release = vi.fn()
    const parent = fixture.build(
      fixture.h('span', {
        children: fixture.h('span', { title: title.value, ref: () => release }),
      }),
    )
    const child = parent.firstElementChild as HTMLElement
    const destination = document.createElement('div')
    destination.append(child)
    fixture.dispose(parent)
    expect(child.parentNode).toBe(destination)
    expect(release).toHaveBeenCalledOnce()
    title.set('after')
    expect(child.title).toBe('before')
    fixture.dispose(destination)
    expect(release).toHaveBeenCalledOnce()
  })

  it('keeps SSR reads untracked and restores tracking for subsequent reads', () => {
    const snapshot = fixture.source('snapshot')
    const tracked = fixture.source('tracked')
    const tree = fixture.h('span', { children: snapshot.value })
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
    const tree = fixture.h('span', { title: title.value, children: child.value })
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
    const tree = fixture.h('span', {
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

  it('rejects an object with a value field as an unsupported child', () => {
    const fake = { value: 'not a source' }
    const tree = fixture.h('span', { title: fake, children: fake })
    expect(() => fixture.build(tree)).toThrow('Unsupported tree child')
  })
})

describe.each(fixtures.filter(({ name }) => name === 'alien-signals' || name === 'faisceau'))(
  '$name effect ownership',
  (fixture) => {
    it('keeps DOM effects alive when the surrounding native effect stops', () => {
      const source = fixture.source('before')
      let element!: HTMLElement
      const stopParent = fixture.observe(() => {
        element = fixture.build(fixture.h('span', { children: source.value }))
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

describe.each(fixtures)('$name reactive content and structured props', (fixture) => {
  it('stops listeners on replaced reactive children', () => {
    const clicked = vi.fn()
    const content = fixture.source(fixture.h('button', { onclick: clicked, children: 'old' }))
    const element = fixture.build(fixture.h('div', { children: content.value }))
    const oldButton = element.querySelector('button') as HTMLButtonElement
    oldButton.click()
    expect(clicked).toHaveBeenCalledOnce()
    content.set(fixture.h('span', { children: 'new' }))
    oldButton.click()
    expect(clicked).toHaveBeenCalledOnce()
    fixture.dispose(element)
  })

  it('replaces reactive innerHTML and stops after bind cleanup', () => {
    const html = fixture.source('<span>A</span>')
    const element = document.createElement('div')
    const stop = fixture.bind(element, { innerHTML: html.value })
    html.set('<strong>B</strong>')
    expect(element.innerHTML).toBe('<strong>B</strong>')
    stop()
    html.set('<em>C</em>')
    expect(element.innerHTML).toBe('<strong>B</strong>')
  })

  it('stops resources created for bind children while leaving their DOM', () => {
    const title = fixture.source('before')
    const element = document.createElement('div')
    const stop = fixture.bind(element, { children: fixture.h('span', { title: title.value }) })
    const child = element.firstElementChild as HTMLSpanElement
    expect(child.title).toBe('before')
    stop()
    title.set('after')
    expect(child.title).toBe('before')
    expect(element.firstElementChild).toBe(child)
  })

  it('removes disappeared keys from a reactive object', () => {
    const classes = fixture.source({ before: true })
    const styles = fixture.source({ fontSize: '20px' })
    const data = fixture.source({ before: 'one' })
    const element = document.createElement('div')
    const stop = fixture.bind(element, {
      class: classes.value,
      style: styles.value,
      data: data.value,
    })
    expect(element.classList.contains('before')).toBe(true)
    expect(element.style.fontSize).toBe('20px')
    expect(element.dataset.before).toBe('one')
    classes.set({ after: true })
    styles.set({ color: 'red' })
    data.set({ after: 'two' })
    expect(element.classList.contains('before')).toBe(false)
    expect(element.style.fontSize).toBe('')
    expect(element.dataset.before).toBeUndefined()
    expect(element.classList.contains('after')).toBe(true)
    stop()
  })
})
