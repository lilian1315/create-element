import type {
  Component,
  JSXComponent,
  PrefixedElementTag,
  Child,
  VNodePropsMap,
  VNode,
  VNodeType,
} from '../types'
import { createVNode } from '../vnode'

/** Shared JSX implementation used by every integration. */
export function jsx(type: VNodeType, props: object | null, key?: unknown): VNode {
  return createVNode(type, props, key)
}

export const jsxs = jsx
export const jsxDEV = jsx
export const Fragment: Component<{ children?: Child }> = (props) => props.children

export namespace JSX {
  export type Element = VNode
  export type ElementType = PrefixedElementTag | JSXComponent
  export interface ElementChildrenAttribute {
    children: unknown
  }
  export interface IntrinsicAttributes {
    key?: string | number
  }
  export type IntrinsicElements = VNodePropsMap
}
