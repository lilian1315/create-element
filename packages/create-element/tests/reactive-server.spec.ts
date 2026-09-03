import { computed as preactComputed, signal as preactSignal } from '@preact/signals-core'
import { computed as vueComputed, shallowRef } from '@vue/reactivity'
import { computed as alienDeepComputed, signal as alienDeepSignal } from 'alien-deepsignals'
import { computed as alienComputed, signal as alienSignal } from 'alien-signals'
import { computed as faisceauComputed, signal as faisceauSignal } from 'faisceau'
import { describe, expect, it } from 'vite-plus/test'

import { renderToString as renderAlienDeep } from '../src/alien-deepsignals/server/index'
import { h as alienDeepH } from '../src/alien-deepsignals/virtual/index'
import { renderToString as renderAlien } from '../src/alien-signals/server/index'
import { h as alienH } from '../src/alien-signals/virtual/index'
import { renderToString as renderFaisceau } from '../src/faisceau/server/index'
import { h as faisceauH } from '../src/faisceau/virtual/index'
import { renderToString as renderPreact } from '../src/preact-signals/server/index'
import { h as preactH } from '../src/preact-signals/virtual/index'
import { isVNode } from '../src/virtual/vnode'
import { reactivityAdapter as vueAdapter } from '../src/vue-reactivity/reactivity'
import { renderToString as renderVue } from '../src/vue-reactivity/server/index'
import { h as vueH } from '../src/vue-reactivity/virtual/index'
import { jsx as vueJsx } from '../src/vue-reactivity/virtual/jsx-runtime'
import type { VNodeChild as VueVNodeChild } from '../src/vue-reactivity/virtual/types'

describe('reactive server renderers', () => {
  it('renders alien-signals snapshots', () => {
    const count = alienSignal(1)
    const label = alienComputed(() => `count: ${count()}`)
    const tree = alienH('p', { title: label }, 'value: ', count)

    expect(isVNode(tree)).toBe(true)
    expect(renderAlien(tree)).toBe('<p title="count: 1">value: 1</p>')

    count(2)
    expect(renderAlien(tree)).toBe('<p title="count: 2">value: 2</p>')
  })

  it('renders alien-deepsignals snapshots', () => {
    const count = alienDeepSignal(1)
    const label = alienDeepComputed(() => `count: ${count.get()}`)
    const tree = alienDeepH('p', { title: label }, 'value: ', count)

    expect(isVNode(tree)).toBe(true)
    expect(renderAlienDeep(tree)).toBe('<p title="count: 1">value: 1</p>')

    count.set(2)
    expect(renderAlienDeep(tree)).toBe('<p title="count: 2">value: 2</p>')
  })

  it('renders faisceau snapshots', () => {
    const count = faisceauSignal(1)
    const label = faisceauComputed(() => `count: ${count.get()}`)
    const tree = faisceauH('p', { title: label }, 'value: ', count)

    expect(isVNode(tree)).toBe(true)
    expect(renderFaisceau(tree)).toBe('<p title="count: 1">value: 1</p>')

    count.set(2)
    expect(renderFaisceau(tree)).toBe('<p title="count: 2">value: 2</p>')
  })

  it('renders Preact Signals snapshots', () => {
    const count = preactSignal(1)
    const label = preactComputed(() => `count: ${count.value}`)
    const tree = preactH('p', { title: label }, 'value: ', count)

    expect(isVNode(tree)).toBe(true)
    expect(renderPreact(tree)).toBe('<p title="count: 1">value: 1</p>')

    count.value = 2
    expect(renderPreact(tree)).toBe('<p title="count: 2">value: 2</p>')
  })

  it('renders Vue snapshots and nested reactive props', () => {
    const count = shallowRef<VueVNodeChild>(1)
    const enabled = vueComputed(() => count.value === 1)
    const tree = vueH(
      'p',
      {
        class: { enabled },
        data: {
          state: vueComputed(() =>
            typeof count.value === 'number' ? count.value.toString() : undefined,
          ),
        },
        style: { fontWeight: vueComputed(() => (enabled.value ? 'bold' : 'normal')) },
      },
      'value: ',
      count,
    )

    expect(isVNode(tree)).toBe(true)
    expect(renderVue(tree)).toBe(
      '<p class="enabled" data-state="1" style="font-weight:bold;">value: 1</p>',
    )

    count.value = 2
    expect(renderVue(tree)).toBe('<p class data-state="2" style="font-weight:normal;">value: 2</p>')
  })

  it('keeps props.children before child arguments and represents JSX as VNodes', () => {
    const count = shallowRef<VueVNodeChild>(1)
    const tree = vueH('div', { children: 'first' }, ' second ', count)
    const jsxTree = vueJsx('span', { children: count })

    expect(tree.props.children).toEqual(['first', ' second ', count])
    expect(isVNode(jsxTree)).toBe(true)
    expect(renderVue(tree)).toBe('<div>first second 1</div>')
    expect(renderVue(jsxTree)).toBe('<span>1</span>')
  })

  it('does not subscribe while rendering a snapshot', () => {
    const count = shallowRef<VueVNodeChild>(1)
    const tree = vueH('span', null, count)
    let effectRuns = 0

    const stop = vueAdapter.effect(() => {
      effectRuns++
      renderVue(tree)
    })

    count.value = 2

    expect(effectRuns).toBe(1)
    stop()
  })
})
