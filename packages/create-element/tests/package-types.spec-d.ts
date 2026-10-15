import { h as deepH } from '@lilian1315/create-element/alien-deepsignals'
import { build as deepBuild } from '@lilian1315/create-element/alien-deepsignals/dom'
import { h as alienH } from '@lilian1315/create-element/alien-signals'
import { build as alienBuild } from '@lilian1315/create-element/alien-signals/dom'
import { h as faisceauH } from '@lilian1315/create-element/faisceau'
import { build as faisceauBuild } from '@lilian1315/create-element/faisceau/dom'
import { h as preactH } from '@lilian1315/create-element/preact-signals'
import { build as preactBuild } from '@lilian1315/create-element/preact-signals/dom'
import { h as vueH } from '@lilian1315/create-element/vue-reactivity'
import { build as vueBuild } from '@lilian1315/create-element/vue-reactivity/dom'
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
