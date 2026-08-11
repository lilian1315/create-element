import type { ReadonlySignal } from '@preact/signals-core'
import { effect as createPreactEffect, Signal } from '@preact/signals-core'

import type { ReactivityAdapter } from '../reactivity'

export const reactivityAdapter = {
  isReactive(value: unknown): value is ReadonlySignal<unknown> {
    return value instanceof Signal
  },

  get<Value>(source: ReadonlySignal<Value>): Value {
    return source.value
  },

  peek<Value>(source: ReadonlySignal<Value>): Value {
    return source.peek()
  },

  effect(run: () => void) {
    return createPreactEffect(run)
  },
} satisfies ReactivityAdapter<ReadonlySignal<unknown>>
