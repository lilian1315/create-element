/** @jsxImportSource @lilian1315/create-element/preact-signals */

import { h as baseH } from '@lilian1315/create-element'
import { h as deepH } from '@lilian1315/create-element/alien-deepsignals'
import { h as alienH } from '@lilian1315/create-element/alien-signals'
import { h as faisceauH } from '@lilian1315/create-element/faisceau'
import type {
  Component,
  VNodeChild,
  VNodeChildValue,
  VNodeProps,
} from '@lilian1315/create-element/preact-signals'
import { h } from '@lilian1315/create-element/preact-signals'
import { bind } from '@lilian1315/create-element/preact-signals/dom'
import { renderToString } from '@lilian1315/create-element/preact-signals/server'
import { h as vueH } from '@lilian1315/create-element/vue-reactivity'
import { computed, signal } from '@preact/signals-core'
import { shallowRef } from '@vue/reactivity'
import { signal as deepSignal } from 'alien-deepsignals'
import { signal as alienSignal } from 'alien-signals'
import { signal as faisceauSignal } from 'faisceau'
import { expectTypeOf, it } from 'vite-plus/test'

it('checks native source payloads and writable element props', () => {
  const component: Component<{ children?: VNodeChild }> = ({ children }) => h('div', { children })
  const props: VNodeProps<'input'> = { value: signal('typed'), checked: computed(() => true) }
  h('input', props)
  component({ children: signal('child') })
  const content = signal<VNodeChildValue>([h('span'), signal('nested')])
  h('div', { children: content })
  renderToString(content)

  // @ts-expect-error a boolean prop needs a boolean source
  h('button', { disabled: signal('false') })
  // @ts-expect-error listeners must resolve to functions
  h('button', { onclick: signal(42) })
  // @ts-expect-error a source must resolve to valid tree children
  h('div', { children: signal({}) })
  // @ts-expect-error unknown payloads cannot bypass child checks
  h('div', { children: signal<unknown>('text') })
  // @ts-expect-error raw HTML must resolve to a string
  h('div', { innerHTML: signal(1) })
  // @ts-expect-error class flags must resolve to booleans
  h('div', { class: { active: signal('yes') } })
  // @ts-expect-error dataset values cannot resolve to numbers
  h('div', { data: { count: signal(1) } })
  // @ts-expect-error CSS color must resolve to a string
  h('div', { style: { color: signal(1) } })
  // @ts-expect-error JSX uses the same payload constraints
  const invalidJsx = <button disabled={signal('false')} />
  expectTypeOf(invalidJsx).toEqualTypeOf<
    import('@lilian1315/create-element/preact-signals').VNode
  >()

  const input = document.createElement('input')
  expectTypeOf<VNodeProps<HTMLInputElement>>().toEqualTypeOf<VNodeProps<'input'>>()
  expectTypeOf<VNodeProps<SVGCircleElement>>().toEqualTypeOf<VNodeProps<'svg:circle'>>()
  bind<HTMLInputElement>(input, props)
  // @ts-expect-error an explicit input type requires an input element
  bind<HTMLInputElement>(document.createElement('div'), props)
  // @ts-expect-error an explicit element type still checks signal payloads
  bind<HTMLInputElement>(input, { checked: signal('yes') })
  bind(input, {
    value: signal('value'),
    checked: computed(() => true),
    ref: (node) => {
      expectTypeOf(node).toEqualTypeOf<HTMLInputElement>()
    },
  })
  // @ts-expect-error input value is a string
  bind(input, { value: {} })
  // @ts-expect-error input checked is boolean
  bind(input, { checked: 'yes' })
  // @ts-expect-error bind checks native signal payloads too
  bind(input, { checked: signal('yes') })
  // @ts-expect-error bind retains the exclusive content union
  bind(input, { children: 'text', innerHTML: '<b>raw</b>' })
  // @ts-expect-error unrelated tag properties are not accepted
  bind(document.createElement('div'), { checked: true })
  // @ts-expect-error native readonly properties are not bindable
  bind(input, { nodeType: 1 })

  class CustomInput extends HTMLInputElement {}
  bind(new CustomInput(), { value: signal('subclass') })
  class ExtendedInput extends HTMLInputElement {
    custom = true
  }
  bind(new ExtendedInput(), {
    value: signal('extended subclass'),
    ref: (node) => {
      expectTypeOf(node).toEqualTypeOf<ExtendedInput>()
    },
  })
  // @ts-expect-error custom properties are not part of the generated writable interface
  bind(new ExtendedInput(), { custom: true })
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  bind(circle, { class: 'circle', style: { fill: signal('red') } })

  // Every integration specializes Source<T>, not just the Preact declarations.
  deepH('button', { disabled: deepSignal(false), children: deepSignal('valid') })
  alienH('button', { disabled: alienSignal(false), children: alienSignal('valid') })
  faisceauH('button', { disabled: faisceauSignal(false), children: faisceauSignal('valid') })
  vueH('button', { disabled: shallowRef(false), children: shallowRef('valid') })
  // @ts-expect-error alien-deepsignals retains the prop payload type
  deepH('button', { disabled: deepSignal('false') })
  // @ts-expect-error alien-signals retains the prop payload type
  alienH('button', { disabled: alienSignal('false') })
  // @ts-expect-error faisceau retains the prop payload type
  faisceauH('button', { disabled: faisceauSignal('false') })
  // @ts-expect-error vue retains the prop payload type
  vueH('button', { disabled: shallowRef('false') })
  // @ts-expect-error the plain build does not accept reactive props
  baseH('button', { disabled: signal(false) })
})
