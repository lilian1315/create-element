import type { DOMTypes } from '@lilian1315/elements-writable-properties-types'

export type Child = Node | string | number | null | undefined

export type Children = Child | Child[]

export type DomElement = HTMLElement | SVGElement | MathMLElement

export interface SpecialAttributes<
  ClassAttribute = string | string[] | { [className: string]: boolean },
  StyleAttribute = string | Partial<CSSStyleDeclaration>,
  DataAttribute = { [name: string]: string | boolean | undefined | null },
  ChildrenAttribute = Children,
  InnerHTMLAttribute = string,
> {
  /**
   * Add class to the element. Can be provided in multiple formats:
   * - A string with space-separated class names: `"class1 class2"`
   * - An array of class names: `["class1", "class2"]`
   * - An object where keys are class names and values are booleans indicating whether to include the class: `{ "class1": true, "class2": false }`
   */
  class: ClassAttribute
  style: StyleAttribute
  data: DataAttribute
  /**
   * Adds child nodes to the element. When this attribute is used, `innerHTML` must not be provided.
   */
  children: ChildrenAttribute | ChildrenAttribute[]
  /**
   * Sets the innerHTML of the element. When this attribute is used, `children` must not be provided.
   * Attention: Using `innerHTML` can expose your application to security risks like Cross-Site Scripting (XSS) attacks if the content is not properly sanitized.
   */
  innerHTML: InnerHTMLAttribute
}

export type SVGElementPrefixedTagTagMap = { svg: 'svg' } & {
  [T in keyof Omit<SVGElementTagNameMap, 'svg'> as `svg:${T}`]: T
}

export type MathMLElementPrefixedTagTagMap = { math: 'math' } & {
  [T in keyof Omit<MathMLElementTagNameMap, 'math'> as `math:${T}`]: T
}

export type PrefixedElementTag =
  | keyof HTMLElementTagNameMap
  | keyof HTMLElementDeprecatedTagNameMap
  | keyof SVGElementPrefixedTagTagMap
  | keyof MathMLElementPrefixedTagTagMap

export type BaseElementAttributesTagNameMap = {
  [T in PrefixedElementTag]: T extends keyof SVGElementPrefixedTagTagMap
    ? DOMTypes.SVGElementTagNameMap[SVGElementPrefixedTagTagMap[T]]
    : T extends keyof MathMLElementPrefixedTagTagMap
      ? DOMTypes.MathMLElementTagNameMap[MathMLElementPrefixedTagTagMap[T]]
      : T extends keyof HTMLElementTagNameMap
        ? DOMTypes.HTMLElementTagNameMap[T]
        : T extends keyof HTMLElementDeprecatedTagNameMap
          ? DOMTypes.HTMLElementDeprecatedTagNameMap[T]
          : never
}

export type ElementAttributesTagNameMap<ChildrenType = SpecialAttributes['children']> = {
  [T in PrefixedElementTag]: Partial<
    BaseElementAttributesTagNameMap[T] &
      SpecialAttributes<
        SpecialAttributes['class'],
        SpecialAttributes['style'],
        SpecialAttributes['data'],
        ChildrenType,
        SpecialAttributes['innerHTML']
      > &
      Readonly<Record<string | symbol, unknown>>
  >
}

export type ElementPrefixedTagNameMap = {
  [T in PrefixedElementTag]: T extends keyof SVGElementPrefixedTagTagMap
    ? SVGElementTagNameMap[SVGElementPrefixedTagTagMap[T]]
    : T extends keyof MathMLElementPrefixedTagTagMap
      ? MathMLElementTagNameMap[MathMLElementPrefixedTagTagMap[T]]
      : T extends keyof HTMLElementTagNameMap
        ? HTMLElementTagNameMap[T]
        : T extends keyof HTMLElementDeprecatedTagNameMap
          ? HTMLElementDeprecatedTagNameMap[T]
          : never
}

export type WithoutInnerHTML<T> = T & {
  innerHTML?: never
}

export type WithoutChildren<T> = T & {
  children?: never
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
