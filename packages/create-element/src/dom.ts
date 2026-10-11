import { applyElementProps, createElementBinding, bindingSymbol } from './dom-props'
import { EffectScope } from './effect-scope'
import * as reactivity from './reactivity-ops'
import type {
  Component,
  DomElement,
  ElementPrefixedTagNameMap,
  PrefixedElementTag,
  VNodeChild,
  VNodeProps,
  VNode,
  ElementState,
  MountedChild,
  RenderValue,
  RangeChild,
  Props,
} from './types'
import { isComponentVNode, isElementVNode, isVNode } from './vnode'

export type { VNodeChild, VNodeProps, VNode } from './types'

/** Applies props to an unbound element without resetting absent properties. */
export function bind<T extends DomElement>(element: T, props: VNodeProps<NoInfer<T>>): () => void {
  const state = createElementState(element)
  try {
    updateElement(state, props, 'replace')
  } catch (error) {
    state.binding.scope.dispose()
    throw error
  }
  return () => state.binding.scope.dispose()
}

/** Replaces a target's content and returns a cleanup for this mount only. */
export function mount(target: DomElement, tree: VNodeChild): () => void {
  activeMounts.get(target)?.dispose()
  clearChildren(target)
  const scope = new EffectScope()
  const start = document.createComment('mount:start')
  const end = document.createComment('mount:end')
  activeMounts.set(target, scope)
  scope.addCleanup(() => disposeBetween(start, end))
  let children: MountedChild[] = []
  scope.addCleanup(() => {
    for (const child of children) disposeChild(child)
  })
  try {
    const fragment = document.createDocumentFragment()
    fragment.appendChild(start)
    children = reconcile(fragment, null, tree, null)
    fragment.appendChild(end)
    target.appendChild(fragment)
    attach(start, scope)
  } catch (error) {
    scope.dispose()
    clearChildren(target)
    activeMounts.delete(target)
    throw error
  }
  return () => {
    scope.dispose()
    if (activeMounts.get(target) !== scope) return
    activeMounts.delete(target)
    if (start.parentNode !== target || end.parentNode !== target) return
    for (let node: Node | null = start; node;) {
      const next: Node | null = node.nextSibling
      disposeTree(node)
      target.removeChild(node)
      if (node === end) break
      node = next
    }
  }
}

/** Materializes a single element root. A component must render exactly one element. */
export function build<T extends PrefixedElementTag>(tree: VNode<T>): ElementPrefixedTagNameMap[T]
export function build<T extends PrefixedElementTag>(tree: VNode): ElementPrefixedTagNameMap[T]
export function build(tree: VNode): DomElement | DocumentFragment
export function build(tree: VNode<Component>): DocumentFragment
export function build(tree: VNode | VNode<Component>): DomElement | DocumentFragment {
  const fragment = document.createDocumentFragment()
  try {
    reconcile(fragment, null, tree, null, true)
    if (typeof tree.type === 'string') {
      if (fragment.childNodes.length !== 1 || !(fragment.childNodes[0] instanceof Element)) {
        throw new TypeError('build requires exactly one element root if its a single element Vnode')
      }
      return fragment.childNodes[0] as DomElement
    } else {
      return fragment
    }
  } catch (error) {
    for (const child of fragment.childNodes) disposeTree(child)
    throw error
  }
}

const nodeScopes = new WeakMap<Node, Set<EffectScope>>()
const activeMounts = new WeakMap<DomElement, EffectScope>()

function attach(node: Node, scope: EffectScope): void {
  let scopes = nodeScopes.get(node)
  if (!scopes) nodeScopes.set(node, (scopes = new Set()))
  scopes.add(scope)
  scope.addCleanup(() => {
    scopes.delete(scope)
    if (scopes.size === 0) nodeScopes.delete(node)
  })
}

/** Stops library-owned resources on an element and its current descendants. */
export const dispose: (element: DomElement) => void = disposeTree

function disposeTree(node: Node): void {
  for (const child of node.childNodes) disposeTree(child)
  node[bindingSymbol]?.scope.dispose()
  for (const scope of nodeScopes.get(node) ?? []) scope.dispose()
}

function clearChildren(element: DomElement): void {
  for (const child of element.childNodes) disposeTree(child)
  element.replaceChildren()
}

function normalize(value: unknown): RenderValue[] {
  const values: unknown[] = Array.isArray(value) ? value.flat(Infinity) : [value]
  return values.filter((child): child is RenderValue => child !== null && child !== undefined)
}

