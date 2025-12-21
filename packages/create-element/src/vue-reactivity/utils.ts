import type { Child, DomElement } from '../types'
import type { Children, ReactiveChild, SpecialAttributesSignal } from './types'
import { effect, isRef } from '@vue/reactivity'
import { childToNode, handleAnyAttribute, handleChildren, handleClassAttribute, handleStyleAttribute } from '../utils'

export function handleAnySignalAttribute(element: DomElement, key: string | symbol, value: any): void {
  if (isRef(value)) {
    effect(() => handleAnyAttribute(element, key, value.value))
    return
  }

  handleAnyAttribute(element, key, value)
}

export function handleClassSignalAttribute(element: DomElement, value: SpecialAttributesSignal['class']): void {
  if (typeof value === 'string') {
    handleClassAttribute(element, value)
    return
  }

  if (Array.isArray(value)) {
    element.classList = ''
    element.classList.add(...value)
    return
  }

  if (isRef(value)) {
    effect(() => {
      element.classList = ''
      handleClassAttribute(element, value.value)
    })
    return
  }

  for (const k of Object.keys(value)) {
    effect(() => {
      let v = value[k]
      if (isRef(v)) v = v.value
      element.classList.toggle(k as string, v === true)
    })
  }
}

export function handleStyleSignalAttribute(element: DomElement, value: SpecialAttributesSignal['style']): void {
  if (typeof value === 'string') {
    handleStyleAttribute(element, value)
    return
  }

  if (isRef(value)) {
    effect(() => handleStyleAttribute(element, value.value))
    return
  }

  for (const key of Object.keys(value)) {
    effect(() => {
      // @ts-expect-error dynamic style access
      let val = value[key]
      if (isRef(val)) val = val.value
      // @ts-expect-error dynamic style set
      element.style[key] = val
    })
  }
}

export function handleDataSignalAttribute(element: DomElement, value: SpecialAttributesSignal['data']): void {
  for (const k of Object.keys(value)) {
    effect(() => {
      let v = value[k]
      if (isRef(v)) v = v.value
      if (typeof v === 'string') {
        element.dataset[k] = v
      }
    })
  }
}

export function handleSignalChildren(element: DomElement, children: Children): void {
  if (isRef(children)) {
    let placeholder: Node | null = null

    const getPlaceholder = () => {
      if (!placeholder) {
        placeholder = document.createComment('signal placeholder')
      }
      return placeholder
    }

    const nodes: Node[] = []

    effect(() => {
      const newNodes = reactiveChildrenToNodes(children)
      if (newNodes.length === 0) newNodes.push(getPlaceholder())

      let lastInsertedNode: Node | null = null

      for (let i = 0; i < Math.max(newNodes.length, nodes.length); i++) {
        const newNode = newNodes[i]
        const node = nodes[i]
        const isInNew = node && newNodes.includes(node)

        if (node && !isInNew && i + 1 < nodes.length) {
          if (element.contains(node)) {
            element.removeChild(node)
          }
          nodes.splice(i, 1)
          i--
          continue
        }

        if (newNode && newNode === node) {
          lastInsertedNode = newNode
          continue
        }

        if (newNode) {
          if (node && element.contains(node)) element.insertBefore(newNode, node)
          else if (lastInsertedNode && element.contains(lastInsertedNode)) insertAfter(element, newNode, lastInsertedNode)
          else element.appendChild(newNode)

          const indexInOld = nodes.indexOf(newNode)
          if (indexInOld !== -1) {
            nodes.splice(indexInOld, 1)
          }
          nodes.splice(i, 0, newNode)

          lastInsertedNode = newNode

          continue
        }

        if (!newNode && node) {
          for (let j = i; j < nodes.length; j++) {
            if (element.contains(nodes[j])) {
              element.removeChild(nodes[j])
            }
          }

          nodes.splice(i)
          break
        }
      }
    })
  } else {
    return handleChildren(element, children)
  }
}

export function reactiveChildrenToNodes(reactiveChild: ReactiveChild): Node[] {
  const value = getReactiveChildValue(reactiveChild)

  const nodes: Node[] = []
  if (Array.isArray(value)) {
    value.forEach((v) => {
      const node = childToNode(v)
      if (node) {
        nodes.push(node)
      }
    })
  } else {
    const node = childToNode(value)
    if (node) {
      nodes.push(node)
    }
  }

  return nodes
}

function getReactiveChildValue(child: ReactiveChild): Child | Child[] {
  return child.value
}

function insertAfter(parent: Node, newNode: Node, referenceNode: Node): void {
  const nextNode = referenceNode.nextSibling
  if (nextNode) {
    parent.insertBefore(newNode, nextNode)
  } else {
    parent.appendChild(newNode)
  }
}
