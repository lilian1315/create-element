/**
 * @module @lilian1315/create-element/alien-signals
 * @description Reactive DOM element creation with [alien-signals](https://github.com/stackblitz/alien-signals) integration.
 *
 * @example
 * ```typescript
 * import { h } from '@lilian1315/create-element/alien-signals'
 * import { computed, signal } from 'alien-signals'
 *
 * const count = signal(0)
 * const label = computed(() => `Count: ${count()}`)
 *
 * const counter = h('section', { class: 'counter' }, [
 *   h('p', null, label),
 *   h('button', { onclick: () => count(count() + 1) }, 'Increment'),
 * ])
 * ```
 */

import type { ElementPrefixedTagNameMap, PrefixedElementTag, Prettify } from '../types'
import type { Children, ElementAttributesTagNameMap, WithChildren, WithInnerHTML } from './types'
import { setActiveSub } from 'alien-signals'
import { handleAnySignalAttribute, handleClassSignalAttribute, handleDataSignalAttribute, handleSignalChildren, handleStyleSignalAttribute } from './utils'

/**
 * Creates a DOM element with [alien-signals](https://github.com/stackblitz/alien-signals) aware attributes, styles, datasets, and innerHTML.
 * @param tag Element tag name including SVG/MathML prefixes.
 * @param attributes Optional attribute bag that can contain reactive `class`, `style`, `data`, and `innerHTML` props. Cannot have children when innerHTML is set.
 */
export function createElement<T extends PrefixedElementTag>(tag: T, attributes: Prettify<WithInnerHTML<ElementAttributesTagNameMap[T]>>): ElementPrefixedTagNameMap[T]
/**
 * Creates a DOM element with [alien-signals](https://github.com/stackblitz/alien-signals) aware attributes, styles, datasets, and children.
 * @param tag Element tag name including SVG/MathML prefixes.
 * @param attributes Optional attribute bag that can contain reactive `class`, `style`, `data`, and `children` props.
 * @param children Additional children appended after `attributes.children`.
 */
export function createElement<T extends PrefixedElementTag>(tag: T, attributes?: Prettify<WithChildren<ElementAttributesTagNameMap[T]>> | null, ...children: Children[]): ElementPrefixedTagNameMap[T]
export function createElement<T extends PrefixedElementTag>(tag: T, attributes?: Prettify<ElementAttributesTagNameMap[T]> | null, ...children: Children[]): ElementPrefixedTagNameMap[T] {
  let element: ElementPrefixedTagNameMap[T]

  if (tag === 'svg' || tag.startsWith('svg:')) {
    element = document.createElementNS('http://www.w3.org/2000/svg', tag === 'svg' ? 'svg' : tag.substring(4)) as ElementPrefixedTagNameMap[T]
  } else if (tag === 'math' || tag.startsWith('math:')) {
    element = document.createElementNS('http://www.w3.org/1998/Math/MathML', tag === 'math' ? 'math' : tag.substring(5)) as ElementPrefixedTagNameMap[T]
  } else {
    element = document.createElement(tag) as ElementPrefixedTagNameMap[T]
  }

  const prevSub = setActiveSub()

  if (attributes) {
    for (const name of Reflect.ownKeys(attributes)) {
      if (name === 'children') {
        if (Array.isArray(attributes.children)) {
          attributes.children.forEach((child) => handleSignalChildren(element, child))
        } else {
          handleSignalChildren(element, attributes.children)
        }
        continue
      }

      if (name === 'class' && attributes.class) {
        handleClassSignalAttribute(element, attributes.class)
        continue
      }

      if (name === 'style' && attributes.style) {
        handleStyleSignalAttribute(element, attributes.style)
        continue
      }

      if (name === 'data' && attributes.data) {
        handleDataSignalAttribute(element, attributes.data)
        continue
      }

      handleAnySignalAttribute(element, name, attributes[name])
    }
  }

  children.forEach((child) => handleSignalChildren(element, child))

  setActiveSub(prevSub)

  return element
}

/**
 * Shorthand alias for {@link createElement} to align with JSX/hyperscript expectations.
 */
export const h = createElement
