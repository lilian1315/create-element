import type { Computed, Signal } from 'alien-deepsignals'
import {
  effect as createAlienDeepEffect,
  isComputed as isAlienComputed,
  isSignal as isAlienSignal,
} from 'alien-deepsignals'

import type { ReactivityAdapter } from '../reactivity'

type AlienDeepReactive<T> = Signal<T> | Computed<T>

export const reactivityAdapter = {
  isReactive(value: unknown): value is AlienDeepReactive<unknown> {
    return isAlienSignal(value) || isAlienComputed(value)
  },

  get<Value>(source: AlienDeepReactive<Value>): Value {
    return source.get()
  },

  peek<Value>(source: AlienDeepReactive<Value>): Value {
    return source.peek()
  },

  effect(run: () => void) {
    const reactiveEffect = createAlienDeepEffect(run)
    return () => reactiveEffect.stop()
  },
} satisfies ReactivityAdapter<AlienDeepReactive<unknown>>
