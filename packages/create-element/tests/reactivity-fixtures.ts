import * as deep from '@lilian1315/create-element/alien-deepsignals'
import * as deepDOM from '@lilian1315/create-element/alien-deepsignals/dom'
import * as deepJSX from '@lilian1315/create-element/alien-deepsignals/jsx-runtime'
import * as deepServer from '@lilian1315/create-element/alien-deepsignals/server'
import * as alien from '@lilian1315/create-element/alien-signals'
import * as alienDOM from '@lilian1315/create-element/alien-signals/dom'
import * as alienJSX from '@lilian1315/create-element/alien-signals/jsx-runtime'
import * as alienServer from '@lilian1315/create-element/alien-signals/server'
import * as faisceau from '@lilian1315/create-element/faisceau'
import * as faisceauDOM from '@lilian1315/create-element/faisceau/dom'
import * as faisceauJSX from '@lilian1315/create-element/faisceau/jsx-runtime'
import * as faisceauServer from '@lilian1315/create-element/faisceau/server'
import type {
  Fragment as plainFragment,
  jsx as plainJSX,
} from '@lilian1315/create-element/jsx-runtime'
import * as preact from '@lilian1315/create-element/preact-signals'
import * as preactDOM from '@lilian1315/create-element/preact-signals/dom'
import * as preactJSX from '@lilian1315/create-element/preact-signals/jsx-runtime'
import * as preactServer from '@lilian1315/create-element/preact-signals/server'
import * as vue from '@lilian1315/create-element/vue-reactivity'
import * as vueDOM from '@lilian1315/create-element/vue-reactivity/dom'
import * as vueJSX from '@lilian1315/create-element/vue-reactivity/jsx-runtime'
import * as vueServer from '@lilian1315/create-element/vue-reactivity/server'
import { effect as preactEffect, signal as preactSignal } from '@preact/signals-core'
import { effect as vueEffect, shallowRef, stop as stopVueEffect } from '@vue/reactivity'
import { effect as deepEffect, signal as deepSignal } from 'alien-deepsignals'
import { effect as alienEffect, signal as alienSignal } from 'alien-signals'
import { effect as faisceauEffect, signal as faisceauSignal } from 'faisceau'

import type { DomElement, ElementPrefixedTagNameMap, PrefixedElementTag, VNode } from '../src/types'

type NativeSource = object | Function
type Fixture = {
  name: string
  source: (value: unknown) => { value: NativeSource; set(value: unknown): void; read(): unknown }
  observe: (run: () => void) => () => void
  h: <T extends PrefixedElementTag>(tag: T, props?: object) => VNode<T>
  build: <T extends PrefixedElementTag>(tree: VNode<T>) => ElementPrefixedTagNameMap[T]
  createElement: <T extends PrefixedElementTag>(
    tag: T,
    props?: object | null,
  ) => ElementPrefixedTagNameMap[T]
  bind: (element: DomElement, props: object) => () => void
  mount: (element: DomElement, tree: unknown) => () => void
  dispose: (element: DomElement) => void
  ssr: (tree: VNode) => string
  jsx: typeof plainJSX
  Fragment: typeof plainFragment
}

// Runtime fixtures erase adapter-specific prop types only at this boundary.
// Published source/payload constraints are checked separately by the type suites.
function fixture(
  name: string,
  entry: unknown,
  dom: unknown,
  runtime: unknown,
  server: unknown,
  source: Fixture['source'],
  observe: Fixture['observe'],
): Fixture {
  const { createVNode: h } = entry as { createVNode: Fixture['h'] }
  const { build, bind, mount, dispose, createElement } = dom as Pick<
    Fixture,
    'build' | 'bind' | 'mount' | 'dispose' | 'createElement'
  >
  const { jsx, Fragment } = runtime as Pick<Fixture, 'jsx' | 'Fragment'>
  const { renderToString } = server as { renderToString: Fixture['ssr'] }
  return {
    name,
    h,
    build,
    createElement,
    bind,
    mount,
    dispose,
    jsx,
    Fragment,
    ssr: renderToString,
    source,
    observe,
  }
}

export const fixtures = [
  fixture(
    'preact-signals',
    preact,
    preactDOM,
    preactJSX,
    preactServer,
    (value) => {
      const source = preactSignal(value)
      return { value: source, set: (next) => (source.value = next), read: () => source.value }
    },
    preactEffect,
  ),
  fixture(
    'alien-signals',
    alien,
    alienDOM,
    alienJSX,
    alienServer,
    (value) => {
      const source = alienSignal(value)
      return { value: source, set: (next) => source(next), read: () => source() }
    },
    alienEffect,
  ),
  fixture(
    'alien-deepsignals',
    deep,
    deepDOM,
    deepJSX,
    deepServer,
    (value) => {
      const source = deepSignal(value)
      return { value: source, set: (next) => source.set(next), read: () => source.get() }
    },
    (run) => {
      const observer = deepEffect(run)
      return () => observer.stop()
    },
  ),
  fixture(
    'faisceau',
    faisceau,
    faisceauDOM,
    faisceauJSX,
    faisceauServer,
    (value) => {
      const source = faisceauSignal(value)
      return { value: source, set: (next) => source.set(next), read: () => source.get() }
    },
    faisceauEffect,
  ),
  fixture(
    'vue-reactivity',
    vue,
    vueDOM,
    vueJSX,
    vueServer,
    (value) => {
      const source = shallowRef(value)
      return { value: source, set: (next) => (source.value = next), read: () => source.value }
    },
    (run) => {
      const observer = vueEffect(run)
      return () => stopVueEffect(observer)
    },
  ),
] as const
