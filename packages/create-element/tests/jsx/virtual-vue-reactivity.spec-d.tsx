/** @jsxImportSource @lilian1315/create-element/vue-reactivity/virtual */

import type { VNode } from '@lilian1315/create-element/vue-reactivity/virtual'
import { build } from '@lilian1315/create-element/vue-reactivity/virtual/dom'
import type { JSX } from '@lilian1315/create-element/vue-reactivity/virtual/jsx-runtime'
import { shallowRef } from '@vue/reactivity'
import { expectTypeOf, it } from 'vite-plus/test'

it('infers JSX refs and build results and checks native source payloads', () => {
  const title = shallowRef('save')
  const props: JSX.IntrinsicElements['button'] = { title, children: shallowRef(1) }
  const tree = <button {...props} />
  expectTypeOf(tree).toEqualTypeOf<VNode>()
  expectTypeOf(build<'button'>(tree)).toEqualTypeOf<HTMLButtonElement>()
  const inputTree = (
    <input
      ref={(input) => {
        expectTypeOf(input).toEqualTypeOf<HTMLInputElement>()
        return () => {}
      }}
    />
  )
  expectTypeOf(inputTree).toEqualTypeOf<VNode>()
  // @ts-expect-error a boolean prop needs a boolean source
  const invalidPayload = <button disabled={shallowRef('false')} />
  // @ts-expect-error children and innerHTML are exclusive in JSX too
  const invalidContent = <div innerHTML="raw">text</div>
  void invalidPayload
  void invalidContent
})
