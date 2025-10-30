import type { ElementFromPrefixedTag, PrefixedElementTag } from "../types"
import { handleSignalAttribute, handleSignalChildren } from "./utils";
import type { MayBeReactiveAttributes } from "./types";

export function el<K extends PrefixedElementTag>(tag: K, attributes?: MayBeReactiveAttributes<K> | null, ...children: NonNullable<MayBeReactiveAttributes<K>['children']>): ElementFromPrefixedTag<K> {
    let element: ElementFromPrefixedTag<K>

    if (tag === 'svg' || tag.startsWith('svg:')) {
        element = document.createElementNS("http://www.w3.org/2000/svg", tag === 'svg' ? 'svg' : tag.substring(4)) as ElementFromPrefixedTag<K>
    } else if (tag === 'math' || tag.startsWith('math:')) {
        element = document.createElementNS("http://www.w3.org/1998/Math/MathML", tag === 'math' ? 'math' : tag.substring(5)) as ElementFromPrefixedTag<K>
    } else {
        element = document.createElement(tag) as ElementFromPrefixedTag<K>
    }

    if(attributes) {
        for (let key of Reflect.ownKeys(attributes)) {
            if (key === 'children') {
                    attributes.children?.flat().forEach((child) => handleSignalChildren(element, child))
            } else {
                handleSignalAttribute(element, key, attributes[key])
            }
        }
    }

    children.flat().forEach((child) => handleSignalChildren(element, child))

    return element
}
