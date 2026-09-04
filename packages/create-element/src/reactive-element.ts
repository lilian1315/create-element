import { EffectScope, getReactiveValue, type ReactivityAdapter } from './reactivity'
import type { DomElement, ElementPrefixedTagNameMap, PrefixedElementTag } from './types'
import {
  createBaseElement,
  handleAnyAttribute,
  handleClassAttribute,
  handleEventHandlerAttribute,
  handleStyleAttribute,
} from './utils'

type ReactiveElementAttributes = Readonly<Record<string | symbol, unknown>>
type ClassAttribute = string | string[] | Record<string, boolean>
type AppendReactiveChild = (element: DomElement, child: unknown) => void

const elementsEventHandlers = new WeakMap<DomElement, Map<string, Function>>()

export function createReactiveElement<Source, T extends PrefixedElementTag>(
  adapter: ReactivityAdapter<Source>,
  tag: T,
  attributes: ReactiveElementAttributes | null | undefined,
  children: unknown[],
  appendChild?: AppendReactiveChild,
  scope = new EffectScope(),
): ElementPrefixedTagNameMap[T] {
  const element = createBaseElement(tag)
  const append =
    appendChild ??
    ((parent: DomElement, child: unknown) => appendReactiveChildren(adapter, scope, parent, child))

  scope.addCleanup(() => removeEventHandlers(element))

  const appendChildren = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(appendChildren)
      return
    }

    append(element, value)
  }

  if (attributes) {
    for (const name of Reflect.ownKeys(attributes)) {
      const value = attributes[name]

      if (name === 'children') {
        appendChildren(value)
        continue
      }

      if (name === 'class' && value) {
        handleReactiveClassAttribute(adapter, scope, element, value)
        continue
      }

      if (name === 'style' && value) {
        handleReactiveStyleAttribute(adapter, scope, element, value)
        continue
      }

      if (name === 'data' && value) {
        handleReactiveDataAttribute(adapter, scope, element, value)
        continue
      }

      handleReactiveAttribute(adapter, scope, element, name, value)
    }
  }

  children.forEach(appendChildren)

  return element
}

export function childValueToNodes(value: unknown): Node[] {
  if (Array.isArray(value)) return value.flatMap(childValueToNodes)
  if (value === null || value === undefined) return []
  if (typeof value === 'string' || typeof value === 'number') {
    return [document.createTextNode(value.toString())]
  }
  if (value instanceof Node) return [value]
  return []
}

function handleReactiveAttribute<Source>(
  adapter: ReactivityAdapter<Source>,
  scope: EffectScope,
  element: DomElement,
  key: string | symbol,
  value: unknown,
): void {
  const applyAttribute = (nextValue: unknown) => {
    if (
      typeof key === 'string' &&
      key.startsWith('on') &&
      (typeof nextValue === 'function' || nextValue === null || nextValue === undefined)
    ) {
      handleReactiveEventHandlerAttribute(element, key, nextValue)
      return
    }

    handleAnyAttribute(element, key, nextValue)
  }

  if (!adapter.isReactive(value)) {
    applyAttribute(value)
    return
  }

  scope.effect(adapter, () => applyAttribute(adapter.get(value)))
}

function handleReactiveClassAttribute<Source>(
  adapter: ReactivityAdapter<Source>,
  scope: EffectScope,
  element: DomElement,
  value: unknown,
): void {
  if (typeof value === 'string') {
    handleClassAttribute(element, value)
    return
  }

  if (isStringArray(value)) {
    element.classList = ''
    element.classList.add(...value.map((c) => c.trim()).filter(Boolean))
    return
  }

  if (adapter.isReactive(value)) {
    scope.effect(adapter, () => {
      const nextValue = adapter.get(value)
      element.classList = ''
      if (isClassAttribute(nextValue)) handleClassAttribute(element, nextValue)
    })
    return
  }

  if (!isRecord(value)) return

  for (const className of Object.keys(value)) {
    scope.effect(adapter, () => {
      const classValue = getReactiveValue(adapter, value[className])
      element.classList.toggle(className, classValue === true)
    })
  }
}

function handleReactiveEventHandlerAttribute(
  element: DomElement,
  key: string,
  value: Function | null | undefined,
): void {
  let eventHandlers = elementsEventHandlers.get(element)

  if (!eventHandlers) {
    eventHandlers = new Map<string, Function>()
    elementsEventHandlers.set(element, eventHandlers)
  }

  const existing = eventHandlers.get(key)
  if (existing) {
    element.removeEventListener(key.slice(2).toLowerCase(), existing as EventListener)
  }

  if (!value) {
    eventHandlers.delete(key)
    return
  }

  eventHandlers.set(key, value)
  handleEventHandlerAttribute(element, key, value)
}

