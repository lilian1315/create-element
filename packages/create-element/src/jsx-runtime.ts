import type {
  Component,
  PrefixedElementTag,
  VNodeChild,
  VNodePropsMap,
  VNode,
  VNodeType,
} from './types'
import { createVNodeObject } from './vnode'

/** Shared JSX implementation used by every integration. */
export function jsx(type: VNodeType, props: object | null, key?: unknown): VNode {
  return createVNodeObject(type, props, key)
}

export const jsxs = jsx
export const jsxDEV = jsx
export const Fragment: Component<{ children?: VNodeChild }> = (props) => props.children

export namespace JSX {
  export type Element = VNode
  export type ElementType = PrefixedElementTag | Component<never>
  export interface ElementChildrenAttribute {
    children: unknown
  }
  export interface IntrinsicAttributes {
    key?: string | number
  }
  export type IntrinsicElements = VNodePropsMap
}
