import type { Reactive } from 'faisceau'
import { effect as nativeEffect, untracked } from 'faisceau'

export { isReactive, untracked } from 'faisceau'

export function get<Value>(source: Reactive<Value>): Value {
  return source.get()
}

export function peek<Value>(source: Reactive<Value>): Value {
  return source.peek()
}

export function effect(run: () => void): () => void {
  return untracked(() => nativeEffect(run))
}

export type Source<Value = unknown> = Reactive<Value>

/** Allows bundlers to eliminate adapter-only paths in the plain build. */
export const REACTIVE_ENABLED = true
