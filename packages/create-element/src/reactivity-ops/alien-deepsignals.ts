import type { Computed, Signal } from 'alien-deepsignals'
import { effect as nativeEffect, isComputed, isSignal } from 'alien-deepsignals'

type AlienDeepReactive<T> = Signal<T> | Computed<T>

export { untracked } from 'alien-deepsignals'

export function isReactive(value: unknown): value is AlienDeepReactive<unknown> {
  return isSignal(value) || isComputed(value)
}

export function get<Value>(source: AlienDeepReactive<Value>): Value {
  return source.get()
}

export function peek<Value>(source: AlienDeepReactive<Value>): Value {
  return source.peek()
}

export function effect(run: () => void): () => void {
  const reactiveEffect = nativeEffect(run)
  return () => reactiveEffect.stop()
}

export type Source<Value = unknown> = Signal<Value> | Computed<Value>

/** Allows bundlers to eliminate adapter-only paths in the plain build. */
export const REACTIVE_ENABLED = true
