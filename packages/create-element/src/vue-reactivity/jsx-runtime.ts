/**
 * Reactive JSX runtime for @lilian1315/create-element with @vue/reactivity integration.
 *
 * This module provides JSX support with reactive programming capabilities using @vue/reactivity.
 * It enables automatic reactivity for refs and computed values in JSX expressions.
 *
 * Configure your tsconfig.json for reactive JSX:
 * ```json
 * {
 *   "compilerOptions": {
 *     "jsx": "react-jsx",
 *     "jsxImportSource": "@lilian1315/create-element/vue-reactivity"
 *   }
 * }
 * ```
 *
 * @example
 * ```tsx
 * import { ref } from '@vue/reactivity'
 *
 * function Counter({ initialCount = 0 }) {
 *   const count = ref(initialCount)
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onclick={() => count.value = count.value + 1}>
 *         Increment
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @module
 * @requires @vue/reactivity
 */

import type { ComputedRef } from '@vue/reactivity'
import type { DomElement, PrefixedElementTag, Prettify } from '../types'
import type { Children, ElementAttributesTagNameMap } from './types'
import { computed, isRef } from '@vue/reactivity'
import { childrenToNodes } from '../utils'
import { h } from './index'
import { reactiveChildrenToNodes } from './utils'

/**
 * Symbol used to group children without introducing an extra DOM node when using JSX.
 */
export const Fragment = Symbol('Fragment')

/**
 * JSX factory compatible with @vue/reactivity.
 */
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
        if (isRef(child)) return reactiveChildrenToNodes(child)
        else return childrenToNodes(child)
      })
    })
  }
  return h<PrefixedElementTag>(type, props)
}

/**
 * Alias of {@link jsx} used when JSX compilers emit batched static children helpers.
 */
export const jsxs = jsx

/**
 * Development-time alias of {@link jsx} used by tooling that differentiates prod/dev JSX runtimes.
 */
export const jsxDEV = jsx

// eslint-disable-next-line ts/no-namespace
export namespace JSX {
  export type Fragment = ComputedRef<Node[]>
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