function matches(previous: RenderValue, next: RenderValue): boolean {
  if (isVNode(previous) && isVNode(next)) {
    return previous.key === next.key && previous.type === next.type
  }
  if (
    (typeof previous === 'string' || typeof previous === 'number') &&
    (typeof next === 'string' || typeof next === 'number')
  )
    return true
  return previous === next
}

function belongsTo(child: MountedChild, parent: Node): boolean {
  return child.first.parentNode === parent && child.last.parentNode === parent
}

const EMPTY_PREVIOUS_CHILDREN: readonly MountedChild[] = []

/** Checks whether a mounted child still belongs to its original parent. */
function reconcile(
  parent: Node,
  previous: readonly MountedChild[] | null,
  value: unknown,
  end: Node | null,
  root = false,
): MountedChild[] {
  if (previous === null) previous = EMPTY_PREVIOUS_CHILDREN
  const values = normalize(value)
  const used = new Set<MountedChild>()
  const keyed = new Map<string | number, MountedChild[]>()
  const identities = new Map<unknown, MountedChild>()
  for (const child of previous) {
    if (!belongsTo(child, parent)) continue
    if (isVNode(child.value)) {
      if (child.value.key !== null) {
        const candidates = keyed.get(child.value.key) ?? []
        candidates.push(child)
        keyed.set(child.value.key, candidates)
      }
    } else if (child.kind !== 'text') {
      identities.set(child.value, child)
    }
  }
  const next: MountedChild[] = []
  try {
    for (let index = 0; index < values.length; index++) {
      const value = values[index]
      let child: MountedChild | undefined = previous[index]
      if (!child || !belongsTo(child, parent) || used.has(child) || !matches(child.value, value)) {
        // Keys are sibling-local; unkeyed VNodes keep positional identity.
        child =
          isVNode(value) && value.key !== null
            ? keyed
                .get(value.key)
                ?.find((candidate) => !used.has(candidate) && matches(candidate.value, value))
            : identities.get(value)
        if (child && used.has(child)) child = undefined
      }
      if (child) {
        used.add(child)
        patchChild(child, value, root)
      } else {
        child = createChild(value, root)
      }
      next.push(child)
    }
  } catch (error) {
    for (const child of next) if (!used.has(child)) removeChild(child)
    throw error
  }
  for (const child of previous) {
    if (used.has(child)) continue
    if (belongsTo(child, parent)) removeChild(child)
    else disposeChild(child)
  }
  let before = end
  for (let index = next.length - 1; index >= 0; index--) {
    const child = next[index]
    if (child.last.parentNode !== parent || child.last.nextSibling !== before) {
      for (let node: Node | null = child.first; node;) {
        const following: Node | null = node.nextSibling
        moveNode(parent, node, before, used.has(child))
        if (node === child.last) break
        node = following
      }
    }
    before = child.first
  }
  return next
}

function moveNode(parent: Node, node: Node, before: Node | null, reuse: boolean): void {
  // moveBefore needs an already parented node and matching connectedness.
  if (
    reuse &&
    (parent as ParentNode).moveBefore &&
    node.parentNode &&
    node.ownerDocument === parent.ownerDocument &&
    node.isConnected === parent.isConnected
  ) {
    ;(parent as ParentNode).moveBefore(node, before)
  } else {
    parent.insertBefore(node, before)
  }
}

function disposeChild(child: MountedChild): void {
  if (child.kind === 'range') {
    child.scope.dispose()
  } else {
    disposeTree(child.first)
  }
}

function removeChild(child: MountedChild): void {
  disposeChild(child)
  for (let node: Node | null = child.first; node;) {
    const following: Node | null = node.nextSibling
    node.parentNode?.removeChild(node)
    if (node === child.last) break
    node = following
  }
}

function disposeBetween(start: Comment, end: Comment): void {
  if (!start.parentNode || start.parentNode !== end.parentNode) return
  for (let node = start.nextSibling; node && node !== end; node = node.nextSibling)
    disposeTree(node)
}

function createElementState(element: DomElement): ElementState {
  const binding = createElementBinding(element)
  const state: ElementState = { binding, children: [] }
  binding.scope.addCleanup(() => {
    for (const child of state.children) disposeChild(child)
  })
  return state
}

