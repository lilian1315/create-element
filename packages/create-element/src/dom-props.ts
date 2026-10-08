import { EffectScope } from './effect-scope'
import * as reactivity from './reactivity-ops'
import type { DomElement } from './types'
import { handleAnyAttribute } from './utils'

declare global {
  interface Node {
    [bindingSymbol]?: ElementBinding
  }
}

export type Props = Readonly<Record<string | symbol, unknown>>
type Ref = (element: DomElement) => void | (() => void)
type PropBinding = { value: unknown; scope: EffectScope; reset: () => void }

// Shared across specialized builds so an element cannot acquire two owners.
export const bindingSymbol = Symbol.for('@lilian1315/create-element.binding')

export interface ElementBinding {
  element: DomElement
  scope: EffectScope
  bindings: Map<string | symbol, PropBinding>
  ref?: { value: Ref; scope: EffectScope }
}

export function assertContentProps(props: Props): void {
  if (Reflect.has(props, 'children') && Reflect.has(props, 'innerHTML')) {
    throw new TypeError('children and innerHTML cannot be used together')
  }
}

export function createElementBinding(element: DomElement): ElementBinding {
  if (element[bindingSymbol]) {
    throw new Error('Element already has an active binding; dispose it before binding again')
  }

  const binding: ElementBinding = {
    element,
    scope: new EffectScope(),
    bindings: new Map(),
  }

  element[bindingSymbol] = binding

  binding.scope.addCleanup(() => {
    if (element[bindingSymbol] === binding) delete element[bindingSymbol]
  })

  return binding
}

/** Applies the same property and ref rules to new and existing elements.
 * Content is a separate policy: reconcile, replace, or preserve for future hydration.
 */
export function applyElementProps(
  binding: ElementBinding,
  props: Props,
  applyContent: () => void,
): void {
  assertContentProps(props)
  const { element, bindings } = binding
  for (const [key, previous] of bindings) {
    if (Reflect.has(props, key) && Object.is(previous.value, props[key])) continue
    previous.scope.dispose()
    if (!Reflect.has(props, key) || props[key] == null || isStructuredProp(key)) previous.reset()
    bindings.delete(key)
  }
  const delayed: (string | symbol)[] = []
  for (const key of Reflect.ownKeys(props)) {
    if (key === 'children' || key === 'innerHTML' || key === 'ref' || key === 'key') continue
    if (element instanceof HTMLSelectElement && (key === 'value' || key === 'defaultValue')) {
      delayed.push(key)
    } else {
      bindProp(binding, key, props[key])
    }
  }
  applyContent()
  for (const key of delayed) {
    bindProp(binding, key, props[key])
    // Updating options can reset the selection even when its source is unchanged.
    const value = props[key]
    handleAnyAttribute(
      element,
      'value',
      reactivity.REACTIVE_ENABLED && reactivity.isReactive(value) ? reactivity.peek(value) : value,
    )
  }
  if (binding.ref?.value !== props.ref) {
    binding.ref?.scope.dispose()
    binding.ref = undefined
    if (typeof props.ref === 'function') {
      const value = props.ref as Ref
      const scope = binding.scope.child()
      binding.ref = { value, scope }
      const cleanup = value(element)
      if (typeof cleanup === 'function') scope.addCleanup(cleanup)
    }
  }
}

function isStructuredProp(key: string | symbol): key is 'class' | 'style' | 'data' {
  return key === 'class' || key === 'style' || key === 'data'
}

function bindProp(binding: ElementBinding, key: string | symbol, value: unknown): void {
  if (binding.bindings.has(key)) return
  const scope = binding.scope.child()
  let reset: () => void
  if (isStructuredProp(key)) {
    reset = installStructuredProp(binding.element, key, value, scope)
  } else {
    const domKey =
      key === 'defaultValue' && binding.element instanceof HTMLSelectElement ? 'value' : key
    installProp(binding.element, domKey, value, scope)
    reset = () => resetProp(binding.element, domKey)
  }
  binding.bindings.set(key, { value, scope, reset })
}

