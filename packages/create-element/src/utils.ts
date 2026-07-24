import type {
  Child,
  Children,
  DomElement,
  ElementPrefixedTagNameMap,
  PrefixedElementTag,
  SpecialAttributes,
} from './types'

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
  if (typeof key === 'string' && key.startsWith('on') && typeof value === 'function') {
    handleEventHandlerAttribute(element, key, value)
    return
  }

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

export function handleEventHandlerAttribute(
  element: DomElement,
  key: string,
  value: Function,
): void {
  element.addEventListener(key.slice(2).toLowerCase(), value as EventListener)
}

export function handleStyleAttribute(element: DomElement, value: SpecialAttributes['style']): void {
  if (typeof value === 'string') {
    element.setAttribute('style', value)
    return
  }

  Object.assign(element.style, value)
}

export function handleDataAttribute(element: DomElement, value: SpecialAttributes['data']): void {
  for (const [k, v] of Object.entries(value)) {
    if (v === true) element.dataset[k] = ''
    else if (typeof v === 'string') element.dataset[k] = v
    else delete element.dataset[k]
  }
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
