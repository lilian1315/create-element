import './entry-server?assets=ssr'

import heroImg from './assets/hero.png'
import typescriptLogo from './assets/typescript.svg'
import viteLogo from './assets/vite.svg'
import { createCounter } from './counter.ts'

import { renderToString } from '@lilian1315/create-element/vue-reactivity/server'

export default {
  fetch() {
    return renderToString(
      <main>
        <div class="hero">
          <img src={heroImg} class="base" width={170} height={179} />
          <img src={typescriptLogo} class="framework" alt="TypeScript logo"/>
          <img src={viteLogo} class="vite" alt="Vite logo" />
          <a hr></a>
        </div>
        <p class="eyebrow">SSR · Vue reactivity</p>
        <h1>Rendered on the server</h1>
        <p>This page is a static HTML snapshot without client hydration.</p>
        {createCounter()}
      </main>,
    )
  },
}