function resetProp(element: DomElement, key: string | symbol): void {
  if (typeof key === 'symbol') {
    Reflect.deleteProperty(element, key)
    return
  }
  if (key.startsWith('on')) return
  if (key in element) {
    const fresh = document.createElementNS(element.namespaceURI, element.localName)
    try {
      Reflect.set(element, key, Reflect.get(fresh, key))
    } catch {}
  }
  element.removeAttribute(key)
}

function installProp(
  element: DomElement,
  key: string | symbol,
  value: unknown,
  scope: EffectScope,
): void {
  let previousListener: EventListener | undefined
  const apply = (next: unknown) => {
    if (typeof key === 'string' && key.startsWith('on')) {
      if (previousListener)
        element.removeEventListener(key.slice(2).toLowerCase(), previousListener)
      previousListener = typeof next === 'function' ? (next as EventListener) : undefined
      if (previousListener) element.addEventListener(key.slice(2).toLowerCase(), previousListener)
      return
    }
    handleAnyAttribute(element, key, next)
  }
  if (reactivity.REACTIVE_ENABLED && reactivity.isReactive(value))
    track(scope, () => apply(reactivity.get(value)))
  else apply(value)
  if (typeof key === 'string' && key.startsWith('on')) {
    scope.addCleanup(() => {
      if (previousListener)
        element.removeEventListener(key.slice(2).toLowerCase(), previousListener)
    })
  }
}

function installStructuredProp(
  element: DomElement,
  key: 'class' | 'style' | 'data',
  value: unknown,
  scope: EffectScope,
): () => void {
  const previous = new Set<string>()
  let wholeAttribute = false
  const clear = () => {
    if (wholeAttribute) element.removeAttribute(key)
    for (const name of previous) {
      if (key === 'class') element.classList.remove(name)
      else if (key === 'style') setStyle(element, name, '')
      else delete element.dataset[name]
    }
    wholeAttribute = false
    previous.clear()
  }
  const apply = (source: unknown) => {
    const resolved =
      reactivity.REACTIVE_ENABLED && reactivity.isReactive(source) ? reactivity.get(source) : source
    if (key === 'class' && (typeof resolved === 'string' || Array.isArray(resolved))) {
      clear()
      wholeAttribute = true
      element.setAttribute('class', Array.isArray(resolved) ? resolved.join(' ') : resolved)
      return
    }
    if (key === 'style' && typeof resolved === 'string') {
      clear()
      wholeAttribute = true
      element.setAttribute('style', resolved)
      return
    }
    if (typeof resolved !== 'object' || resolved === null || Array.isArray(resolved)) {
      clear()
      return
    }
    if (wholeAttribute) clear()
    const entries = Object.entries(resolved)
    const nextKeys = new Set(entries.map(([name]) => name))
    for (const name of previous) {
      if (nextKeys.has(name)) continue
      if (key === 'class') element.classList.remove(name)
      else if (key === 'style') setStyle(element, name, '')
      else delete element.dataset[name]
    }
    previous.clear()
    for (const [name, entry] of entries) {
      previous.add(name)
      const next =
        reactivity.REACTIVE_ENABLED && reactivity.isReactive(entry) ? reactivity.get(entry) : entry
      if (key === 'class') element.classList.toggle(name, next === true)
      else if (key === 'style') setStyle(element, name, next)
      else if (next === true) element.dataset[name] = ''
      else if (typeof next === 'string') element.dataset[name] = next
      else delete element.dataset[name]
    }
  }
  if (reactivity.REACTIVE_ENABLED) track(scope, () => apply(value))
  else apply(value)
  return clear
}

function track(scope: EffectScope, run: () => void): void {
  scope.addCleanup(reactivity.effect(run))
}

function setStyle(element: DomElement, name: string, value: unknown): void {
  if (name.startsWith('--')) {
    if (typeof value === 'string' || typeof value === 'number')
      element.style.setProperty(name, String(value))
    else element.style.removeProperty(name)
  } else {
    Reflect.set(element.style, name, value ?? '')
  }
}
