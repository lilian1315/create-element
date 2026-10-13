/** @jsxImportSource @lilian1315/create-element/preact-signals */

import { h as baseH } from '@lilian1315/create-element'
import { h as deepH } from '@lilian1315/create-element/alien-deepsignals'
import { build as deepBuild } from '@lilian1315/create-element/alien-deepsignals/dom'
import type { JSX as DeepJSX } from '@lilian1315/create-element/alien-deepsignals/jsx-runtime'
import { h as alienH } from '@lilian1315/create-element/alien-signals'
import { build as alienBuild } from '@lilian1315/create-element/alien-signals/dom'
import type { JSX as AlienJSX } from '@lilian1315/create-element/alien-signals/jsx-runtime'
import { h as faisceauH } from '@lilian1315/create-element/faisceau'
import { build as faisceauBuild } from '@lilian1315/create-element/faisceau/dom'
import type { JSX as FaisceauJSX } from '@lilian1315/create-element/faisceau/jsx-runtime'
import { h as preactH } from '@lilian1315/create-element/preact-signals'
import { build as preactBuild } from '@lilian1315/create-element/preact-signals/dom'
import { bind } from '@lilian1315/create-element/preact-signals/dom'
import { h as vueH } from '@lilian1315/create-element/vue-reactivity'
import { build as vueBuild } from '@lilian1315/create-element/vue-reactivity/dom'
import type { JSX as VueJSX } from '@lilian1315/create-element/vue-reactivity/jsx-runtime'
import { computed as preactComputed, signal as preactSignal } from '@preact/signals-core'
import { shallowRef } from '@vue/reactivity'
import { signal as deepSignal } from 'alien-deepsignals'
import { signal as alienSignal } from 'alien-signals'
import { signal as faisceauSignal } from 'faisceau'
import { expectTypeOf, it } from 'vite-plus/test'

it('specializes published build, bind, and JSX types for each integration', () => {
  const deepProps: DeepJSX.IntrinsicElements['button'] = { children: deepSignal(1) }
  const alienProps: AlienJSX.IntrinsicElements['button'] = { children: alienSignal(1) }
  const faisceauProps: FaisceauJSX.IntrinsicElements['button'] = { children: faisceauSignal(1) }
  const vueProps: VueJSX.IntrinsicElements['button'] = { children: shallowRef(1) }

  expectTypeOf(deepBuild(deepH('button', deepProps))).toEqualTypeOf<HTMLButtonElement>()
  expectTypeOf(alienBuild(alienH('button', alienProps))).toEqualTypeOf<HTMLButtonElement>()
  expectTypeOf(faisceauBuild(faisceauH('button', faisceauProps))).toEqualTypeOf<HTMLButtonElement>()
  expectTypeOf(
    preactBuild(preactH('button', { children: preactSignal(1) })),
  ).toEqualTypeOf<HTMLButtonElement>()
  expectTypeOf(vueBuild(vueH('button', vueProps))).toEqualTypeOf<HTMLButtonElement>()

  const button = preactBuild<'button'>(
    <button title={preactSignal('save')}>{preactSignal(1)}</button>,
  )
  expectTypeOf(button).toEqualTypeOf<HTMLButtonElement>()

  bind(button, {
    ref: (element) => {
      expectTypeOf(element).toEqualTypeOf<HTMLButtonElement>()
    },
  })

  // The Source alias must be specialized in h, bind, and JSX declarations.
  const derived = preactComputed(() => 'derived')
  preactH('button', { title: derived, children: derived })
  bind(button, { title: derived })
  const computedTree = <button title={derived}>{derived}</button>
  expectTypeOf(preactBuild<'button'>(computedTree)).toEqualTypeOf<HTMLButtonElement>()

  // @ts-expect-error the base entry has no native reactive source type
  baseH('button', { children: preactSignal(1) })
  // @ts-expect-error the preact h entry must not accept Vue refs
  preactH('button', { children: shallowRef(1) })
  // @ts-expect-error the preact bind entry must not accept Vue refs
  bind(button, { title: shallowRef('vue') })
  // @ts-expect-error JSX uses the same specialized Source type
  const wrongSource = <button>{shallowRef(1)}</button>
  expectTypeOf(wrongSource).toEqualTypeOf<typeof computedTree>()
})
