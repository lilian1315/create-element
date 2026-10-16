/** @jsxImportSource @lilian1315/create-element/faisceau */

import type { ElementProps } from '@lilian1315/create-element/faisceau'
import { createVNode } from '@lilian1315/create-element/faisceau/virtual'
import { signal } from 'faisceau'
import { expectTypeOf, it } from 'vite-plus/test'

it('checks native source payloads and infers DOM refs', () => {
  const props: ElementProps<'button'> = { title: signal('Save'), children: signal(1) }
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
