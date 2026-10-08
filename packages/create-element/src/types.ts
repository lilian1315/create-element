import type { DOMTypes, WritableDOMType } from '@lilian1315/elements-writable-properties-types'

import type { Source } from './reactivity-ops'

export type DomElement = HTMLElement | SVGElement | MathMLElement

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

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type VNodeType = PrefixedElementTag | ((props: never) => unknown)

export interface VNode<Type extends VNodeType = VNodeType, Props extends object = object> {
  readonly type: Type
  readonly props: Props
  readonly key: string | number | null
}

export type ElementVNode = VNode<PrefixedElementTag>

export type ComponentVNode = VNode<Exclude<VNodeType, PrefixedElementTag>>

export type VNodeChildValue =
  | VNode
  | Node
  | string
  | number
  | boolean
  | null
  | undefined
  | VNodeChildren

// The array interface keeps recursive children lazy, including in the plain build.
export interface VNodeChildren extends ReadonlyArray<VNodeChild> {}

// Source is replaced by a native generic type in each specialized build.
// oxlint-disable-next-line typescript/no-redundant-type-constituents
export type VNodeChild = VNodeChildValue | Source<VNodeChildValue>

// oxlint-disable-next-line typescript/no-redundant-type-constituents
export type MaybeSource<Value> = Value | Source<Value>

type ReactiveAttributes<Attributes> = {
  [Key in keyof Attributes]?: MaybeSource<Attributes[Key]>
}

type ClassValue = string | string[] | Record<string, MaybeSource<boolean>>
type StyleValue =
  | string
  | (ReactiveAttributes<CSSStyleDeclaration> & {
      [name: `--${string}`]: MaybeSource<string | number | null | undefined>
    })
type DataValue = Record<string, MaybeSource<string | boolean | null | undefined>>

type ContentProps =
  | {
      /**
       * Adds child nodes to the element. When this attribute is used, `innerHTML` must not be provided.
       */
      children?: VNodeChild
      /**
       * Not compatible with `children`.
       */
      innerHTML?: never
    }
  | {
      /**
       * Sets the innerHTML of the element. When this attribute is used, `children` must not be provided.
       * Attention: Using `innerHTML` can expose your application to security risks like Cross-Site Scripting (XSS) attacks if the content is not properly sanitized.
       * When this attribute is used, `children` must not be provided.
       */
      innerHTML?: MaybeSource<string>
      /**
       * Not compatible with `innerHTML`.
       */
      children?: never
    }

type SpecialProps<Element extends DomElement> = {
  key?: string | number
  /**
   * Add class to the element. Can be provided in multiple formats:
   * - A string with space-separated class names: `"class1 class2"`
   * - An array of class names: `["class1", "class2"]`
   * - An object where keys are class names and values are booleans indicating whether to include the class: `{ "class1": true, "class2": false }`
   */
  class?: MaybeSource<ClassValue>
  style?: MaybeSource<StyleValue>
  data?: MaybeSource<DataValue>
  ref?: (element: Element) => void | (() => void)
}

export type VNodeProps<T extends PrefixedElementTag | DomElement> = Prettify<
  ReactiveAttributes<
    T extends PrefixedElementTag
      ? BaseElementAttributesTagNameMap[T]
      : WritableDOMType<Extract<T, DomElement>>
  > &
    SpecialProps<
      T extends PrefixedElementTag ? ElementPrefixedTagNameMap[T] : Extract<T, DomElement>
    >
> &
  ContentProps

export type VNodePropsMap = {
  [T in PrefixedElementTag]: VNodeProps<T>
}

export type Component<Props extends object = object> = (props: Props) => VNodeChild
