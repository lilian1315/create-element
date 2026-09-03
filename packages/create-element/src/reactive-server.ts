import type { ReactivityAdapter } from './reactivity'
import { renderToStringWithResolver } from './server/render-to-string'

export function renderReactiveToString<Source>(
  adapter: ReactivityAdapter<Source>,
  children: unknown,
): string {
  return renderToStringWithResolver(children, (value) => resolveReactiveSource(adapter, value))
}

function resolveReactiveSource<Source>(
  adapter: ReactivityAdapter<Source>,
  value: unknown,
): unknown {
  return adapter.isReactive(value) ? resolveReactiveSource(adapter, adapter.peek(value)) : value
}
