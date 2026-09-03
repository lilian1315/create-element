import type {
  ReactiveFunctionComponent,
  ReactiveVNodeType,
  StaticVNodeChild,
} from '../../reactive-virtual'
import type { ElementAttributesTagNameMap } from '../types'

export type VNodeChild = StaticVNodeChild

export interface ReactiveSource {
  (): unknown
}

export interface ReactiveVNodeChild extends ReactiveSource {
  (): VNodeChild | VNodeChild[]
}

export type VNodeChildren = VNodeChild | VNodeChildren[] | ReactiveVNodeChild

export type FunctionComponent<Props extends object = object> = ReactiveFunctionComponent<
  VNodeChildren,
  Props
>

export type VNodeType = ReactiveVNodeType<VNodeChildren>

export type VNodePropsTagNameMap = ElementAttributesTagNameMap<VNodeChildren>
