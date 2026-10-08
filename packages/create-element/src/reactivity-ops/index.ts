/** Replaced together with the runtime primitives for each reactive build. */
export type Source<_Value = unknown> = never

export function isReactive(_value: unknown): _value is never {
  return false
}

export function get(_source: never): never {
  throw new TypeError('No reactive source is configured')
}

export function peek(_source: never): never {
  throw new TypeError('No reactive source is configured')
}

export function effect(run: () => void): () => void {
  run()
  return () => {}
}

export function untracked<Value>(run: () => Value): Value {
  return run()
}

/** Allows bundlers to eliminate adapter-only paths in the plain build. */
export const REACTIVE_ENABLED = false
