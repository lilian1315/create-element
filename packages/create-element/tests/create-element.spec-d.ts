import type { h as hAlienDeepsignals } from '../src/alien-deepsignals/index'
import type { h as hAlienSignals } from '../src/alien-signals/index'
import type { h as hFaisceau } from '../src/faisceau/index'
import type { h as hCore } from '../src/index'
import type { h as hPreactSignals } from '../src/preact-signals/index'
import type { h as hVueReactivity } from '../src/vue-reactivity/index'
import { describe, expectTypeOf, it } from 'vitest'

type anyFactory =
  | typeof hCore
  | typeof hAlienDeepsignals
  | typeof hAlienSignals
  | typeof hFaisceau
  | typeof hPreactSignals
  | typeof hVueReactivity

describe(`create-element factories`, () => {
  it('cannot be called with innerHTML attribute and children at the same time', () => {
    // @ts-expect-error innerHTML attribute and children attribute cannot be used together
    expectTypeOf<anyFactory>().toBeCallableWith('div', { innerHTML: 'text <span>in span</span>', children: 'text' })

    // @ts-expect-error innerHTML attribute and children property cannot be used together
    expectTypeOf<anyFactory>().toBeCallableWith('div', { innerHTML: 'text <span>in span</span>' }, 'text')
  })
})
