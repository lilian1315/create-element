/** @jsxImportSource @lilian1315/create-element/alien-signals */

import type { VNode } from '@lilian1315/create-element/alien-signals'
import { build } from '@lilian1315/create-element/alien-signals/dom'
import type { JSX } from '@lilian1315/create-element/alien-signals/jsx-runtime'
import { signal } from 'alien-signals'
import { expectTypeOf, it } from 'vite-plus/test'

it('infers JSX refs and build results and checks native source payloads', () => {
  const title = signal('save')
  const props: JSX.IntrinsicElements['button'] = { title, children: signal(1) }
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
