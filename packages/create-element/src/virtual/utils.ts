import type { DomElement } from '../types'
import { applyAttributes, createBaseElement } from '../utils'
import type { ElementVNode, VNode, VNodeChildren } from './types'
import { isElementVNode, isVNode, isVNodeChildren } from './vnode'

export function virtualChildrenToNodes(children: VNodeChildren): Node[] {
  if (Array.isArray(children)) return children.flatMap(virtualChildrenToNodes)
  if (children === null || children === undefined || typeof children === 'boolean') return []
  if (typeof children === 'string' || typeof children === 'number') {
    return [document.createTextNode(children.toString())]
  }
  if (!isVNode(children)) return []

  return vnodeToNodes(children)
}

function vnodeToNodes(vnode: VNode): Node[] {
  if (typeof vnode.type === 'function') {
    const children = Reflect.apply(vnode.type, undefined, [vnode.props])
    return isVNodeChildren(children) ? virtualChildrenToNodes(children) : []
  }

  return isElementVNode(vnode) ? [createElementFromVNode(vnode)] : []
}

export function createElementFromVNode(vnode: ElementVNode): DomElement {
  const element = createBaseElement(vnode.type)
  applyAttributes<VNodeChildren>(element, vnode.props, appendVirtualChildren)
  return element
}

function appendVirtualChildren(element: DomElement, children: VNodeChildren): void {
  virtualChildrenToNodes(children).forEach((node) => element.appendChild(node))
}
