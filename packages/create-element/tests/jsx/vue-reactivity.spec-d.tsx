/** @jsxImportSource @lilian1315/create-element/vue-reactivity */

import type { ElementProps } from '@lilian1315/create-element/vue-reactivity'
import { createVNode } from '@lilian1315/create-element/vue-reactivity/virtual'
import { shallowRef } from '@vue/reactivity'
import { expectTypeOf, it } from 'vite-plus/test'

it('checks native source payloads and infers DOM refs', () => {
  const props: ElementProps<'button'> = { title: shallowRef('Save'), children: shallowRef(1) }
  expectTypeOf(<button {...props} />).toEqualTypeOf<Node>()
  expectTypeOf(<div>{shallowRef(createVNode('span'))}</div>).toEqualTypeOf<Node>()
  const input = (
    <input
      ref={(node) => {
        expectTypeOf(node).toEqualTypeOf<HTMLInputElement>()
      }}
    />
  )
  expectTypeOf(input).toEqualTypeOf<Node>()
  // @ts-expect-error disabled requires a boolean payload
  const _invalid = <button disabled={shallowRef('yes')} />
  // @ts-expect-error children must resolve to supported child values
  const _children = <button>{shallowRef({})}</button>
  // @ts-expect-error children and innerHTML are mutually exclusive
  const _html = <div innerHTML="html">text</div>
})
