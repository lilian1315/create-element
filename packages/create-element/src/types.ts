import type { DOMTypes, WritableDOMType } from '@lilian1315/elements-writable-properties-types'

import type { EffectScope } from './effect-scope'
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

// JSX checks each component's actual props; this method signature accepts their
// different prop shapes while still requiring a supported child return value.
export type JSXComponent = { render(props: object): Child }['render']
export type VNodeType = PrefixedElementTag | JSXComponent

export interface VNode<Type extends VNodeType = VNodeType, Properties extends object = Props> {
  readonly type: Type
  readonly props: Properties
  readonly key: string | number | null
}

export type ElementVNode = VNode<PrefixedElementTag>

export type ComponentVNode = VNode<Exclude<VNodeType, PrefixedElementTag>>

export type ChildValue = VNode | Node | string | number | null | undefined | Children

// The array interface keeps recursive children lazy, including in the plain build.
export interface Children extends ReadonlyArray<Child> {}

// Source is replaced by a native generic type in each specialized build.
// oxlint-disable-next-line typescript/no-redundant-type-constituents
export type Child = ChildValue | Source<ChildValue>
export type DOMComponent<Props extends object = object> = (props: Props) => Child

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

type ContentProps<Child> =
  | {
      /**
       * Adds child nodes to the element. When this attribute is used, `innerHTML` must not be provided.
       */
      children?: Child
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

type ElementProperties<T extends PrefixedElementTag | DomElement> = Prettify<
  ReactiveAttributes<
    T extends PrefixedElementTag
      ? BaseElementAttributesTagNameMap[T]
      : WritableDOMType<Extract<T, DomElement>>
  > &
    SpecialProps<
      T extends PrefixedElementTag ? ElementPrefixedTagNameMap[T] : Extract<T, DomElement>
    >
>

export type ElementProps<T extends PrefixedElementTag | DomElement> = ElementProperties<T> &
  ContentProps<Child>
export type ElementPropsMap = { [T in PrefixedElementTag]: ElementProps<T> }
export type VNodeProps<T extends PrefixedElementTag | DomElement> = ElementProperties<T> &
  ContentProps<Child>

export type VNodePropsMap = {
  [T in PrefixedElementTag]: VNodeProps<T>
}

export type Component<Props extends object = object> = (props: Props) => Child

// Source is never only in the plain build.
// oxlint-disable-next-line typescript/no-redundant-type-constituents
export type RenderValue = VNode | Source | Node | string | number

interface ChildNodes {
  first: Node
  last: Node
}

export interface ElementState {
  binding: ElementBinding
  children: MountedChild[]
  htmlScope?: EffectScope
  innerHTML?: unknown
}

export interface ElementChild extends ChildNodes {
  kind: 'element'
  value: ElementVNode
  first: DomElement
  last: DomElement
  state: ElementState
}

export interface RangeChild extends ChildNodes {
  kind: 'range'
  // oxlint-disable-next-line typescript/no-redundant-type-constituents
  value: ComponentVNode | Source
  first: Comment
  last: Comment
  scope: EffectScope
  children: MountedChild[]
}

export interface TextChild extends ChildNodes {
  kind: 'text'
  value: string | number
  first: Text
  last: Text
}

export interface OpaqueChild extends ChildNodes {
  kind: 'opaque'
  value: Node
}

export type MountedChild = ElementChild | RangeChild | TextChild | OpaqueChild

export type Props = Readonly<Record<string | symbol, unknown>>
export type Ref = (element: DomElement) => void | (() => void)

export interface ElementBinding {
  element: DomElement
  scope: EffectScope
  bindings: Map<string | symbol, PropBinding>
  ref?: { value: Ref; scope: EffectScope }
}

export type PropBinding = { value: unknown; scope: EffectScope; reset: () => void }
