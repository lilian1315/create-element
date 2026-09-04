import { computed as preactComputed, signal as preactSignal } from '@preact/signals-core'
import { computed as vueComputed, shallowRef } from '@vue/reactivity'
import { computed as alienDeepComputed, signal as alienDeepSignal } from 'alien-deepsignals'
import { computed as alienComputed, signal as alienSignal } from 'alien-signals'
import { computed as faisceauComputed, signal as faisceauSignal } from 'faisceau'
import { describe, expect, it } from 'vite-plus/test'

import {
  createElementFromVNode as createAlienDeepElementFromVNode,
  h as alienDeepH,
  mount as mountAlienDeep,
} from '../src/alien-deepsignals/virtual/index'
import {
  createElementFromVNode as createAlienElementFromVNode,
  h as alienH,
  mount as mountAlien,
} from '../src/alien-signals/virtual/index'
import {
  createElementFromVNode as createFaisceauElementFromVNode,
  h as faisceauH,
  mount as mountFaisceau,
} from '../src/faisceau/virtual/index'
import {
  createElementFromVNode as createPreactElementFromVNode,
  h as preactH,
  mount as mountPreact,
} from '../src/preact-signals/virtual/index'
import {
  createElementFromVNode as createVueElementFromVNode,
  h as vueH,
  mount as mountVue,
} from '../src/vue-reactivity/virtual/index'
import type { VNodeChild as VueVNodeChild } from '../src/vue-reactivity/virtual/types'

