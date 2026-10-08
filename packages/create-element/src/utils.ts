import type { DomElement, ElementPrefixedTagNameMap, PrefixedElementTag } from './types'

export function createBaseElement<T extends PrefixedElementTag>(
  tag: T,
): ElementPrefixedTagNameMap[T]
export function createBaseElement(tag: PrefixedElementTag): DomElement {
  if (tag === 'svg' || tag.startsWith('svg:')) {
    return document.createElementNS(
      'http://www.w3.org/2000/svg',
      tag === 'svg' ? 'svg' : tag.substring(4),
    )
  }
  if (tag === 'math' || tag.startsWith('math:')) {
    return document.createElementNS(
      'http://www.w3.org/1998/Math/MathML',
      tag === 'math' ? 'math' : tag.substring(5),
    )
  }
  return document.createElement(tag)
}

export function handleAnyAttribute(
  element: DomElement,
  key: string | symbol,
  value: unknown,
): void {
  if (key in element || typeof key === 'symbol') {
    if ((value === undefined || value === null) && typeof key !== 'symbol') return
    try {
      Reflect.set(element, key, value)
    } catch {}
  } else if (value !== null && value !== undefined) {
    // oxlint-disable-next-line typescript/no-base-to-string
    element.setAttribute(key, String(value))
  }
}
