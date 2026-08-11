/**
 * @module @lilian1315/create-element/faisceau
 * @description Reactive DOM element creation with [faisceau](https://github.com/lilian1315/faisceau) integration.
 *
 * @example
 * ```typescript
 * import { h } from '@lilian1315/create-element/faisceau'
 * import { computed, signal } from 'faisceau'
 *
 * const count = signal(0)
 * const label = computed(() => `Count: ${count.get()}`)
 *
 * const counter = h('section', null, [
 *   h('p', null, label),
 *   h('button', { onclick: () => count.set(count.get() + 1) }, 'Increment'),
 * ])
 * ```
 */

import { createReactiveElement } from '../reactive-element'
import type { ElementPrefixedTagNameMap, PrefixedElementTag, Prettify } from '../types'
import { reactivityAdapter } from './reactivity'
import type { Children, ElementAttributesTagNameMap, WithChildren, WithInnerHTML } from './types'

/**
 * Creates a DOM element with [faisceau](https://github.com/lilian1315/faisceau) aware attributes, styles, datasets, and innerHTML.
 * @param tag Element tag name including SVG/MathML prefixes.
 * @param attributes Optional attribute bag that can contain reactive `class`, `style`, `data`, and `innerHTML` props. Cannot have children when innerHTML is set.
 */
export function createElement<T extends PrefixedElementTag>(
  tag: T,
  attributes: Prettify<WithInnerHTML<ElementAttributesTagNameMap[T]>>,
): ElementPrefixedTagNameMap[T]
/**
 * Creates a DOM element with [faisceau](https://github.com/lilian1315/faisceau) aware attributes, styles, datasets, and children.
 * @param tag Element tag name including SVG/MathML prefixes.
 * @param attributes Optional attribute bag that can contain reactive `class`, `style`, `data`, and `children` props.
 * @param children Additional children appended after `attributes.children`.
 */
export function createElement<T extends PrefixedElementTag>(
  tag: T,
  attributes?: Prettify<WithChildren<ElementAttributesTagNameMap[T]>> | null,
  ...children: Children[]
): ElementPrefixedTagNameMap[T]
export function createElement<T extends PrefixedElementTag>(
  tag: T,
  attributes?: Prettify<ElementAttributesTagNameMap[T]> | null,
  ...children: Children[]
): ElementPrefixedTagNameMap[T] {
  return createReactiveElement(reactivityAdapter, tag, attributes, children)
}

/**
 * Shorthand alias for {@link createElement} to align with JSX/hyperscript expectations.
 */
export const h = createElement
