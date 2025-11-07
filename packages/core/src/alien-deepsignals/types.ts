import type { Computed, Signal } from "alien-deepsignals"
import type { BaseElementAttributesTagNameMap, Child, PrefixedElementTag, SpecialAttributes } from "../types"

type MaybeReactive<T> = T | Signal<T> | Computed<T>

type MayBeReactiveObject<T extends object> = {
    [K in keyof T]: MaybeReactive<T[K]>
}

type ClassSignalAttribute =
    | MaybeReactive<string>
    | MaybeReactive<string[]>
    | (MaybeReactive<string>)[]
    | { [className: string]: MaybeReactive<boolean> | undefined | null }

type StyleSignalAttribute =
    | MaybeReactive<string>
    | Partial<MayBeReactiveObject<CSSStyleDeclaration>>
    | MaybeReactive<Partial<CSSStyleDeclaration>>

type DataSignalAttribute =
    | DOMStringMap
    | MayBeReactiveObject<DOMStringMap>

type SpecialAttributesSignal = SpecialAttributes<ClassSignalAttribute, StyleSignalAttribute, DataSignalAttribute, (Child | Child[] | ReactiveChild | ReactiveChild[])[]>

export type ReactiveChild = Signal<Child> | Signal<Child[]> | Computed<Child> | Computed<Child[]>;

export type MayBeReactiveAttributes<K extends PrefixedElementTag> = Partial<MayBeReactiveObject<BaseElementAttributesTagNameMap[K]> & SpecialAttributesSignal & Readonly<Record<string | symbol, unknown>>>
