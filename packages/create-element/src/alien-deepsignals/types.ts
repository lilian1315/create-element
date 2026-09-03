import type { Computed, Signal } from 'alien-deepsignals'

import type {
  BaseElementAttributesTagNameMap,
  Child,
  PrefixedElementTag,
  SpecialAttributes,
} from '../types'

type MaybeReactive<T> = T | Signal<T> | Computed<T>

type MayBeReactiveObject<T extends object> = {
  [K in keyof T]: MaybeReactive<T[K]>
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
