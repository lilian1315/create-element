import type { Computed, Signal } from "alien-deepsignals"
import type { BaseElementAttributesTagNameMap, Child, PrefixedElementTag, SpecialAttributes } from "../types"

type MaybeReactive<T> = T | Signal<T> | Computed<T>

type MayBeReactiveObject<T extends object> = {
    [K in keyof T]: MaybeReactive<T[K]>
}

type MayBeReactiveObjectExceptEventHandlers<T extends object> = {
    [K in keyof T]: [K, T[K]] extends [`on${string}`, Function | null] ? T[K] : MaybeReactive<T[K]>
}

export type ReactiveChild = Signal<Child> | Signal<Child[]> | Computed<Child> | Computed<Child[]>;

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

type SpecialAttributesSignal = SpecialAttributes<ClassSignalAttribute, StyleSignalAttribute, DataSignalAttribute, Children>

export type ElementAttributesTagNameMap = {
    [T in PrefixedElementTag]: Partial<MayBeReactiveObjectExceptEventHandlers<BaseElementAttributesTagNameMap[T]> & SpecialAttributesSignal & Readonly<Record<string | symbol, unknown>>>
}