describe('reactive virtual tree mount', () => {
  it('creates reactive elements directly from every adapter VNode', () => {
    const alienCount = alienSignal(1)
    const alienDeepCount = alienDeepSignal(1)
    const faisceauCount = faisceauSignal(1)
    const preactCount = preactSignal(1)
    const vueCount = shallowRef(1)
    const elements = [
      createAlienElementFromVNode(alienH('p', null, alienCount)),
      createAlienDeepElementFromVNode(alienDeepH('p', null, alienDeepCount)),
      createFaisceauElementFromVNode(faisceauH('p', null, faisceauCount)),
      createPreactElementFromVNode(preactH('p', null, preactCount)),
      createVueElementFromVNode(vueH('p', null, vueCount)),
    ]

    expect(elements.map((element) => element.textContent)).toEqual(['1', '1', '1', '1', '1'])

    alienCount(2)
    alienDeepCount.set(2)
    faisceauCount.set(2)
    preactCount.value = 2
    vueCount.value = 2

    expect(elements.map((element) => element.textContent)).toEqual(['2', '2', '2', '2', '2'])
  })

  it('mounts alien-signals VNodes reactively', () => {
    const count = alienSignal(1)
    const title = alienComputed(() => `count: ${count()}`)
    const target = document.createElement('main')

    mountAlien(target, alienH('p', { title }, 'value: ', count))
    expect(target.innerHTML).toBe('<p title="count: 1">value: 1</p>')

    count(2)
    expect(target.innerHTML).toBe('<p title="count: 2">value: 2</p>')
  })

  it('mounts alien-deepsignals VNodes reactively', () => {
    const count = alienDeepSignal(1)
    const title = alienDeepComputed(() => `count: ${count.get()}`)
    const target = document.createElement('main')

    mountAlienDeep(target, alienDeepH('p', { title }, 'value: ', count))
    expect(target.innerHTML).toBe('<p title="count: 1">value: 1</p>')

    count.set(2)
    expect(target.innerHTML).toBe('<p title="count: 2">value: 2</p>')
  })

  it('mounts faisceau VNodes reactively', () => {
    const count = faisceauSignal(1)
    const title = faisceauComputed(() => `count: ${count.get()}`)
    const target = document.createElement('main')

    mountFaisceau(target, faisceauH('p', { title }, 'value: ', count))
    expect(target.innerHTML).toBe('<p title="count: 1">value: 1</p>')

    count.set(2)
    expect(target.innerHTML).toBe('<p title="count: 2">value: 2</p>')
  })

  it('mounts Preact Signals VNodes reactively', () => {
    const count = preactSignal(1)
    const title = preactComputed(() => `count: ${count.value}`)
    const target = document.createElement('main')

    mountPreact(target, preactH('p', { title }, 'value: ', count))
    expect(target.innerHTML).toBe('<p title="count: 1">value: 1</p>')

    count.value = 2
    expect(target.innerHTML).toBe('<p title="count: 2">value: 2</p>')
  })

  it('mounts Vue VNodes and replaces a reactive child with another VNode', () => {
    const child = shallowRef<VueVNodeChild>(1)
    const title = vueComputed(() =>
      typeof child.value === 'number' ? `count: ${child.value}` : 'content',
    )
    const target = document.createElement('main')

    mountVue(target, vueH('p', { title }, 'value: ', child))
    expect(target.innerHTML).toBe('<p title="count: 1">value: 1</p>')

    child.value = vueH('strong', null, 'ready')
    expect(target.innerHTML).toBe('<p title="content">value: <strong>ready</strong></p>')
  })

  const cleanupCases = [
    {
      name: 'alien-signals',
      setup() {
        const count = alienSignal(1)
        const target = document.createElement('main')
        const dispose = mountAlien(target, alienH('p', null, count))

        return {
          dispose,
          element: target.firstElementChild,
          target,
          update: () => count(2),
        }
      },
    },
    {
      name: 'alien-deepsignals',
      setup() {
        const count = alienDeepSignal(1)
        const target = document.createElement('main')
        const dispose = mountAlienDeep(target, alienDeepH('p', null, count))

        return {
          dispose,
          element: target.firstElementChild,
          target,
          update: () => count.set(2),
        }
      },
    },
    {
      name: 'faisceau',
      setup() {
        const count = faisceauSignal(1)
        const target = document.createElement('main')
        const dispose = mountFaisceau(target, faisceauH('p', null, count))

        return {
          dispose,
          element: target.firstElementChild,
          target,
          update: () => count.set(2),
        }
      },
    },
    {
      name: 'Preact Signals',
      setup() {
        const count = preactSignal(1)
        const target = document.createElement('main')
        const dispose = mountPreact(target, preactH('p', null, count))

        return {
          dispose,
          element: target.firstElementChild,
          target,
          update: () => {
            count.value = 2
          },
        }
      },
    },
    {
      name: 'Vue reactivity',
      setup() {
        const count = shallowRef(1)
        const target = document.createElement('main')
        const dispose = mountVue(target, vueH('p', null, count))

        return {
          dispose,
          element: target.firstElementChild,
          target,
          update: () => {
            count.value = 2
          },
        }
      },
    },
  ]

  for (const cleanupCase of cleanupCases) {
    it(`disposes ${cleanupCase.name} effects`, () => {
      const { dispose, element, target, update } = cleanupCase.setup()

      dispose()
      expect(target.innerHTML).toBe('')

      update()
      expect(element?.textContent).toBe('1')

      dispose()
      expect(target.innerHTML).toBe('')
    })
  }

  it('disposes the previous tree when mounting again', () => {
    const firstCount = preactSignal(1)
    const target = document.createElement('main')
    const disposeFirst = mountPreact(target, preactH('p', null, firstCount))
    const firstElement = target.firstElementChild
    const disposeSecond = mountPreact(target, preactH('strong', null, 'second'))

    firstCount.value = 2
    expect(firstElement?.textContent).toBe('1')
    expect(target.innerHTML).toBe('<strong>second</strong>')

    disposeFirst()
    expect(target.innerHTML).toBe('<strong>second</strong>')

    disposeSecond()
    expect(target.innerHTML).toBe('')
  })

  it('disposes effects in a replaced reactive subtree', () => {
    const count = shallowRef(1)
    const child = shallowRef<VueVNodeChild>(vueH('span', null, count))
    const target = document.createElement('main')
    const dispose = mountVue(target, vueH('p', null, child))
    const replacedElement = target.querySelector('span')

    child.value = 'done'
    count.value = 2

    expect(replacedElement?.textContent).toBe('1')
    expect(target.innerHTML).toBe('<p>done</p>')
    dispose()
  })

  it('removes event listeners when disposing a tree', () => {
    let calls = 0
    const target = document.createElement('main')
    const dispose = mountVue(
      target,
      vueH('button', {
        onClick: () => {
          calls++
        },
      }),
    )
    const button = target.querySelector('button')

    button?.click()
    expect(calls).toBe(1)

    dispose()
    button?.click()
    expect(calls).toBe(1)
  })
})
