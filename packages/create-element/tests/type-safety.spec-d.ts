import { createVNode as h, type VNodeProps } from '@lilian1315/create-element'
import { bind } from '@lilian1315/create-element/dom'
import { expectTypeOf, it } from 'vite-plus/test'

it('checks content exclusivity and h arguments', () => {
  expectTypeOf<typeof h<'div'>>().toBeCallableWith('div', {
    children: 'text',
    // @ts-expect-error children and innerHTML are exclusive
    innerHTML: '<b>raw</b>',
  })
  // @ts-expect-error children must be in props.children
  expectTypeOf<typeof h<'div'>>().toBeCallableWith('div', null, 'text')
})

it('checks writable element properties and explicit element types', () => {
  const input = document.createElement('input')
  const props: VNodeProps<'input'> = { value: 'typed', checked: true }
  expectTypeOf<VNodeProps<HTMLInputElement>>().toEqualTypeOf<VNodeProps<'input'>>()
  expectTypeOf<VNodeProps<SVGCircleElement>>().toEqualTypeOf<VNodeProps<'svg:circle'>>()
  expectTypeOf<typeof bind<HTMLInputElement>>().toBeCallableWith(input, props)
  expectTypeOf<typeof bind<HTMLInputElement>>().toBeCallableWith(
    // @ts-expect-error an explicit input type requires an input element
    document.createElement('div'),
    props,
  )
  expectTypeOf<typeof bind<HTMLInputElement>>()
    .toBeCallableWith(input, {
      value: 'value',
      checked: true,
      ref: (node) => {
        expectTypeOf(node).toEqualTypeOf<HTMLInputElement>()
      },
    })
    .returns.toEqualTypeOf<() => void>()
  // @ts-expect-error input value is a string
  expectTypeOf<typeof bind<HTMLInputElement>>().toBeCallableWith(input, { value: {} })
  // @ts-expect-error input checked is boolean
  expectTypeOf<typeof bind<HTMLInputElement>>().toBeCallableWith(input, { checked: 'yes' })
  // @ts-expect-error bind retains the exclusive content union
  expectTypeOf<typeof bind<HTMLInputElement>>().toBeCallableWith(input, {
    children: 'text',
    innerHTML: '<b>raw</b>',
  })
  expectTypeOf<typeof bind<HTMLDivElement>>().toBeCallableWith(document.createElement('div'), {
    // @ts-expect-error unrelated tag properties are not accepted
    checked: true,
  })
  // @ts-expect-error native readonly properties are not bindable
  expectTypeOf<typeof bind<HTMLInputElement>>().toBeCallableWith(input, { nodeType: 1 })
})

it('accepts element subclasses and SVG without exposing custom properties', () => {
  class CustomInput extends HTMLInputElement {}
  expectTypeOf<typeof bind<CustomInput>>().toBeCallableWith(new CustomInput(), {
    value: 'subclass',
  })
  class ExtendedInput extends HTMLInputElement {
    custom = true
  }
  expectTypeOf(
    bind(new ExtendedInput(), {
      value: 'extended subclass',
      ref: (node) => {
        expectTypeOf(node).toEqualTypeOf<ExtendedInput>()
      },
    }),
  ).toEqualTypeOf<() => void>()
  // @ts-expect-error custom properties are not part of the generated writable interface
  expectTypeOf<typeof bind<ExtendedInput>>().toBeCallableWith(new ExtendedInput(), { custom: true })
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  expectTypeOf<typeof bind<SVGCircleElement>>().toBeCallableWith(circle, {
    class: 'circle',
    style: { fill: 'red' },
  })
})
