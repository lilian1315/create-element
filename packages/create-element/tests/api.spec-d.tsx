/** @jsxImportSource @lilian1315/create-element/preact-signals */

import { h, type VNode } from '@lilian1315/create-element/preact-signals'
import { build } from '@lilian1315/create-element/preact-signals/dom'
import { bind } from '@lilian1315/create-element/preact-signals/dom'
import { signal } from '@preact/signals-core'
import { expectTypeOf } from 'vite-plus/test'

const direct = build(h('button', { children: 'save' }))
const jsx = build<'button'>(<button>{signal(1)}</button>)

expectTypeOf(direct).toEqualTypeOf<HTMLButtonElement>()
expectTypeOf(jsx).toEqualTypeOf<HTMLButtonElement>()

const typedRef = (
  <input
    ref={(input) => {
      expectTypeOf(input).toEqualTypeOf<HTMLInputElement>()
      return () => {}
    }}
  />
)

expectTypeOf(typedRef).toEqualTypeOf<VNode>()

bind(direct, {
  ref: (button) => {
    expectTypeOf(button).toEqualTypeOf<HTMLButtonElement>()
  },
})

// @ts-expect-error children and innerHTML are exclusive
h('div', { children: 'text', innerHTML: '<b>raw</b>' })

// @ts-expect-error children must be in props.children
h('div', null, 'text')
