import type { Children, ElementAttributesTagNameMap, ElementPrefixedTagNameMap, PrefixedElementTag, Prettify } from "./types"
import { handleAnyAttribute, handleChildren, handleClassAttribute, handleDataAttribute, handleStyleAttribute } from "./utils"

export function el<T extends PrefixedElementTag>(tag: T, attributes?: Prettify<ElementAttributesTagNameMap[T]> | null, ...children: Children[]): ElementPrefixedTagNameMap[T] {
    let element: ElementPrefixedTagNameMap[T]

    if (tag === 'svg' || tag.startsWith('svg:')) {
        element = document.createElementNS("http://www.w3.org/2000/svg", tag === 'svg' ? 'svg' : tag.substring(4)) as ElementPrefixedTagNameMap[T]
    } else if (tag === 'math' || tag.startsWith('math:')) {
        element = document.createElementNS("http://www.w3.org/1998/Math/MathML", tag === 'math' ? 'math' : tag.substring(5)) as ElementPrefixedTagNameMap[T]
    } else {
        element = document.createElement(tag) as ElementPrefixedTagNameMap[T]
    }

    if (attributes) {
        for (let name of Reflect.ownKeys(attributes)) {
            if(name === 'children') {
                if (Array.isArray(attributes.children)) attributes.children.forEach((subChildren) => handleChildren(element, subChildren))
                else handleChildren(element, attributes.children)
                continue
            } 

            if(name === 'class' && attributes['class']) {
                handleClassAttribute(element, attributes['class'])
                continue
            }

            if(name === 'style' && attributes['style']) {
                handleStyleAttribute(element, attributes['style'])
                continue
            }

            if(name === 'data' && attributes['data']) {
                handleDataAttribute(element, attributes['data'])
                continue    
            }

            handleAnyAttribute(element, name, attributes[name])
        }
    }

    children.forEach((subChildren) => handleChildren(element, subChildren))

    return element
}
