import type { ElementVNode, VNode, VNodeChildren, VNodeType } from './types'

export function createVNodeObject(
  type: VNodeType,
  props: object | null | undefined,
  children: readonly unknown[],
  jsxKey?: unknown,
): VNode {
  const normalizedProps = { ...props }

  if (children.length > 0) {
    const allChildren = Reflect.has(normalizedProps, 'children')
      ? [Reflect.get(normalizedProps, 'children'), ...children]
      : children

    Reflect.set(
      normalizedProps,
      'children',
      allChildren.length === 1 ? allChildren[0] : allChildren,
    )
  }

  const keyValue = jsxKey ?? Reflect.get(normalizedProps, 'key')
  const key = typeof keyValue === 'string' || typeof keyValue === 'number' ? keyValue : null

  Reflect.deleteProperty(normalizedProps, 'key')

  return {
    type,
    props: normalizedProps,
    key,
    constructor: undefined,
  }
}

export function isVNode(value: unknown): value is VNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    Reflect.get(value, 'constructor') === undefined &&
    Reflect.has(value, 'type') &&
    Reflect.has(value, 'props')
  )
}

export function isVNodeChildren(value: unknown): value is VNodeChildren {
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    isVNode(value)
  ) {
    return true
  }

  return Array.isArray(value) && value.every(isVNodeChildren)
}

export function isElementVNode(vnode: VNode): vnode is ElementVNode {
  return typeof vnode.type === 'string'
}
