import type { PrefixedElementTag, VNode, VNodeProps } from './types'
import { createVNode } from './vnode'
export type {
  Component,
  DomElement,
  ElementPrefixedTagNameMap,
  MaybeSource,
  PrefixedElementTag,
  VNodeChild,
  VNodeChildValue,
  VNodeChildren,
  VNodeProps,
  VNodePropsMap,
  VNode,
} from './types'

export const h: <T extends PrefixedElementTag>(type: T, props?: VNodeProps<T> | null) => VNode<T> =
  createVNode
