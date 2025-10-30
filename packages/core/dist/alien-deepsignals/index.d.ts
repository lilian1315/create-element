import { a as PrefixedElementTag, i as ElementFromPrefixedTag, n as Child, o as SpecialAttributes, t as BaseElementAttributes } from "../types-DlSAw10c.js";
import { Computed, Signal } from "alien-deepsignals";

//#region src/alien-deepsignals/types.d.ts
type MaybeReactive<T> = T | Signal<T> | Computed<T>;
type MayBeReactiveObject<T extends object> = { [K in keyof T]: MaybeReactive<T[K]> };
type ClassSignalAttribute = MaybeReactive<string> | MaybeReactive<string[]> | (MaybeReactive<string>)[] | {
  [className: string]: MaybeReactive<boolean> | undefined | null;
};
type StyleSignalAttribute = MaybeReactive<string> | Partial<MayBeReactiveObject<CSSStyleDeclaration>> | MaybeReactive<Partial<CSSStyleDeclaration>>;
type DataSignalAttribute = DOMStringMap | MayBeReactiveObject<DOMStringMap>;
type SpecialAttributesSignal = SpecialAttributes<ClassSignalAttribute, StyleSignalAttribute, DataSignalAttribute, (Child | Child[] | ReactiveChild | ReactiveChild[])[]>;
type ReactiveChild = Signal<Child> | Signal<Child[]> | Computed<Child> | Computed<Child[]>;
type MayBeReactiveAttributes<K$1 extends PrefixedElementTag> = Partial<MayBeReactiveObject<BaseElementAttributes<K$1>> & SpecialAttributesSignal>;
//#endregion
//#region src/alien-deepsignals/index.d.ts
declare function el<K$1 extends PrefixedElementTag>(tag: K$1, attributes?: MayBeReactiveAttributes<K$1> | null, ...children: NonNullable<MayBeReactiveAttributes<K$1>['children']>): ElementFromPrefixedTag<K$1>;
//#endregion
export { el };
//# sourceMappingURL=index.d.ts.map