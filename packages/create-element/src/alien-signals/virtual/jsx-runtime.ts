import type { PrefixedElementTag, Prettify } from '../../types'
import type { VNode } from '../../virtual/types'
import { createVNodeObject } from '../../virtual/vnode'
import type { FunctionComponent, VNodeChildren, VNodePropsTagNameMap, VNodeType } from './types'

export const Fragment: FunctionComponent<{ children?: VNodeChildren }> = (props) => props.children

export function jsx(type: VNodeType, props: JSX.IntrinsicAttributes, key?: unknown): VNode {
  return createVNodeObject(type, props, [], key)
}

export const jsxs = jsx
export const jsxDEV = jsx

export namespace JSX {
  export type Element = VNode
  export type ElementType = PrefixedElementTag | FunctionComponent<never>

  export interface ElementChildrenAttribute {
    children: unknown
  }

  export interface IntrinsicAttributes {
    children?: VNodeChildren
    key?: string | number
    [key: string | symbol]: unknown
  }

  export type IntrinsicElements = {
    [T in PrefixedElementTag]: Prettify<VNodePropsTagNameMap[T]>
  }
}
