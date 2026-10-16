import type { PrefixedElementTag, VNode, VNodeProps } from './types'
import { createVNode as _createVNode } from './vnode'
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

export const createVNode: <T extends PrefixedElementTag>(
  type: T,
  props?: VNodeProps<T> | null,
) => VNode<T> = _createVNode
