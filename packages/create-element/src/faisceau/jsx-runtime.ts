/**
 * Reactive JSX runtime for @lilian1315/create-element with faisceau integration.
 *
 * This module provides JSX support with reactive programming capabilities using faisceau.
 * It enables automatic reactivity for signals and computed values in JSX expressions.
 *
 * Configure your tsconfig.json for reactive JSX:
 * ```json
 * {
 *   "compilerOptions": {
 *     "jsx": "react-jsx",
 *     "jsxImportSource": "@lilian1315/create-element/faisceau"
 *   }
 * }
 * ```
 *
 * @example
 * ```tsx
 * import { signal } from 'faisceau'
 *
 * function Counter({ initialCount = 0 }) {
 *   const count = signal(initialCount)
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onclick={() => count.set(count.get() + 1)}>
 *         Increment
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @module
 */

import type { Computed } from 'faisceau'
import type { DomElement, PrefixedElementTag, Prettify } from '../types'
import type { Children, ElementAttributesTagNameMap } from './types'
import { computed, isComputed, isSignal } from 'faisceau'
import { childrenToNodes } from '../utils'
import { h } from './index'
import { reactiveChildrenToNodes } from './utils'

export const Fragment = Symbol('Fragment')

export function jsx<T extends PrefixedElementTag | JSX.ElementClass | typeof Fragment = PrefixedElementTag>(
  type: T,
  props: JSX.IntrinsicAttributes,
  __key: unknown,
  __isStaticChildren: unknown,
  __source: unknown,
  __self: unknown,
): JSX.Element {
  if (typeof type === 'function') return type(props)
  if (type === Fragment) {
    return computed(() => {
      const children = Array.isArray(props.children) ? props.children.flat() : [props.children]

      return children.flatMap((child) => {
        if (isSignal(child) || isComputed(child)) return reactiveChildrenToNodes(child)
        else return childrenToNodes(child)
      })
    })
  }
  return h<PrefixedElementTag>(type, props)
}

export const jsxs = jsx
export const jsxDEV = jsx

// eslint-disable-next-line ts/no-namespace
export namespace JSX {
  export type Fragment = Computed<Node[]>
  export type Element = DomElement | Fragment
  export type ElementClass = (props: IntrinsicAttributes) => Element
  export interface IntrinsicAttributes {
    children?: Children | Children[]
    [key: string | symbol]: unknown
  }
  export type IntrinsicElements = {
    [T in PrefixedElementTag]: Prettify<ElementAttributesTagNameMap[T]>
  }
}
