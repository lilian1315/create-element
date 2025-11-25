/**
 * JSX runtime for @lilian1315/create-element - provides JSX support for type-safe DOM element creation.
 *
 * This module implements the JSX runtime interface allowing you to use JSX syntax with TypeScript.
 * Configure your tsconfig.json with:
 * ```json
 * {
 *   "compilerOptions": {
 *     "jsx": "react-jsx",
 *     "jsxImportSource": "@lilian1315/create-element"
 *   }
 * }
 * ```
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <div class="container">
 *       <h1>My App</h1>
 *       <button onclick={() => console.log('clicked')}>
 *         Click me
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @module
 */

import type { Children, DomElement, ElementAttributesTagNameMap, PrefixedElementTag, Prettify } from './types'
import { h } from './index'
import { childrenToNodes } from './utils'

/**
 * Symbol used to group children without introducing an extra DOM node when using JSX.
 */
export const Fragment = Symbol('Fragment')

/**
 * JSX factory
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
  if (type === Fragment) return childrenToNodes(Array.isArray(props.children) ? props.children.flat() : props.children)
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
  export type Fragment = Node[]
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
