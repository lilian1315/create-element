import * as deepLive from '@lilian1315/create-element/alien-deepsignals'
import * as deep from '@lilian1315/create-element/alien-deepsignals/virtual'
import * as deepDOM from '@lilian1315/create-element/alien-deepsignals/virtual/dom'
import * as deepJSX from '@lilian1315/create-element/alien-deepsignals/virtual/jsx-runtime'
import * as deepServer from '@lilian1315/create-element/alien-deepsignals/virtual/server'
import * as alienLive from '@lilian1315/create-element/alien-signals'
import * as alien from '@lilian1315/create-element/alien-signals/virtual'
import * as alienDOM from '@lilian1315/create-element/alien-signals/virtual/dom'
import * as alienJSX from '@lilian1315/create-element/alien-signals/virtual/jsx-runtime'
import * as alienServer from '@lilian1315/create-element/alien-signals/virtual/server'
import * as faisceauLive from '@lilian1315/create-element/faisceau'
import * as faisceau from '@lilian1315/create-element/faisceau/virtual'
import * as faisceauDOM from '@lilian1315/create-element/faisceau/virtual/dom'
import * as faisceauJSX from '@lilian1315/create-element/faisceau/virtual/jsx-runtime'
import * as faisceauServer from '@lilian1315/create-element/faisceau/virtual/server'
import * as preactLive from '@lilian1315/create-element/preact-signals'
import * as preact from '@lilian1315/create-element/preact-signals/virtual'
import * as preactDOM from '@lilian1315/create-element/preact-signals/virtual/dom'
import * as preactJSX from '@lilian1315/create-element/preact-signals/virtual/jsx-runtime'
import * as preactServer from '@lilian1315/create-element/preact-signals/virtual/server'
import type {
  Fragment as plainFragment,
  jsx as plainJSX,
} from '@lilian1315/create-element/virtual/jsx-runtime'
import * as vueLive from '@lilian1315/create-element/vue-reactivity'
import * as vue from '@lilian1315/create-element/vue-reactivity/virtual'
import * as vueDOM from '@lilian1315/create-element/vue-reactivity/virtual/dom'
import * as vueJSX from '@lilian1315/create-element/vue-reactivity/virtual/jsx-runtime'
import * as vueServer from '@lilian1315/create-element/vue-reactivity/virtual/server'
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
    { ...preactLive, ...preactDOM },
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
    { ...alienLive, ...alienDOM },
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
    { ...deepLive, ...deepDOM },
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
    { ...faisceauLive, ...faisceauDOM },
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
    { ...vueLive, ...vueDOM },
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
