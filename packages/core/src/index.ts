import type { ElementAttributesTagNameMap, ElementPrefixedTagNameMap, PrefixedElementTag } from "./types"
import { handleAttribute, handleChildren } from "./utils"

export function el<K extends PrefixedElementTag>(tag: K, attributes?: ElementAttributesTagNameMap[K] | null, ...children: NonNullable<ElementAttributesTagNameMap[K]['children']>): ElementPrefixedTagNameMap[K] {
    let element: ElementPrefixedTagNameMap[K]

    if (tag === 'svg' || tag.startsWith('svg:')) {
        element = document.createElementNS("http://www.w3.org/2000/svg", tag.substring(4)) as ElementPrefixedTagNameMap[K]
    } else if (tag === 'math' || tag.startsWith('math:')) {
        element = document.createElementNS("http://www.w3.org/1998/Math/MathML", tag.substring(5)) as ElementPrefixedTagNameMap[K]
    } else {
        element = document.createElement(tag) as ElementPrefixedTagNameMap[K]
    }

    if (attributes) {
      for (let key of Reflect.ownKeys(attributes)) {
          if(key === 'children') {
              attributes.children?.forEach((subChildren) => handleChildren(element, subChildren))
          } else {
              handleAttribute(element, key, attributes[key])
          }
      }
    }

    children.forEach((subChildren) => handleChildren(element, subChildren))

    return element
}
