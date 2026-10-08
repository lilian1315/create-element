import { effect as nativeEffect, isComputed, isSignal, setActiveSub } from 'alien-signals'
import type { computed, signal } from 'alien-signals'

type Signal<T> = ReturnType<typeof signal<T>>
type Computed<T> = ReturnType<typeof computed<T>>

type AlienReactive<T> = Signal<T> | Computed<T>

export function isReactive(value: unknown): value is AlienReactive<unknown> {
  return isCallable(value) && (isSignal(value) || isComputed(value))
}

export function get<Value>(source: AlienReactive<Value>): Value {
  return source()
}

export function peek<Value>(source: AlienReactive<Value>): Value {
  return untracked(() => source())
}

export function effect(run: () => void): () => void {
  return untracked(() => nativeEffect(run))
}

function isCallable(value: unknown): value is () => unknown {
  return typeof value === 'function'
}

export function untracked<Value>(run: () => Value): Value {
  const previous = setActiveSub(void 0)
  try {
    return run()
  } finally {
    setActiveSub(previous)
  }
}

export type Source<Value = unknown> = Signal<Value> | Computed<Value>

/** Allows bundlers to eliminate adapter-only paths in the plain build. */
export const REACTIVE_ENABLED = true
