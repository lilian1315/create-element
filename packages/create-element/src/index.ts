import type { Children, ElementAttributesTagNameMap, ElementPrefixedTagNameMap, PrefixedElementTag, Prettify, WithChildren, WithInnerHTML } from './types'
import { handleAnyAttribute, handleChildren, handleClassAttribute, handleDataAttribute, handleStyleAttribute } from './utils'

/**
 * Creates a DOM element (HTML, SVG, or MathML) with type-safe attributes and children handling.
 * @param tag Element tag name, optionally prefixed with `svg:` or `math:` for namespace aware nodes.
 * @param attributes Optional attribute bag including `class`, `style`, `data` and `innerHTML` helpers. Cannot have children when innerHTML is set.
 */
export function createElement<T extends PrefixedElementTag>(tag: T, attributes: Prettify<WithInnerHTML<ElementAttributesTagNameMap[T]>>): ElementPrefixedTagNameMap[T]
/**
 * Creates a DOM element (HTML, SVG, or MathML) with type-safe attributes and children handling.
 * @param tag Element tag name, optionally prefixed with `svg:` or `math:` for namespace aware nodes.
 * @param attributes Optional attribute bag including `class`, `style`, `data`, and `children` helpers.
 * @param children Additional child nodes appended after `attributes.children`.
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

  if (attributes) {
    for (const name of Reflect.ownKeys(attributes)) {
      if (name === 'children') {
        if (Array.isArray(attributes.children)) attributes.children.forEach((subChildren) => handleChildren(element, subChildren))
        else handleChildren(element, attributes.children)
        continue
      }

      if (name === 'class' && attributes.class) {
        handleClassAttribute(element, attributes.class)
        continue
      }

      if (name === 'style' && attributes.style) {
        handleStyleAttribute(element, attributes.style)
        continue
      }

      if (name === 'data' && attributes.data) {
        handleDataAttribute(element, attributes.data)
        continue
      }

      handleAnyAttribute(element, name, attributes[name])
    }
  }

  children.forEach((subChildren) => handleChildren(element, subChildren))

  return element
}

/**
 * Shorthand alias for {@link createElement} to align with JSX/hyperscript expectations.
 */
export const h = createElement
