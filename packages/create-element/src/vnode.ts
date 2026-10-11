import type { ComponentVNode, ElementVNode, VNode, VNodeType } from './types'
import { vnodeBrand } from './vnode-brand'

export function createVNode<Type extends VNodeType>(
  type: Type,
  props?: object | null,
  jsxKey?: unknown,
): VNode<Type> {
  const normalizedProps = { ...props }

  const keyValue = jsxKey ?? Reflect.get(normalizedProps, 'key')
  const key = typeof keyValue === 'string' || typeof keyValue === 'number' ? keyValue : null

  Reflect.deleteProperty(normalizedProps, 'key')

  const vnode: VNode<Type> & { readonly [vnodeBrand]: true } = {
    type,
    props: normalizedProps,
    key,
    [vnodeBrand]: true,
  }
  return vnode
}

export function isVNode(value: unknown): value is VNode {
  return typeof value === 'object' && value !== null && Reflect.get(value, vnodeBrand) === true
}

export function isElementVNode(vnode: VNode): vnode is ElementVNode {
  return typeof vnode.type === 'string'
}

export function isComponentVNode(vnode: VNode): vnode is ComponentVNode {
  return typeof vnode.type === 'function'
}
