import { describe, expectTypeOf, it } from 'vitest'

import { h, mount } from '../src/virtual/index'
import type { VNode } from '../src/virtual/types'

describe('virtual node types', () => {
  it('keeps innerHTML and children mutually exclusive', () => {
    const innerHTML = 'text <span>in span</span>'

    // @ts-expect-error innerHTML and props.children cannot be used together
    h('div', { innerHTML, children: 'text' })

    // @ts-expect-error innerHTML and children arguments cannot be used together
    h('div', { innerHTML }, 'text')
  })

  it('supports components, boolean children, and every mount root shape', () => {
    const Greeting = ({ name }: { name: string }) => h('strong', null, name)
    const component = h(Greeting, { name: 'Ada' })

    expectTypeOf(component).toExtend<VNode>()
    h('div', null, false, 0, component)
    mount(document.createElement('main'), component)
    mount(document.createElement('main'), [component, null, false])

    // @ts-expect-error required component prop is missing
    h(Greeting, {})
  })
})
