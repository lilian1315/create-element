import { describe, expect, it } from 'vite-plus/test'

import { h } from '../src/index'
import { isVNode } from '../src/vnode'

describe('VNode identity', () => {
  it('recognizes created and spread VNodes', () => {
    const vnode = h('div')
    expect(isVNode(vnode)).toBe(true)
    expect(isVNode({ ...vnode })).toBe(true)
  })

  it('rejects structural lookalikes and independently created symbols', () => {
    expect(isVNode({ type: 'div', props: {}, key: null, constructor: undefined })).toBe(false)
    expect(isVNode({ [Symbol('create-element.vnode')]: true, type: 'div', props: {} })).toBe(false)
    expect(isVNode(null)).toBe(false)
    expect(isVNode(undefined)).toBe(false)
    expect(isVNode('div')).toBe(false)
  })
})
