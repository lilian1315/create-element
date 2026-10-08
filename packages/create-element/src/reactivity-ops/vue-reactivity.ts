import type { Ref } from '@vue/reactivity'
import { effect as nativeEffect, pauseTracking, resetTracking, stop } from '@vue/reactivity'

export { isRef as isReactive } from '@vue/reactivity'

export function get<Value>(source: Ref<Value>): Value {
  return source.value
}

export function peek<Value>(source: Ref<Value>): Value {
  return untracked(() => source.value)
}

export function untracked<Value>(run: () => Value): Value {
  pauseTracking()
  try {
    return run()
  } finally {
    resetTracking()
  }
}

export function effect(run: () => void): () => void {
  const runner = nativeEffect(run)
  return () => stop(runner)
}

export type Source<Value = unknown> = Ref<Value>

/** Allows bundlers to eliminate adapter-only paths in the plain build. */
export const REACTIVE_ENABLED = true
