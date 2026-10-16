import { createElement } from '@lilian1315/create-element/dom'
import { expectTypeOf, it } from 'vite-plus/test'

it('infers concrete createElement results and validates props', () => {
  expectTypeOf(createElement('button')).toEqualTypeOf<HTMLButtonElement>()
  expectTypeOf(createElement('input', null)).toEqualTypeOf<HTMLInputElement>()
  expectTypeOf(createElement('svg:circle')).toEqualTypeOf<SVGCircleElement>()
  expectTypeOf(createElement('math:mi')).toEqualTypeOf<MathMLElement>()
  createElement('input', {
    checked: true,
    ref: (node) => {
      expectTypeOf(node).toEqualTypeOf<HTMLInputElement>()
    },
  })
  // @ts-expect-error checked requires a boolean
  createElement('input', { checked: 'yes' })
  // @ts-expect-error unknown intrinsic tags are rejected
  createElement('not-an-element')
  // @ts-expect-error children and innerHTML are mutually exclusive
  createElement('div', { children: 'text', innerHTML: '<b>text</b>' })
})
