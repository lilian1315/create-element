import { a as PrefixedElementTag, i as ElementFromPrefixedTag, r as ElementAttributes } from "./types-DlSAw10c.js";

//#region src/index.d.ts
declare function el<K extends PrefixedElementTag>(tag: K, attributes?: ElementAttributes<K> | null, ...children: NonNullable<ElementAttributes<K>['children']>): ElementFromPrefixedTag<K>;
//#endregion
export { el };
//# sourceMappingURL=index.d.ts.map