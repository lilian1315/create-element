import { bind as bindCore, build as buildCore, mount as mountCore } from './dom-core'
import type {
  DomElement,
  ElementPrefixedTagNameMap,
  PrefixedElementTag,
  VNodeChild,
  VNodeProps,
  VNode,
} from './types'

export { dispose } from './dom-core'

export type { VNodeChild, VNodeProps } from './types'

export function bind<T extends DomElement>(element: T, props: VNodeProps<NoInfer<T>>): () => void {
  return bindCore(element, props)
}

export function mount(target: DomElement, tree: VNodeChild): () => void {
  return mountCore(target, tree)
}

export function build<T extends PrefixedElementTag>(tree: VNode<T>): ElementPrefixedTagNameMap[T]
export function build<T extends PrefixedElementTag>(tree: VNode): ElementPrefixedTagNameMap[T]
export function build(tree: VNode): DomElement
export function build(tree: VNode): DomElement {
  return buildCore(tree)
}
