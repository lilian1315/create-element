import type { ComputedRef, Ref } from '@vue/reactivity'
import type { BaseElementAttributesTagNameMap, Child, PrefixedElementTag, SpecialAttributes } from '../types'

type MaybeReactive<T> = T | Ref<T> | ComputedRef<T>

type MayBeReactiveObject<T extends object> = {
  [K in keyof T]: MaybeReactive<T[K]>
}

type MayBeReactiveObjectExceptEventHandlers<T extends object> = {
  [K in keyof T]: [K, T[K]] extends [`on${string}`, ((...args: any[]) => any) | null] ? T[K] : MaybeReactive<T[K]>
}

export type ReactiveChild = Ref<Child> | Ref<Child[]> | ComputedRef<Child> | ComputedRef<Child[]>

export type Children = Child | Child[] | ReactiveChild

type ClassSignalAttribute =
  | MaybeReactive<string>
  | MaybeReactive<string[]>
  | { [className: string]: MaybeReactive<boolean> }

type StyleSignalAttribute =
  | MaybeReactive<string>
  | Partial<MayBeReactiveObject<CSSStyleDeclaration>>

type DataSignalAttribute =
  | DOMStringMap
  | MayBeReactiveObject<DOMStringMap>

export type SpecialAttributesSignal = SpecialAttributes<ClassSignalAttribute, StyleSignalAttribute, DataSignalAttribute, Children>

export type ElementAttributesTagNameMap = {
  [T in PrefixedElementTag]: Partial<MayBeReactiveObjectExceptEventHandlers<BaseElementAttributesTagNameMap[T]> & SpecialAttributesSignal & Readonly<Record<string | symbol, unknown>>>
}
