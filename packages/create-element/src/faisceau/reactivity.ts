import type { Reactive } from 'faisceau'
import {
  effect as createFaisceauEffect,
  isReactive as isFaisceauReactive,
  untracked,
} from 'faisceau'

import type { ReactivityAdapter } from '../reactivity'

export const reactivityAdapter = {
  isReactive(value: unknown): value is Reactive<unknown> {
    return isFaisceauReactive(value)
  },

  get<Value>(source: Reactive<Value>): Value {
    return source.get()
  },

  peek<Value>(source: Reactive<Value>): Value {
    return source.peek()
  },

  effect(run: () => void) {
    return untracked(() => createFaisceauEffect(run))
  },
} satisfies ReactivityAdapter<Reactive<unknown>>
