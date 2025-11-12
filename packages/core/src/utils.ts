import type { DomElement, Child, Children } from "./types";

export function handleAttribute(element: DomElement, key: string | symbol, value: any): void {
    if(typeof key === 'string') {
        if (handleClassAttribute(element, key, value)) return
        if (handleStyleAttribute(element, key, value)) return
        if (handleEventHandlerAttribute(element, key, value)) return
        if (handleDataAttribute(element, key, value)) return
    }

    if(key in element || typeof key === 'symbol') {
        try {
            // try to set the value directly
            // @ts-expect-error
            element[key] = value;
            return
        } catch {}
    } else {
        element.setAttribute(key, String(value))
    }
}

export function handleClassAttribute(element: DomElement, name: string, value: any): boolean {
    if (name !== 'class') return false
    if (typeof value === 'string') {
        element.classList = ''
        element.classList.add(...value.split(' ').filter(Boolean))
    } else if (Array.isArray(value)) {
        // Add each class from array (filter out falsy values)
        value.filter(Boolean).forEach((className) => element.classList.add(className))
    } else if (typeof value === 'object' && value !== null) {
        // Handle object format: { 'class1': true, 'class2': false, 'class3': true }
        Object.entries(value).forEach(([className, shouldInclude]) => {
            element.classList.toggle(className, !!shouldInclude)
        })
    }

    return true
}

export function handleEventHandlerAttribute(element: DomElement, name: string, value: any): boolean {
    if (!name.startsWith('on') || typeof value !== 'function') return false

    const eventName = name.slice(2).toLowerCase()
    element.addEventListener(eventName, value)
    return true
}

export function handleStyleAttribute(element: DomElement, name: string, value: any): boolean {
    if (name !== 'style') return false

    if (typeof value === 'string') {
        element.setAttribute('style', value)
    } else if (typeof value === 'object' && value !== null) {
        Object.assign(element.style, value)
    }

    return true
}

export function handleDataAttribute(element: DomElement, key: string, value: any): boolean {
    if (key !== 'data' || typeof value !== 'object' || value === null) return false
    Object.assign(element.dataset, value)
    return true
}

export function handleChildren(element: DomElement, children: Children) {
    childrenToNodes(children).forEach((node) => element.appendChild(node))
}

export function childrenToNodes(children: Children): Node[] {
    if (!Array.isArray(children)) children = [children];
    return children.map(childToNode).filter((node) => node !== null)
}

export function childToNode(child: Child): Node | null {
    if (child === null || child === undefined) return null
    if (typeof child === 'string' || typeof child === 'number') {
        return document.createTextNode(child.toString())
    } else {
        return child
    }
}
