import type { Child, Children, DomElement, SpecialAttributes } from './types'

export function handleAnyAttribute(element: DomElement, name: string | symbol, value: unknown): void {
  if (typeof name === 'string' && name.startsWith('on') && typeof value === 'function') {
    handleEventHandlerAttribute(element, name, value)
    return
  }

  if (name in element || typeof name === 'symbol') {
    try {
      // @ts-expect-error try to set the value directly
      element[name] = value
    } catch {}
  } else {
    element.setAttribute(name, String(value))
  }
}

export function handleClassAttribute(element: DomElement, value: SpecialAttributes['class']): void {
  if (typeof value === 'string') {
    element.classList = ''
    element.classList.add(...value.split(' ').filter(Boolean))
    return
  }
  if (Array.isArray(value)) {
    // Add each class from array (filter out falsy values)
    value.filter(Boolean).forEach((className) => element.classList.add(className))
    return
  }

  // Handle object format: { 'class1': true, 'class2': false, 'class3': true }
  Object.entries(value).forEach(([className, shouldInclude]) => {
    element.classList.toggle(className, !!shouldInclude)
  })
}

// eslint-disable-next-line ts/no-unsafe-function-type
export function handleEventHandlerAttribute(element: DomElement, name: string, value: Function): void {
  element.addEventListener(name.slice(2).toLowerCase(), value as EventListener)
}

export function handleStyleAttribute(element: DomElement, value: SpecialAttributes['style']): void {
  if (typeof value === 'string') {
    element.setAttribute('style', value)
    return
  }

  Object.assign(element.style, value)
}

export function handleDataAttribute(element: DomElement, value: SpecialAttributes['data']): void {
  Object.assign(element.dataset, value)
}

export function handleChildren(element: DomElement, children: Children) {
  childrenToNodes(children).forEach((node) => element.appendChild(node))
}

export function childrenToNodes(children: Children): Node[] {
  if (!Array.isArray(children)) children = [children]
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
