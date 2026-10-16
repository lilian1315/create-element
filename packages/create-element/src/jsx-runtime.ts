import { createElement, createFragment } from './dom'
import type { Child, ElementPropsMap, JSXComponent, PrefixedElementTag, Props } from './types'

/** Groups children into a live, consumable DOM fragment. */
export function Fragment(props: { children?: Child }): DocumentFragment {
  return createFragment(props.children)
}

/** Creates an intrinsic element or executes a DOM component immediately. */
export function jsx(
  type: PrefixedElementTag | JSXComponent,
  props: Props | null,
  _key?: unknown,
): Node {
  if (typeof type === 'string') return createElement(type, props)
  const result = type(props ?? {})
  return result instanceof Node ? result : createFragment(result)
}

export const jsxs = jsx
export const jsxDEV = jsx

export namespace JSX {
  export type Element = Node
  export type ElementType = PrefixedElementTag | JSXComponent
  export interface ElementChildrenAttribute {
    children: unknown
  }
  export interface IntrinsicAttributes {
    key?: string | number
  }
  export type IntrinsicElements = ElementPropsMap
}
