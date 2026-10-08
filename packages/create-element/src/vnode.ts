import type {
  ComponentVNode,
  ElementVNode,
  PrefixedElementTag,
  VNode,
  VNodeProps,
  VNodeType,
} from './types'
import { vnodeBrand } from './vnode-brand'

/** Describes a tree without creating DOM or starting effects. */
export function h<T extends PrefixedElementTag>(type: T, props?: VNodeProps<T> | null): VNode<T> {
  return createVNodeObject(type, props)
}

export function createVNodeObject<Type extends VNodeType>(
  type: Type,
  props: object | null | undefined,
  jsxKey?: unknown,
): VNode<Type> {
  const normalizedProps = { ...props }

  if (Reflect.has(normalizedProps, 'innerHTML') && Reflect.has(normalizedProps, 'children')) {
    throw new TypeError('children and innerHTML cannot be used together')
  }

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
