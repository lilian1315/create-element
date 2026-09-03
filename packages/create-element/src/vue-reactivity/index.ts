/**
 * @module @lilian1315/create-element/vue-reactivity
 * @description Reactive DOM element creation with [@vue/reactivity](https://github.com/vuejs/core/tree/main/packages/reactivity) integration.
 *
 * @example
 * ```typescript
 * import { h } from '@lilian1315/create-element/vue-reactivity'
 * import { computed, ref } from '@vue/reactivity'
 *
 * const count = ref(0)
 * const label = computed(() => `Count: ${count.value}`)
 *
 * const counter = h('section', null, [
 *   h('p', null, label),
 *   h('button', { onclick: () => count.value++ }, 'Increment'),
 * ])
 * ```
 */

import { createReactiveElement } from '../reactive-element'
import type {
  ElementPrefixedTagNameMap,
  PrefixedElementTag,
  Prettify,
  WithoutChildren,
  WithoutInnerHTML,
} from '../types'
import { reactivityAdapter } from './reactivity'
import type { Children, ElementAttributesTagNameMap } from './types'

/**
 * Creates a DOM element with [@vue/reactivity](https://github.com/vuejs/core/tree/main/packages/reactivity) aware attributes, styles, datasets, and innerHTML.
 * @param tag Element tag name including SVG/MathML prefixes.
 * @param attributes Optional attribute bag that can contain reactive `class`, `style`, `data`, and `innerHTML` props. Cannot have children when innerHTML is set.
 */
export function createElement<T extends PrefixedElementTag>(
  tag: T,
  attributes: Prettify<WithoutChildren<ElementAttributesTagNameMap[T]>>,
): ElementPrefixedTagNameMap[T]
/**
 * Creates a DOM element with [@vue/reactivity](https://github.com/vuejs/core/tree/main/packages/reactivity) aware attributes, styles, datasets, and children.
 * @param tag Element tag name including SVG/MathML prefixes.
 * @param attributes Optional attribute bag that can contain reactive `class`, `style`, `data`, and `children` props.
 * @param children Additional children appended after `attributes.children`.
 */
export function createElement<T extends PrefixedElementTag>(
  tag: T,
  attributes?: Prettify<WithoutInnerHTML<ElementAttributesTagNameMap[T]>> | null,
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
