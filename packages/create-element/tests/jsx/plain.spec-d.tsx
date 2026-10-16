/** @jsxImportSource @lilian1315/create-element */

import type { VNode } from '@lilian1315/create-element'
import { build } from '@lilian1315/create-element/dom'
import { expectTypeOf, it } from 'vite-plus/test'

it('types deferred JSX and explicitly typed build results', () => {
  const tree = <div />
  expectTypeOf(tree).toEqualTypeOf<VNode>()
  expectTypeOf(build<'div'>(tree)).toEqualTypeOf<HTMLDivElement>()
  expectTypeOf(build<'button'>(<button />)).toEqualTypeOf<HTMLButtonElement>()
  const input = (
    <input
      checked
      ref={(node) => {
        expectTypeOf(node).toEqualTypeOf<HTMLInputElement>()
      }}
    />
  )
  expectTypeOf(input).toEqualTypeOf<VNode>()
  // @ts-expect-error checked requires a boolean
  const _invalid = <input checked="yes" />
  // @ts-expect-error children and innerHTML are mutually exclusive
  const _content = <div innerHTML="html">text</div>
})
