import {
  applyElementProps,
  assertContentProps,
  createElementBinding,
  type ElementBinding,
  bindingSymbol,
  type Props,
} from './dom-props'
import { EffectScope } from './effect-scope'
import { Fragment } from './jsx-runtime'
import * as reactivity from './reactivity-ops'
import type { Source } from './reactivity-ops'
import type { ComponentVNode, DomElement, ElementVNode, VNode } from './types'
import { createBaseElement } from './utils'
import { isComponentVNode, isElementVNode, isVNode } from './vnode'

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
export function dispose(element: DomElement): void {
  disposeTree(element)
}

function disposeTree(node: Node): void {
  for (const child of node.childNodes) disposeTree(child)
  node[bindingSymbol]?.scope.dispose()
  for (const scope of nodeScopes.get(node) ?? []) scope.dispose()
}

function clearChildren(element: DomElement): void {
  for (const child of element.childNodes) disposeTree(child)
  element.replaceChildren()
}

/** Materializes a single element root. A component must render exactly one element. */
export function build(tree: VNode): DomElement {
  if (!isVNode(tree)) throw new TypeError('build requires an h/JSX tree')
  if (tree.type === Fragment) throw new TypeError('build does not accept a Fragment root')
  const fragment = document.createDocumentFragment()
  try {
    appendValue(fragment, tree, true)
    const nodes = [...fragment.childNodes].filter((node) => node.nodeType !== Node.COMMENT_NODE)
    if (nodes.length !== 1 || !(nodes[0] instanceof Element)) {
      throw new TypeError('build requires exactly one element root')
    }
    return nodes[0] as DomElement
  } catch (error) {
    for (const child of fragment.childNodes) disposeTree(child)
    throw error
  }
}

/** Applies props to an unbound element without resetting absent properties. */
export function bind(element: DomElement, props: Props): () => void {
  assertContentProps(props)
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
export function mount(target: DomElement, tree: unknown): () => void {
  activeMounts.get(target)?.dispose()
  clearChildren(target)
  const scope = new EffectScope()
  const start = document.createComment('mount:start')
  const end = document.createComment('mount:end')
  activeMounts.set(target, scope)
  scope.addCleanup(() => disposeBetween(start, end))
  try {
    const fragment = document.createDocumentFragment()
    fragment.appendChild(start)
    appendValue(fragment, tree)
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

// Source is never only in the plain build.
// oxlint-disable-next-line typescript/no-redundant-type-constituents
type RenderValue = VNode | Source | Node | string | number

interface ChildNodes {
  first: Node
  last: Node
}

interface ElementState {
  binding: ElementBinding
  children: MountedChild[]
  htmlScope?: EffectScope
  innerHTML?: unknown
}

interface ElementChild extends ChildNodes {
  kind: 'element'
  value: ElementVNode
  first: DomElement
  last: DomElement
  state: ElementState
}

interface RangeChild extends ChildNodes {
  kind: 'range'
  // oxlint-disable-next-line typescript/no-redundant-type-constituents
  value: ComponentVNode | Source
  first: Comment
  last: Comment
  scope: EffectScope
  children: MountedChild[]
}

interface TextChild extends ChildNodes {
  kind: 'text'
  value: string | number
  first: Text
  last: Text
}

interface OpaqueChild extends ChildNodes {
  kind: 'opaque'
  value: Node
}

type MountedChild = ElementChild | RangeChild | TextChild | OpaqueChild

function appendValue(parent: Node, value: unknown, root = false): void {
  reconcile(parent, [], value, null, root)
}

function normalize(value: unknown, result: RenderValue[] = []): RenderValue[] {
  if (Array.isArray(value)) {
    for (const child of value) normalize(child, result)
  } else if (
    isVNode(value) ||
    (reactivity.REACTIVE_ENABLED && reactivity.isReactive(value)) ||
    value instanceof Node ||
    typeof value === 'string' ||
    typeof value === 'number'
  ) {
    result.push(value)
  }
  return result
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

/** A moved node keeps its binding and leaves its former renderer's ownership. */
function reconcile(
  parent: Node,
  previous: MountedChild[],
  value: unknown,
  end: Node | null,
  root = false,
): MountedChild[] {
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
  for (const child of previous) if (!used.has(child) && belongsTo(child, parent)) removeChild(child)
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
  for (let node: Node | null = child.first; node;) {
    const following: Node | null = node.nextSibling
    disposeTree(node)
    if (node === child.last) break
    node = following
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
  // Only resources belonging to children still here are owned by this binding.
  binding.scope.addCleanup(() => {
    for (const child of state.children) if (belongsTo(child, element)) disposeChild(child)
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
      // oxlint-disable-next-line typescript/no-redundant-type-constituents
      value,
      first: document.createComment('dynamic:start'),
      last: document.createComment('dynamic:end'),
      scope,
      children: [],
    }
    fragment.append(child.first, child.last)
    attach(child.first, scope)
    scope.addCleanup(() => disposeBetween(child.first, child.last))
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
    const text = document.createTextNode(String(value))
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
      if (child.first.nodeValue !== String(value)) child.first.nodeValue = String(value)
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
        for (const child of state.children) if (belongsTo(child, element)) removeChild(child)
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
