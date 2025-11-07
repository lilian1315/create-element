import type { DOMTypes } from "@lmoulanier/elements-writable-properties-types";

export type Child = Node | string | number | null | undefined

export type AnyElement = HTMLElement | SVGElement | MathMLElement

export type SpecialAttributes<
    ClassAttribute = string | string[] | { [className: string]: boolean },
    StyleAttribute = string | Partial<CSSStyleDeclaration>,
    DataAttribute = DOMStringMap,
    Children = (Child | Child[])[]
> = {
    /**
     * Add class to the element. Can be provided in multiple formats:
     * - A string with space-separated class names: `"class1 class2"`
     * - An array of class names: `["class1", "class2"]`
     * - An object where keys are class names and values are booleans indicating whether to include the class: `{ "class1": true, "class2": false }`
     */
    class: ClassAttribute
    /**
     * Add class to the element. Can be provided in multiple formats:
     * - A string with space-separated class names: `"class1 class2"`
     * - An array of class names: `["class1", "class2"]`
     * - An object where keys are class names and values are booleans indicating whether to include the class: `{ "class1": true, "class2": false }`
     *
     * @deprecated Use class instead.
     */
    className: ClassAttribute
    /**
     * Add class to the element. Can be provided in multiple formats:
     * - A string with space-separated class names: `"class1 class2"`
     * - An array of class names: `["class1", "class2"]`
     * - An object where keys are class names and values are booleans indicating whether to include the class: `{ "class1": true, "class2": false }`
     *
     * @deprecated Use class instead.
     */
    classList: ClassAttribute
    style: StyleAttribute
    data: DataAttribute
    children: Children
}

export type PrefixedSVGElementTagNameMap = { 'svg': 'svg' } & {
    [K in keyof Omit<SVGElementTagNameMap, 'svg'> as `svg:${K}`]: K
}

export type PrefixedMathMLElementTagNameMap = { 'math': 'math' } & {
    [K in keyof Omit<MathMLElementTagNameMap, 'math'> as `math:${K}`]: K
}

export type PrefixedElementTag =
    | keyof HTMLElementTagNameMap
    | keyof HTMLElementDeprecatedTagNameMap
    | keyof PrefixedSVGElementTagNameMap
    | keyof PrefixedMathMLElementTagNameMap

export type BaseElementAttributesTagNameMap = {
    [T in PrefixedElementTag]:
    T extends keyof PrefixedSVGElementTagNameMap ? DOMTypes.SVGElementTagNameMap[PrefixedSVGElementTagNameMap[T]]
    : T extends keyof PrefixedMathMLElementTagNameMap ? DOMTypes.MathMLElementTagNameMap[PrefixedMathMLElementTagNameMap[T]]
    : T extends keyof HTMLElementTagNameMap ? DOMTypes.HTMLElementTagNameMap[T]
    : T extends keyof HTMLElementDeprecatedTagNameMap ? DOMTypes.HTMLElementDeprecatedTagNameMap[T]
    : never
}

export type ElementAttributesTagNameMap = {
    [T in PrefixedElementTag]: Partial<BaseElementAttributesTagNameMap[T] & SpecialAttributes & Readonly<Record<string | symbol, unknown>>>
}

export type ElementPrefixedTagNameMap = {
    [T in PrefixedElementTag]:
    T extends keyof PrefixedSVGElementTagNameMap ? SVGElementTagNameMap[PrefixedSVGElementTagNameMap[T]]
    : T extends keyof PrefixedMathMLElementTagNameMap ? MathMLElementTagNameMap[PrefixedMathMLElementTagNameMap[T]]
    : T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T]
    : T extends keyof HTMLElementDeprecatedTagNameMap ? HTMLElementDeprecatedTagNameMap[T]
    : never
}
