import type { computed, signal } from 'alien-signals'
import type { BaseElementAttributesTagNameMap, Child, PrefixedElementTag, SpecialAttributes } from '../types'

export type Signal<T> = ReturnType<typeof signal<T>>
export type Computed<T> = ReturnType<typeof computed<T>>

type MaybeReactive<T> = T | Signal<T> | Computed<T>

type MayBeReactiveObject<T extends object> = {
  [K in keyof T]: MaybeReactive<T[K]>
}

type MayBeReactiveObjectExceptEventHandlers<T extends object> = {
  [K in keyof T]: [K, T[K]] extends [`on${string}`, ((...args: any[]) => any) | null] ? T[K] : MaybeReactive<T[K]>
}

export type ReactiveChild = Signal<Child> | Signal<Child[]> | Computed<Child> | Computed<Child[]>

export type Children = Child | Child[] | ReactiveChild

type ClassSignalAttribute =
  | MaybeReactive<string>
  | MaybeReactive<string[]>
  | { [className: string]: MaybeReactive<boolean> }

type StyleSignalAttribute =
  | MaybeReactive<string>
  | Partial<MayBeReactiveObject<CSSStyleDeclaration>>

type DataSignalAttribute = MayBeReactiveObject<SpecialAttributes['data']>

type InnerHTMLSignalAttribute = MaybeReactive<string>

export type SpecialAttributesSignal = SpecialAttributes<ClassSignalAttribute, StyleSignalAttribute, DataSignalAttribute, Children, InnerHTMLSignalAttribute>

export type WithChildren<T> = T & {
  /**
   * Adds child nodes to the element. When this attribute is used, `innerHTML` must not be provided.
   */
  children?: SpecialAttributesSignal['children']
  innerHTML?: never
}

export type WithInnerHTML<T> = T & {
  /**
   * Sets the innerHTML of the element. When this attribute is used, `children` must not be provided.
   * Attention: Using `innerHTML` can expose your application to security risks like Cross-Site Scripting (XSS) attacks if the content is not properly sanitized.
   */
  innerHTML?: InnerHTMLSignalAttribute
  children?: never
}

export type ElementAttributesTagNameMap = {
  [T in PrefixedElementTag]: Partial<MayBeReactiveObjectExceptEventHandlers<BaseElementAttributesTagNameMap[T]> & SpecialAttributesSignal & Readonly<Record<string | symbol, unknown>>>
}
