import type { Ref } from '@vue/reactivity'
import {
  effect as createVueEffect,
  isRef,
  pauseTracking,
  resetTracking,
  stop as stopVueEffect,
} from '@vue/reactivity'

import type { ReactivityAdapter } from '../reactivity'

export const reactivityAdapter = {
  isReactive(value: unknown): value is Ref<unknown> {
    return isRef(value)
  },

  get<Value>(source: Ref<Value>): Value {
    return source.value
  },

  peek<Value>(source: Ref<Value>): Value {
    pauseTracking()

    try {
      return source.value
    } finally {
      resetTracking()
    }
  },

  effect(run: () => void) {
    const runner = createVueEffect(run)
    return () => stopVueEffect(runner)
  },
} satisfies ReactivityAdapter<Ref<unknown>>
