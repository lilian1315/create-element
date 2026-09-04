import { createReactiveElementFromVNode, mountReactiveVirtual } from '../../reactive-virtual'
import type {
  DomElement,
  PrefixedElementTag,
  Prettify,
  WithoutChildren,
  WithoutInnerHTML,
} from '../../types'
import type { VNode } from '../../virtual/types'
import { createVNodeObject } from '../../virtual/vnode'
import { reactivityAdapter } from '../reactivity'
import type { FunctionComponent, VNodeChildren, VNodePropsTagNameMap, VNodeType } from './types'

export function createVNode<T extends PrefixedElementTag>(
  type: T,
  props: Prettify<WithoutChildren<VNodePropsTagNameMap[T]>>,
): VNode<T, Prettify<VNodePropsTagNameMap[T]>>
export function createVNode<T extends PrefixedElementTag>(
  type: T,
  props?: Prettify<WithoutInnerHTML<VNodePropsTagNameMap[T]>> | null,
  ...children: VNodeChildren[]
): VNode<T, Prettify<VNodePropsTagNameMap[T]>>
export function createVNode<Props extends object>(
  type: FunctionComponent<Props>,
  props: Props | null,
  ...children: VNodeChildren[]
): VNode
export function createVNode(
  type: VNodeType,
  props?: object | null,
  ...children: VNodeChildren[]
): VNode {
  return createVNodeObject(type, props, children)
}

export const h = createVNode

export function createElementFromVNode<T extends PrefixedElementTag>(
  vnode: VNode<T, Prettify<VNodePropsTagNameMap[T]>>,
): DomElement {
  return createReactiveElementFromVNode(reactivityAdapter, vnode)
}

export function mount(target: DomElement, children: VNodeChildren): () => void {
  return mountReactiveVirtual(reactivityAdapter, target, children)
}
