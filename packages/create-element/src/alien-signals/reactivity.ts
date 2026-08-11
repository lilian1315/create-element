import {
  effect as createAlienEffect,
  isComputed as isAlienComputed,
  isSignal as isAlienSignal,
  setActiveSub,
} from 'alien-signals'

import type { ReactivityAdapter } from '../reactivity'
import type { Computed, Signal } from './types'

type AlienReactive<T> = Signal<T> | Computed<T>

export const reactivityAdapter = {
  isReactive(value: unknown): value is AlienReactive<unknown> {
    return isCallable(value) && (isAlienSignal(value) || isAlienComputed(value))
  },

  get<Value>(source: AlienReactive<Value>): Value {
    return source()
  },

  peek<Value>(source: AlienReactive<Value>): Value {
    return untracked(() => source())
  },

  effect(run: () => void) {
    return untracked(() => createAlienEffect(run))
  },
} satisfies ReactivityAdapter<AlienReactive<unknown>>

function isCallable(value: unknown): value is () => unknown {
  return typeof value === 'function'
}

function untracked<T>(run: () => T): T {
  const prevSub = setActiveSub(void 0)
  try {
    return run()
  } finally {
    setActiveSub(prevSub)
  }
}
