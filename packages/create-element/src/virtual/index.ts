import type {
  DomElement,
  PrefixedElementTag,
  Prettify,
  WithoutInnerHTML,
  WithoutChildren,
} from '../types'
import type { FunctionComponent, VNode, VNodeChildren, VNodePropsTagNameMap } from './types'
import { virtualChildrenToNodes } from './utils'
import { createVNodeObject } from './vnode'

/**
 * Creates a VNode with type-safe props.
 * @param type Element tag name, optionally prefixed with `svg:` or `math:`, or a function component.
 * @param props Optional props including `class`, `style`, `data`, and `innerHTML` helpers.
 */
export function createVNode<T extends PrefixedElementTag>(
  type: T,
  props: Prettify<WithoutChildren<VNodePropsTagNameMap[T]>>,
): VNode<T, Prettify<VNodePropsTagNameMap[T]>>
/**
 * Creates a VNode with type-safe props and children.
 * Children arguments are appended after `props.children`, matching `createElement` behavior.
 */
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
  type: PrefixedElementTag | ((props: never) => VNodeChildren),
  props?: object | null,
  ...children: VNodeChildren[]
): VNode {
  return createVNodeObject(type, props, children)
}

/** Shorthand alias for {@link createVNode}. */
export const h = createVNode

/** Replaces a DOM target's contents with a virtual tree. */
export function mount(target: DomElement, children: VNodeChildren): void {
  target.replaceChildren(...virtualChildrenToNodes(children))
}

export { createElementFromVNode } from './utils'
