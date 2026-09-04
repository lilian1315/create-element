import { appendReactiveChildren, createReactiveElement } from './reactive-element'
import { EffectScope, type ReactivityAdapter, type StopEffect } from './reactivity'
import type { DomElement, PrefixedElementTag } from './types'
import type { VNode } from './virtual/types'
import { isElementVNode, isVNode } from './virtual/vnode'

export type StaticVNodeChild = VNode | string | number | boolean | null | undefined

export type ReactiveFunctionComponent<Children, Props extends object = object> = (
  props: Props,
) => Children

export type ReactiveVNodeType<Children> = PrefixedElementTag | ((props: never) => Children)

type ReactiveAttributeValue<Value, Source> = Value extends (...args: never[]) => unknown
  ? Value | Source
  : Value extends readonly unknown[]
    ? Value | Source
    : Value extends object
      ? { [Key in keyof Value]: ReactiveAttributeValue<Value[Key], Source> } | Source
      : Value | Source

export type ReactiveVNodeAttributes<Attributes, Children, Source> = {
  [Key in keyof Omit<Attributes, 'children'>]: ReactiveAttributeValue<
    Omit<Attributes, 'children'>[Key],
    Source
  >
} & {
  children?: Children
}

const mountedScopes = new WeakMap<DomElement, EffectScope>()

export function mountReactiveVirtual<Source>(
  adapter: ReactivityAdapter<Source>,
  target: DomElement,
  children: unknown,
): StopEffect {
  mountedScopes.get(target)?.dispose()

  const scope = new EffectScope()
  mountedScopes.set(target, scope)

  try {
    target.replaceChildren()
    appendReactiveVirtualChildren(adapter, scope, target, children)
  } catch (error) {
    if (mountedScopes.get(target) === scope) mountedScopes.delete(target)
    scope.dispose()
    target.replaceChildren()
    throw error
  }

  return () => {
    if (mountedScopes.get(target) !== scope) {
      scope.dispose()
      return
    }

    mountedScopes.delete(target)
    scope.dispose()
    target.replaceChildren()
  }
}

function appendReactiveVirtualChildren<Source>(
  adapter: ReactivityAdapter<Source>,
  scope: EffectScope,
  parent: DomElement,
  children: unknown,
): void {
  if (Array.isArray(children)) {
    children.forEach((child) => appendReactiveVirtualChildren(adapter, scope, parent, child))
    return
  }

  if (adapter.isReactive(children)) {
    appendReactiveChildren(adapter, scope, parent, children, (value, contentScope) =>
      reactiveVirtualValueToNodes(adapter, contentScope, value),
    )
    return
  }

  if (isVNode(children)) {
    if (typeof children.type === 'function') {
      appendReactiveVirtualChildren(
        adapter,
        scope,
        parent,
        Reflect.apply(children.type, undefined, [children.props]),
      )
      return
    }

    if (isElementVNode(children)) {
      parent.appendChild(createReactiveElementFromVNode(adapter, children, scope))
    }
    return
  }

  if (typeof children === 'string' || typeof children === 'number') {
    parent.appendChild(document.createTextNode(children.toString()))
  }
}

function reactiveVirtualValueToNodes<Source>(
  adapter: ReactivityAdapter<Source>,
  scope: EffectScope,
  value: unknown,
): Node[] {
  if (Array.isArray(value)) {
    return value.flatMap((child) => reactiveVirtualValueToNodes(adapter, scope, child))
  }

  if (adapter.isReactive(value)) {
    return reactiveVirtualValueToNodes(adapter, scope, adapter.get(value))
  }

  if (value === null || value === undefined || typeof value === 'boolean') return []
  if (typeof value === 'string' || typeof value === 'number') {
    return [document.createTextNode(value.toString())]
  }

  if (!isVNode(value)) return []
  if (typeof value.type === 'function') {
    return reactiveVirtualValueToNodes(
      adapter,
      scope,
      Reflect.apply(value.type, undefined, [value.props]),
    )
  }

  return isElementVNode(value) ? [createReactiveElementFromVNode(adapter, value, scope)] : []
}

export function createReactiveElementFromVNode<Source>(
  adapter: ReactivityAdapter<Source>,
  vnode: {
    readonly type: PrefixedElementTag
    readonly props: Readonly<Record<string | symbol, unknown>>
  },
  scope = new EffectScope(),
): DomElement {
  return createReactiveElement(
    adapter,
    vnode.type,
    vnode.props,
    [],
    (element, child) => appendReactiveVirtualChildren(adapter, scope, element, child),
    scope,
  )
}
