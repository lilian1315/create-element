import type {
  Children,
  ElementAttributesTagNameMap,
  ElementPrefixedTagNameMap,
  PrefixedElementTag,
  Prettify,
  WithoutInnerHTML,
  WithoutChildren,
} from './types'
import { applyAttributes, createBaseElement, handleChildren } from './utils'

/**
 * Creates a DOM element (HTML, SVG, or MathML) with type-safe attributes and children handling.
 * @param tag Element tag name, optionally prefixed with `svg:` or `math:` for namespace aware nodes.
 * @param attributes Optional attribute bag including `class`, `style`, `data` and `innerHTML` helpers. Cannot have children when innerHTML is set.
 */
export function createElement<T extends PrefixedElementTag>(
  tag: T,
  attributes: Prettify<WithoutChildren<ElementAttributesTagNameMap[T]>>,
): ElementPrefixedTagNameMap[T]
/**
 * Creates a DOM element (HTML, SVG, or MathML) with type-safe attributes and children handling.
 * @param tag Element tag name, optionally prefixed with `svg:` or `math:` for namespace aware nodes.
 * @param attributes Optional attribute bag including `class`, `style`, `data`, and `children` helpers.
 * @param children Additional child nodes appended after `attributes.children`.
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
  const element = createBaseElement(tag)

  if (attributes) applyAttributes(element, attributes, handleChildren)

  children.forEach((subChildren) => handleChildren(element, subChildren))

  return element
}

/**
 * Shorthand alias for {@link createElement} to align with JSX/hyperscript expectations.
 */
export const h = createElement
