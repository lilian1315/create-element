/** @jsxImportSource @lilian1315/create-element/virtual */

import type { Child, Component, VNode } from '@lilian1315/create-element/virtual'
import { build } from '@lilian1315/create-element/virtual/dom'
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

it('checks component props and return values through the JSX namespace', () => {
  const Label: Component<{ label: string; children: Child }> = ({ label, children }) => (
    <span title={label}>{children}</span>
  )
  expectTypeOf(<Label label="Save">text</Label>).toEqualTypeOf<VNode>()
  // @ts-expect-error required component props must be supplied
  const _missing = <Label />
  // @ts-expect-error component prop payloads are checked
  const _wrong = <Label label={42}>text</Label>
  const Invalid = () => ({ unsupported: true })
  // @ts-expect-error components must return supported children
  const _invalidReturn = <Invalid />
})
