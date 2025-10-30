import type { ElementAttributes, ElementFromPrefixedTag, PrefixedElementTag } from "./types"
import { handleAttribute, handleChildren } from "./utils"

export function el<K extends PrefixedElementTag>(tag: K, attributes?: ElementAttributes<K> | null, ...children: NonNullable<ElementAttributes<K>['children']>): ElementFromPrefixedTag<K> {
    let element: ElementFromPrefixedTag<K>

    if (tag === 'svg' || tag.startsWith('svg:')) {
        element = document.createElementNS("http://www.w3.org/2000/svg", tag.substring(4)) as ElementFromPrefixedTag<K>
    } else if (tag === 'math' || tag.startsWith('math:')) {
        element = document.createElementNS("http://www.w3.org/1998/Math/MathML", tag.substring(5)) as ElementFromPrefixedTag<K>
    } else {
        element = document.createElement(tag) as ElementFromPrefixedTag<K>
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
