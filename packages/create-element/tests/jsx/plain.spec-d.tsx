/** @jsxImportSource @lilian1315/create-element */

import {
  createElement,
  type Child,
  type Component,
  type ElementProps,
} from '@lilian1315/create-element'
import { createVNode } from '@lilian1315/create-element/virtual'
import { expectTypeOf, it } from 'vite-plus/test'
it('types JSX as DOM nodes and infers concrete createElement results', () => {
  expectTypeOf(<div />).toEqualTypeOf<Node>()
  expectTypeOf(
    <>
      <span />
      text
    </>,
  ).toEqualTypeOf<Node>()
  expectTypeOf(createElement('div')).toEqualTypeOf<HTMLDivElement>()
  const props: ElementProps<'input'> = { checked: true }
  const input = (
    <input
      {...props}
      ref={(node) => {
        expectTypeOf(node).toEqualTypeOf<HTMLInputElement>()
      }}
    />
  )
  expectTypeOf(input).toEqualTypeOf<Node>()
})

it('checks component props and JSX children', () => {
  const Label: Component<{ label: string; children: Child }> = ({ label, children }) => (
    <span title={label}>{children}</span>
  )
  const label = (
    <Label label="Save">
      <button />
    </Label>
  )
  expectTypeOf(label).toEqualTypeOf<Node>()
  // @ts-expect-error required component props must be supplied
  const _missing = <Label />
  // @ts-expect-error component prop payloads are checked
  const _wrong = <Label label={42}>text</Label>
  const Invalid = () => ({ unsupported: true })
  // @ts-expect-error components must return supported children
  const _invalidReturn = <Invalid />
})

it('accepts virtual children while rejecting invalid intrinsic props', () => {
  // @ts-expect-error checked requires a boolean
  const _invalid = <input checked="yes" />
  // @ts-expect-error children and innerHTML are mutually exclusive
  const _content = <div innerHTML="html">text</div>
  expectTypeOf(<div>{createVNode('span')}</div>).toEqualTypeOf<Node>()
  expectTypeOf(
    createElement('div', { children: createVNode('span') }),
  ).toEqualTypeOf<HTMLDivElement>()
})
