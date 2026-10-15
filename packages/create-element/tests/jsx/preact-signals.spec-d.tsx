/** @jsxImportSource @lilian1315/create-element/preact-signals */

import type { VNode } from '@lilian1315/create-element/preact-signals'
import { build } from '@lilian1315/create-element/preact-signals/dom'
import type { JSX } from '@lilian1315/create-element/preact-signals/jsx-runtime'
import { computed, signal } from '@preact/signals-core'
import { expectTypeOf, it } from 'vite-plus/test'

it('infers JSX refs and build results and checks native source payloads', () => {
  const derived = computed(() => 'derived')
  const props: JSX.IntrinsicElements['button'] = { title: derived, children: derived }
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
  const invalidPayload = <button disabled={signal('false')} />
  // @ts-expect-error children and innerHTML are exclusive in JSX too
  const invalidContent = <div innerHTML="raw">text</div>
  void invalidPayload
  void invalidContent
})
