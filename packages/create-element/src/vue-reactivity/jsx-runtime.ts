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
import { computed } from '@vue/reactivity'

import { childValueToNodes } from '../reactive-element'
import { getReactiveValue } from '../reactivity'
import type { DomElement, PrefixedElementTag, Prettify } from '../types'
import { h } from './index'
import { reactivityAdapter } from './reactivity'
import type { Children, ElementAttributesTagNameMap } from './types'

/**
 * Component used to group children without introducing an extra DOM node when using JSX.
 */
export const Fragment: JSX.ElementClass = ({ children }: { children?: Children | Children[] }) => {
  return computed(() => {
    const values = Array.isArray(children) ? children.flat() : [children]

    return values.flatMap((child) => childValueToNodes(getReactiveValue(reactivityAdapter, child)))
  })
}

/**
 * JSX factory compatible with @vue/reactivity.
 */
export function jsx(
  type: PrefixedElementTag | JSX.ElementClass,
  props: JSX.IntrinsicAttributes,
  __key: unknown,
  __isStaticChildren: unknown,
  __source: unknown,
  __self: unknown,
): JSX.Element {
  if (typeof type === 'function') return type(props)
  return h(type, props)
}

/**
 * Alias of {@link jsx} used when JSX compilers emit batched static children helpers.
 */
export const jsxs = jsx

/**
 * Development-time alias of {@link jsx} used by tooling that differentiates prod/dev JSX runtimes.
 */
export const jsxDEV = jsx

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
