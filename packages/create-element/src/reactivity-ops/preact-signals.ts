import type { ReadonlySignal } from '@preact/signals-core'
import { Signal } from '@preact/signals-core'

export { effect, untracked } from '@preact/signals-core'

export function isReactive(value: unknown): value is ReadonlySignal<unknown> {
  return value instanceof Signal
}

export function get<Value>(source: ReadonlySignal<Value>): Value {
  return source.value
}

export function peek<Value>(source: ReadonlySignal<Value>): Value {
  return source.peek()
}

export type Source<Value = unknown> = ReadonlySignal<Value>

/** Allows bundlers to eliminate adapter-only paths in the plain build. */
export const REACTIVE_ENABLED = true