function handleReactiveStyleAttribute<Source>(
  adapter: ReactivityAdapter<Source>,
  scope: EffectScope,
  element: DomElement,
  value: unknown,
): void {
  if (typeof value === 'string') {
    handleStyleAttribute(element, value)
    return
  }

  if (adapter.isReactive(value)) {
    scope.effect(adapter, () => applyStyleValue(element, adapter.get(value)))
    return
  }

  if (!isRecord(value)) return

  for (const key of Object.keys(value)) {
    scope.effect(adapter, () => {
      Reflect.set(element.style, key, getReactiveValue(adapter, value[key]))
    })
  }
}

function handleReactiveDataAttribute<Source>(
  adapter: ReactivityAdapter<Source>,
  scope: EffectScope,
  element: DomElement,
  value: unknown,
): void {
  if (!isRecord(value)) return

  for (const key of Object.keys(value)) {
    scope.effect(adapter, () => {
      const dataValue = getReactiveValue(adapter, value[key])

      if (dataValue === true) element.dataset[key] = ''
      else if (typeof dataValue === 'string') element.dataset[key] = dataValue
      else delete element.dataset[key]
    })
  }
}

export function appendReactiveChildren<Source>(
  adapter: ReactivityAdapter<Source>,
  scope: EffectScope,
  element: DomElement,
  children: unknown,
  toNodes: (value: unknown, scope: EffectScope) => Node[] = childValueToNodes,
): void {
  if (!adapter.isReactive(children)) {
    toNodes(children, scope).forEach((node) => element.appendChild(node))
    return
  }

  let placeholder: Node | null = null

  const getPlaceholder = () => {
    if (!placeholder) placeholder = document.createComment('signal placeholder')
    return placeholder
  }

  const nodes: Node[] = []
  let contentScope: EffectScope | undefined

  scope.effect(adapter, () => {
    contentScope?.dispose()
    contentScope = scope.child()
    const value = adapter.get(children)
    const newNodes = toNodes(value, contentScope)
    if (newNodes.length === 0) newNodes.push(getPlaceholder())

    let lastInsertedNode: Node | null = null

    for (let i = 0; i < Math.max(newNodes.length, nodes.length); i++) {
      const newNode = newNodes[i]
      const node = nodes[i]
      const isInNew = node && newNodes.includes(node)

      if (node && !isInNew && i + 1 < nodes.length) {
        if (element.contains(node)) element.removeChild(node)
        nodes.splice(i, 1)
        i--
        continue
      }

      if (newNode && newNode === node) {
        lastInsertedNode = newNode
        continue
      }

      if (newNode) {
        if (node && element.contains(node)) {
          element.insertBefore(newNode, node)
        } else if (lastInsertedNode && element.contains(lastInsertedNode)) {
          insertAfter(element, newNode, lastInsertedNode)
        } else {
          element.appendChild(newNode)
        }

        const indexInOld = nodes.indexOf(newNode)
        if (indexInOld !== -1) nodes.splice(indexInOld, 1)
        nodes.splice(i, 0, newNode)

        lastInsertedNode = newNode
        continue
      }

      if (!newNode && node) {
        for (let j = i; j < nodes.length; j++) {
          if (element.contains(nodes[j])) element.removeChild(nodes[j])
        }

        nodes.splice(i)
        break
      }
    }
  })
}

function removeEventHandlers(element: DomElement): void {
  const eventHandlers = elementsEventHandlers.get(element)
  if (!eventHandlers) return

  for (const [key, handler] of eventHandlers) {
    element.removeEventListener(key.slice(2).toLowerCase(), handler as EventListener)
  }

  elementsEventHandlers.delete(element)
}

function applyStyleValue(element: DomElement, value: unknown): void {
  if (typeof value === 'string') {
    handleStyleAttribute(element, value)
    return
  }

  if (!isRecord(value)) return
  for (const [key, styleValue] of Object.entries(value)) {
    Reflect.set(element.style, key, styleValue)
  }
}

function isClassAttribute(value: unknown): value is ClassAttribute {
  return (
    typeof value === 'string' ||
    isStringArray(value) ||
    (isRecord(value) && Object.values(value).every((entry) => typeof entry === 'boolean'))
  )
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function insertAfter(parent: Node, newNode: Node, referenceNode: Node): void {
  const nextNode = referenceNode.nextSibling
  if (nextNode) parent.insertBefore(newNode, nextNode)
  else parent.appendChild(newNode)
}
