/**
 * JSX runtime for `@lilian1315/create-element/virtual`.
 *
 * Configure TypeScript with `jsx: "react-jsx"` and
 * `jsxImportSource: "@lilian1315/create-element/virtual"`.
 */

import type { PrefixedElementTag, Prettify } from '../types'
import type {
  FunctionComponent,
  VNode,
  VNodeChildren,
  VNodePropsTagNameMap,
  VNodeType,
} from './types'
import { createVNodeObject } from './vnode'

export const Fragment: FunctionComponent<{ children?: VNodeChildren }> = (props) => props.children

/** JSX factory used by TypeScript's automatic JSX transform. */
export function jsx(
  type: VNodeType,
  props: JSX.IntrinsicAttributes,
  key?: unknown,
  __isStaticChildren?: unknown,
  __source?: unknown,
  __self?: unknown,
): VNode {
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
