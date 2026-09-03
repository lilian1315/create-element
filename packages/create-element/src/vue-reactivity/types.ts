import type { ComputedRef, Ref, ShallowRef } from '@vue/reactivity'

import type {
  BaseElementAttributesTagNameMap,
  Child,
  PrefixedElementTag,
  SpecialAttributes,
} from '../types'

type MaybeReactive<T> = T | Ref<T> | ComputedRef<T>

export type MayBeReactiveObject<T extends object> = {
  [K in keyof T]: MaybeReactive<T[K]>
}

export type ReactiveChild =
  | Ref<Exclude<Child, Node>>
  | Ref<Exclude<Child, Node>[]>
  | ComputedRef<Exclude<Child, Node>>
  | ComputedRef<Exclude<Child, Node>[]>
  | ShallowRef<Child>
  | ShallowRef<Child[]>

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

export type SpecialAttributesSignal<ChildrenType = Children> = SpecialAttributes<
  ClassSignalAttribute,
  StyleSignalAttribute,
  DataSignalAttribute,
  ChildrenType,
  InnerHTMLSignalAttribute
>

export type ElementAttributesTagNameMap<ChildrenType = Children> = {
  [T in PrefixedElementTag]: Partial<
    MayBeReactiveObject<BaseElementAttributesTagNameMap[T]> &
      SpecialAttributesSignal<ChildrenType> &
      Readonly<Record<string | symbol, unknown>>
  >
}
