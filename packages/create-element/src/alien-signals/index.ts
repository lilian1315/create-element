import type { ElementPrefixedTagNameMap, PrefixedElementTag, Prettify } from '../types'
import type { Children, ElementAttributesTagNameMap } from './types'
import { handleAnySignalAttribute, handleClassSignalAttribute, handleDataSignalAttribute, handleSignalChildren, handleStyleSignalAttribute } from './utils'

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

  return element
}

export const h = createElement
