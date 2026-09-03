import { renderReactiveToString } from '../../reactive-server'
import { reactivityAdapter } from '../reactivity'
import type { VNodeChildren } from '../virtual/types'

export function renderToString(children: VNodeChildren): string {
  return renderReactiveToString(reactivityAdapter, children)
}
