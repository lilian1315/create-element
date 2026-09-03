import { signal as preactSignal } from '@preact/signals-core'
import { shallowRef } from '@vue/reactivity'
import { signal as alienDeepSignal } from 'alien-deepsignals'
import { signal as alienSignal } from 'alien-signals'
import { signal as faisceauSignal } from 'faisceau'
import { expectTypeOf, it } from 'vite-plus/test'

import { h as alienDeepH } from '../src/alien-deepsignals/virtual/index'
import { h as alienH } from '../src/alien-signals/virtual/index'
import { h as faisceauH } from '../src/faisceau/virtual/index'
import { h as preactH } from '../src/preact-signals/virtual/index'
import type { VNode } from '../src/virtual/types'
import { h as vueH } from '../src/vue-reactivity/virtual/index'
import type { VNodeChild } from '../src/vue-reactivity/virtual/types'

it('accepts each adapter reactive source as a server child', () => {
  expectTypeOf(alienH('p', null, alienSignal('alien'))).toMatchTypeOf<VNode>()
  expectTypeOf(alienDeepH('p', null, alienDeepSignal('deep'))).toMatchTypeOf<VNode>()
  expectTypeOf(faisceauH('p', null, faisceauSignal('faisceau'))).toMatchTypeOf<VNode>()
  expectTypeOf(preactH('p', null, preactSignal('preact'))).toMatchTypeOf<VNode>()

  const count = shallowRef<VNodeChild>(0)
  expectTypeOf(vueH('button', null, 'count is: ', count)).toMatchTypeOf<VNode>()
})

it('keeps innerHTML and children mutually exclusive', () => {
  const html = shallowRef('<strong>trusted</strong>')

  vueH('div', { innerHTML: html })

  // @ts-expect-error innerHTML and props.children cannot be used together
  vueH('div', { innerHTML: html, children: 'text' })

  // @ts-expect-error innerHTML and child arguments cannot be used together
  vueH('div', { innerHTML: html }, 'text')
})