function createChild(value: RenderValue, root: boolean): MountedChild {
  if (
    (reactivity.REACTIVE_ENABLED && reactivity.isReactive(value)) ||
    (isVNode(value) && isComponentVNode(value))
  ) {
    if (root && reactivity.REACTIVE_ENABLED && reactivity.isReactive(value)) {
      throw new TypeError('build does not accept a reactive root')
    }
    const fragment = document.createDocumentFragment()
    const scope = new EffectScope()
    const child: RangeChild = {
      kind: 'range',
      value,
      first: document.createComment('dynamic:start'),
      last: document.createComment('dynamic:end'),
      scope,
      children: [],
    }
    fragment.append(child.first, child.last)
    attach(child.first, scope)
    scope.addCleanup(() => disposeBetween(child.first, child.last))
    scope.addCleanup(() => {
      for (const nested of child.children) disposeChild(nested)
    })
    try {
      if (reactivity.REACTIVE_ENABLED && reactivity.isReactive(value)) {
        scope.addCleanup(
          reactivity.effect(() => {
            const parent = child.last.parentNode
            if (!parent || child.first.parentNode !== parent) return
            child.children = reconcile(parent, child.children, reactivity.get(value), child.last)
          }),
        )
      } else {
        patchChild(child, value, root)
      }
      return child
    } catch (error) {
      scope.dispose()
      throw error
    }
  }
  if (isVNode(value) && isElementVNode(value)) {
    const element = createBaseElement(value.type)
    const state = createElementState(element)
    try {
      updateElement(state, value.props as Props, 'reconcile')
      return { kind: 'element', value, first: element, last: element, state }
    } catch (error) {
      state.binding.scope.dispose()
      throw error
    }
  }
  if (value instanceof Node) {
    if (root) throw new TypeError('build requires exactly one element root')
    return { kind: 'opaque', value, first: value, last: value }
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const text = document.createTextNode(value.toString())
    return { kind: 'text', value, first: text, last: text }
  }
  throw new TypeError('Unsupported tree child')
}

function patchChild(child: MountedChild, value: RenderValue, root: boolean): void {
  switch (child.kind) {
    case 'range': {
      if (!isVNode(value) || !isComponentVNode(value)) return
      const parent = child.last.parentNode
      if (!parent || child.first.parentNode !== parent) return
      child.children = reconcile(
        parent,
        child.children,
        Reflect.apply(value.type, undefined, [value.props]),
        child.last,
        root,
      )
      child.value = value
      break
    }
    case 'element':
      if (!isVNode(value) || !isElementVNode(value)) return
      updateElement(child.state, value.props as Props, 'reconcile')
      child.value = value
      break
    case 'text':
      if (typeof value !== 'string' && typeof value !== 'number') return
      if (child.first.nodeValue !== value.toString()) child.first.nodeValue = value.toString()
      child.value = value
      break
    case 'opaque':
      break
  }
}

function updateElement(state: ElementState, props: Props, policy: 'replace' | 'reconcile'): void {
  applyElementProps(state.binding, props, () => {
    const { element, scope } = state.binding
    if (Reflect.has(props, 'innerHTML')) {
      if (!state.htmlScope || !Object.is(state.innerHTML, props.innerHTML)) {
        for (const child of state.children) {
          if (belongsTo(child, element)) removeChild(child)
          else disposeChild(child)
        }
        state.children = []
        state.htmlScope?.dispose()
        state.htmlScope = scope.child()
        state.innerHTML = props.innerHTML
        const apply = (next: unknown) => {
          clearChildren(element)
          element.innerHTML = typeof next === 'string' ? next : ''
        }
        const html = props.innerHTML
        if (reactivity.REACTIVE_ENABLED && reactivity.isReactive(html))
          state.htmlScope.addCleanup(reactivity.effect(() => apply(reactivity.get(html))))
        else apply(html)
      }
    } else if (policy === 'reconcile' || Reflect.has(props, 'children')) {
      if (state.htmlScope) {
        state.htmlScope.dispose()
        state.htmlScope = undefined
        clearChildren(element)
      }
      if (policy === 'replace') clearChildren(element)
      state.children = reconcile(element, state.children, props.children, null)
    }
  })
}

function createBaseElement<T extends PrefixedElementTag>(tag: T): ElementPrefixedTagNameMap[T] {
  if (tag === 'svg' || tag.startsWith('svg:')) {
    return document.createElementNS(
      'http://www.w3.org/2000/svg',
      tag === 'svg' ? 'svg' : tag.substring(4),
    ) as ElementPrefixedTagNameMap[T]
  }

  if (tag === 'math' || tag.startsWith('math:')) {
    return document.createElementNS(
      'http://www.w3.org/1998/Math/MathML',
      tag === 'math' ? 'math' : tag.substring(5),
    ) as ElementPrefixedTagNameMap[T]
  }

  return document.createElement(tag) as ElementPrefixedTagNameMap[T]
}
