import type {
  ElementAttributesTagNameMap,
  PrefixedElementTag,
  Prettify,
  SpecialAttributes,
} from '../types'

export type FunctionComponent<Props extends object = object> = (props: Props) => VNodeChildren

export type VNodeType = PrefixedElementTag | ((props: never) => unknown)

export interface VNode<Type extends VNodeType = VNodeType, Props extends object = object> {
  readonly type: Type
  readonly props: Props
  readonly key: string | number | null
  readonly constructor: undefined
}

export type VNodeChild = VNode | string | number | boolean | null | undefined

export type VNodeChildren = VNodeChild | VNodeChildren[]

export type SpecialVNodeProps<S extends SpecialAttributes = SpecialAttributes> = SpecialAttributes<
  S['class'],
  S['style'],
  S['data'],
  VNodeChildren,
  S['innerHTML']
>

export type VNodePropsTagNameMap = ElementAttributesTagNameMap<VNodeChildren>

export type ElementVNode = {
  [T in PrefixedElementTag]: VNode<T, Prettify<VNodePropsTagNameMap[T]>>
}[PrefixedElementTag]
