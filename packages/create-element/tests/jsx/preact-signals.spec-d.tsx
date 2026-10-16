/** @jsxImportSource @lilian1315/create-element/preact-signals */

import type { ElementProps } from '@lilian1315/create-element/preact-signals'
import { createVNode } from '@lilian1315/create-element/preact-signals/virtual'
import { computed, signal } from '@preact/signals-core'
import { expectTypeOf, it } from 'vite-plus/test'

it('checks native source payloads and infers DOM refs', () => {
  const title = computed(() => 'Save')
  const props: ElementProps<'button'> = { title, children: signal(1) }
  expectTypeOf(<button {...props} />).toEqualTypeOf<Node>()
  expectTypeOf(<div>{signal(createVNode('span'))}</div>).toEqualTypeOf<Node>()
  const input = (
    <input
      ref={(node) => {
        expectTypeOf(node).toEqualTypeOf<HTMLInputElement>()
      }}
    />
  )
  expectTypeOf(input).toEqualTypeOf<Node>()
  // @ts-expect-error disabled requires a boolean payload
  const _invalid = <button disabled={signal('yes')} />
  // @ts-expect-error children must resolve to supported child values
  const _children = <button>{signal({})}</button>
  // @ts-expect-error children and innerHTML are mutually exclusive
  const _html = <div innerHTML="html">text</div>
})
