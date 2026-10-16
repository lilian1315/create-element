import { createVNode as deepH } from '@lilian1315/create-element/alien-deepsignals'
import {
  build as deepBuild,
  createElement as deepCreate,
} from '@lilian1315/create-element/alien-deepsignals/dom'
import { createVNode as alienH } from '@lilian1315/create-element/alien-signals'
import {
  build as alienBuild,
  createElement as alienCreate,
} from '@lilian1315/create-element/alien-signals/dom'
import { createVNode as faisceauH } from '@lilian1315/create-element/faisceau'
import {
  build as faisceauBuild,
  createElement as faisceauCreate,
} from '@lilian1315/create-element/faisceau/dom'
import { createVNode as preactH } from '@lilian1315/create-element/preact-signals'
import {
  build as preactBuild,
  createElement as preactCreate,
} from '@lilian1315/create-element/preact-signals/dom'
import { createVNode as vueH } from '@lilian1315/create-element/vue-reactivity'
import {
  build as vueBuild,
  createElement as vueCreate,
} from '@lilian1315/create-element/vue-reactivity/dom'
import { signal as preactSignal } from '@preact/signals-core'
import { shallowRef } from '@vue/reactivity'
import { signal as deepSignal } from 'alien-deepsignals'
import { signal as alienSignal } from 'alien-signals'
import { signal as faisceauSignal } from 'faisceau'
import { expectTypeOf, it } from 'vite-plus/test'

it('specializes published h and build types for each integration', () => {
  expectTypeOf(
    deepBuild(deepH('button', { children: deepSignal(1) })),
  ).toEqualTypeOf<HTMLButtonElement>()
  expectTypeOf(
    alienBuild(alienH('button', { children: alienSignal(1) })),
  ).toEqualTypeOf<HTMLButtonElement>()
  expectTypeOf(
    faisceauBuild(faisceauH('button', { children: faisceauSignal(1) })),
  ).toEqualTypeOf<HTMLButtonElement>()
  expectTypeOf(
    preactBuild(preactH('button', { children: preactSignal(1) })),
  ).toEqualTypeOf<HTMLButtonElement>()
  expectTypeOf(
    vueBuild(vueH('button', { children: shallowRef(1) })),
  ).toEqualTypeOf<HTMLButtonElement>()
})

it('specializes createElement props and return types for every integration', () => {
  expectTypeOf(deepCreate('button', { children: deepSignal(1) })).toEqualTypeOf<HTMLButtonElement>()
  expectTypeOf(
    alienCreate('button', { children: alienSignal(1) }),
  ).toEqualTypeOf<HTMLButtonElement>()
  expectTypeOf(
    faisceauCreate('button', { children: faisceauSignal(1) }),
  ).toEqualTypeOf<HTMLButtonElement>()
  expectTypeOf(
    preactCreate('button', { children: preactSignal(1) }),
  ).toEqualTypeOf<HTMLButtonElement>()
  expectTypeOf(vueCreate('button', { children: shallowRef(1) })).toEqualTypeOf<HTMLButtonElement>()
  // @ts-expect-error native boolean properties require boolean payloads
  deepCreate('input', { checked: deepSignal('yes') })
  // @ts-expect-error native boolean properties require boolean payloads
  alienCreate('input', { checked: alienSignal('yes') })
  // @ts-expect-error native boolean properties require boolean payloads
  faisceauCreate('input', { checked: faisceauSignal('yes') })
  // @ts-expect-error native boolean properties require boolean payloads
  preactCreate('input', { checked: preactSignal('yes') })
  // @ts-expect-error native boolean properties require boolean payloads
  vueCreate('input', { checked: shallowRef('yes') })
})
