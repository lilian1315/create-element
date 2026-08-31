import { signal as preactSignal } from '@preact/signals-core'
import { shallowRef as vueSignal } from '@vue/reactivity'
import { signal as alienDeepSignal } from 'alien-deepsignals'
import { signal as alienSignal } from 'alien-signals'
import { signal as faisceauSignal } from 'faisceau'
import { describe, expect, it } from 'vite-plus/test'

import {
  Fragment as AlienDeepFragment,
  jsx as alienDeepJsx,
} from '../src/alien-deepsignals/jsx-runtime'
import { reactivityAdapter as alienDeepAdapter } from '../src/alien-deepsignals/reactivity'
import { Fragment as AlienFragment, jsx as alienJsx } from '../src/alien-signals/jsx-runtime'
import { reactivityAdapter as alienAdapter } from '../src/alien-signals/reactivity'
import { Fragment as FaisceauFragment, jsx as faisceauJsx } from '../src/faisceau/jsx-runtime'
import { reactivityAdapter as faisceauAdapter } from '../src/faisceau/reactivity'
import { Fragment as PreactFragment, jsx as preactJsx } from '../src/preact-signals/jsx-runtime'
import { reactivityAdapter as preactAdapter } from '../src/preact-signals/reactivity'
import type { StopEffect } from '../src/reactivity'
import { Fragment as VueFragment, jsx as vueJsx } from '../src/vue-reactivity/jsx-runtime'
import { reactivityAdapter as vueAdapter } from '../src/vue-reactivity/reactivity'

interface TestSignal<Value> {
  get(): Value
  peek(): Value
  set(value: Value): void
}

interface FragmentMount {
  readonly element: HTMLElement
  update(value: string): void
  stop(): void
}

interface ReactivityAdapterFixture {
  readonly name: string
  signal<Value>(initialValue: Value): TestSignal<Value>
  effect(run: () => void): StopEffect
  mountFragment(): FragmentMount
}

const fixtures: ReactivityAdapterFixture[] = [
  {
    name: 'alien-signals',
    signal(initialValue) {
      const source = alienSignal(initialValue)
      return {
        get: () => alienAdapter.get(source),
        peek: () => alienAdapter.peek(source),
        set: (value) => source(value),
      }
    },
    effect(run) {
      return alienAdapter.effect(run)
    },
    mountFragment() {
      const source = alienSignal('first')
      const fragment = alienJsx(
        AlienFragment,
        { children: ['value: ', source] },
        undefined,
        undefined,
        undefined,
        undefined,
      )
      if (fragment instanceof Node) throw new TypeError('Expected a reactive fragment')

      return mountReactiveFragment(
        () => alienAdapter.get(fragment),
        (value) => source(value),
        (run) => alienAdapter.effect(run),
      )
    },
  },
  {
    name: 'alien-deepsignals',
    signal(initialValue) {
      const source = alienDeepSignal(initialValue)
      return {
        get: () => alienDeepAdapter.get(source),
        peek: () => alienDeepAdapter.peek(source),
        set: (value) => source.set(value),
      }
    },
    effect(run) {
      return alienDeepAdapter.effect(run)
    },
    mountFragment() {
      const source = alienDeepSignal('first')
      const fragment = alienDeepJsx(
        AlienDeepFragment,
        { children: ['value: ', source] },
        undefined,
        undefined,
        undefined,
        undefined,
      )
      if (fragment instanceof Node) throw new TypeError('Expected a reactive fragment')

      return mountReactiveFragment(
        () => alienDeepAdapter.get(fragment),
        (value) => source.set(value),
        (run) => alienDeepAdapter.effect(run),
      )
    },
  },
  {
    name: 'faisceau',
    signal(initialValue) {
      const source = faisceauSignal(initialValue)
      return {
        get: () => faisceauAdapter.get(source),
        peek: () => faisceauAdapter.peek(source),
        set: (value) => source.set(value),
      }
    },
    effect(run) {
      return faisceauAdapter.effect(run)
    },
    mountFragment() {
      const source = faisceauSignal('first')
      const fragment = faisceauJsx(
        FaisceauFragment,
        { children: ['value: ', source] },
        undefined,
        undefined,
        undefined,
        undefined,
      )
      if (fragment instanceof Node) throw new TypeError('Expected a reactive fragment')

      return mountReactiveFragment(
        () => faisceauAdapter.get(fragment),
        (value) => source.set(value),
        (run) => faisceauAdapter.effect(run),
      )
    },
  },
  {
    name: 'preact-signals',
    signal(initialValue) {
      const source = preactSignal(initialValue)
      return {
        get: () => preactAdapter.get(source),
        peek: () => preactAdapter.peek(source),
        set: (value) => {
          source.value = value
        },
      }
    },
    effect(run) {
      return preactAdapter.effect(run)
    },
    mountFragment() {
      const source = preactSignal('first')
      const fragment = preactJsx(
        PreactFragment,
        { children: ['value: ', source] },
        undefined,
        undefined,
        undefined,
        undefined,
      )
      if (fragment instanceof Node) throw new TypeError('Expected a reactive fragment')

      return mountReactiveFragment(
        () => preactAdapter.get(fragment),
        (value) => {
          source.value = value
        },
        (run) => preactAdapter.effect(run),
      )
    },
  },
  {
    name: 'vue-reactivity',
    signal(initialValue) {
      const source = vueSignal(initialValue)
      return {
        get: () => vueAdapter.get(source),
        peek: () => vueAdapter.peek(source),
        set: (value) => {
          source.value = value
        },
      }
    },
    effect(run) {
      return vueAdapter.effect(run)
    },
    mountFragment() {
      const source = vueSignal('first')
      const fragment = vueJsx(
        VueFragment,
        { children: ['value: ', source] },
        undefined,
        undefined,
        undefined,
        undefined,
      )
      if (fragment instanceof Node) throw new TypeError('Expected a reactive fragment')

      return mountReactiveFragment(
        () => vueAdapter.get(fragment),
        (value) => {
          source.value = value
        },
        (run) => vueAdapter.effect(run),
      )
    },
  },
]

for (const fixture of fixtures) {
  describe(`ReactivityAdapter (${fixture.name})`, () => {
    it('peeks without subscribing the active effect', () => {
      const source = fixture.signal(1)
      let runs = 0

      const stop = fixture.effect(() => {
        runs++
        source.peek()
      })

      source.set(2)

      expect(runs).toBe(1)
      stop()
    })

    it('runs effects immediately and can stop them', () => {
      const source = fixture.signal(1)
      const values: number[] = []

      const stop = fixture.effect(() => {
        values.push(source.get())
      })

      expect(values).toEqual([1])

      source.set(2)
      expect(values).toEqual([1, 2])

      stop()
      source.set(3)
      expect(values).toEqual([1, 2])
    })

    it('keeps reactive JSX fragments subscribed', () => {
      const fragment = fixture.mountFragment()

      expect(fragment.element.textContent).toBe('value: first')

      fragment.update('second')

      expect(fragment.element.textContent).toBe('value: second')
      fragment.stop()
    })
  })
}

function mountReactiveFragment(
  getNodes: () => Node[],
  update: (value: string) => void,
  effect: (run: () => void) => StopEffect,
): FragmentMount {
  const element = document.createElement('div')
  const stop = effect(() => element.replaceChildren(...getNodes()))

  return { element, update, stop }
}
