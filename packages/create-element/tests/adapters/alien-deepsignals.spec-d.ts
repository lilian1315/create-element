import {
  h,
  type Component,
  type VNodeChild,
  type VNodeChildValue,
  type VNodeProps,
} from '@lilian1315/create-element/alien-deepsignals'
import { bind, build } from '@lilian1315/create-element/alien-deepsignals/dom'
import { renderToString } from '@lilian1315/create-element/alien-deepsignals/server'
import { computed, signal } from 'alien-deepsignals'
import { expectTypeOf, it } from 'vite-plus/test'

it('accepts native sources in props, components, nested children, and SSR', () => {
  const component: Component<{ children?: VNodeChild }> = ({ children }) => h('div', { children })
  const props: VNodeProps<'input'> = { value: signal('typed'), checked: computed(() => true) }
  expectTypeOf<typeof h<'input'>>().toBeCallableWith('input', props)
  expectTypeOf<typeof component>().toBeCallableWith({ children: signal('child') })
  const content = signal<VNodeChildValue>([h('span'), signal('nested')])
  expectTypeOf<typeof h<'div'>>().toBeCallableWith('div', { children: content })
  expectTypeOf<typeof renderToString>().toBeCallableWith(content).returns.toBeString()
  expectTypeOf<typeof h<'button'>>().toBeCallableWith('button', {
    disabled: signal(false),
    children: signal('valid'),
  })
})

it('rejects invalid native source payloads', () => {
  // @ts-expect-error a boolean prop needs a boolean source
  expectTypeOf<typeof h<'button'>>().toBeCallableWith('button', { disabled: signal('false') })
  // @ts-expect-error listeners must resolve to functions
  expectTypeOf<typeof h<'button'>>().toBeCallableWith('button', { onclick: signal(42) })
  // @ts-expect-error a source must resolve to valid tree children
  expectTypeOf<typeof h<'div'>>().toBeCallableWith('div', { children: signal({}) })
  // @ts-expect-error unknown payloads cannot bypass child checks
  expectTypeOf<typeof h<'div'>>().toBeCallableWith('div', { children: signal<unknown>('text') })
  // @ts-expect-error raw HTML must resolve to a string
  expectTypeOf<typeof h<'div'>>().toBeCallableWith('div', { innerHTML: signal(1) })
  // @ts-expect-error class flags must resolve to booleans
  expectTypeOf<typeof h<'div'>>().toBeCallableWith('div', { class: { active: signal('yes') } })
  // @ts-expect-error dataset values cannot resolve to numbers
  expectTypeOf<typeof h<'div'>>().toBeCallableWith('div', { data: { count: signal(1) } })
  // @ts-expect-error CSS color must resolve to a string
  expectTypeOf<typeof h<'div'>>().toBeCallableWith('div', { style: { color: signal(1) } })
})

it('binds native sources to elements and subclasses with inferred refs', () => {
  const input = document.createElement('input')
  const props: VNodeProps<'input'> = { value: signal('typed'), checked: computed(() => true) }
  expectTypeOf<typeof bind<HTMLInputElement>>().toBeCallableWith(input, props)
  // @ts-expect-error an explicit element type still checks signal payloads
  expectTypeOf<typeof bind<HTMLInputElement>>().toBeCallableWith(input, { checked: signal('yes') })
  expectTypeOf(
    bind(input, {
      value: signal('value'),
      checked: computed(() => true),
      ref: (node) => {
        expectTypeOf(node).toEqualTypeOf<HTMLInputElement>()
      },
    }),
  ).toEqualTypeOf<() => void>()
  // @ts-expect-error inferred bind checks native signal payloads too
  bind(input, { checked: signal('yes') })
  class CustomInput extends HTMLInputElement {}
  expectTypeOf<typeof bind<CustomInput>>().toBeCallableWith(new CustomInput(), {
    value: signal('subclass'),
  })
  class ExtendedInput extends HTMLInputElement {
    custom = true
  }
  expectTypeOf(
    bind(new ExtendedInput(), {
      value: signal('extended subclass'),
      ref: (node) => {
        expectTypeOf(node).toEqualTypeOf<ExtendedInput>()
      },
    }),
  ).toEqualTypeOf<() => void>()
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  expectTypeOf<typeof bind<SVGCircleElement>>().toBeCallableWith(circle, {
    class: 'circle',
    style: { fill: signal('red') },
  })
})

it('infers the bound element type in refs', () => {
  const button = build(h('button'))
  expectTypeOf(
    bind(button, {
      ref: (element) => {
        expectTypeOf(element).toEqualTypeOf<HTMLButtonElement>()
      },
    }),
  ).toEqualTypeOf<() => void>()
})

it('accepts computed sources in h and bind and checks their payloads', () => {
  const derived = computed(() => 'derived')
  expectTypeOf<typeof h<'button'>>().toBeCallableWith('button', {
    title: derived,
    children: derived,
  })
  expectTypeOf<typeof bind<HTMLButtonElement>>().toBeCallableWith(
    document.createElement('button'),
    { title: derived },
  )
  expectTypeOf<typeof bind<HTMLInputElement>>().toBeCallableWith(document.createElement('input'), {
    checked: computed(() => true),
  })
  expectTypeOf<typeof bind<HTMLInputElement>>().toBeCallableWith(document.createElement('input'), {
    // @ts-expect-error a boolean prop needs a boolean computed source
    checked: derived,
  })
})
