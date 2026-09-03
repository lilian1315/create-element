import './style.css'
import heroImg from './assets/hero.png'
import typescriptLogo from './assets/typescript.svg'
import viteLogo from './assets/vite.svg'
import { createCounter } from './counter.ts'

const app = document.querySelector('#app')

if (!app) throw new Error('Missing #app element')

const content = (
  <main>
    <div class="hero">
      <img src={heroImg} class="base" width={170} height={179} />
      <img src={typescriptLogo} class="framework" alt="TypeScript logo"/>
      <img src={viteLogo} class="vite" alt="Vite logo" />
    </div>
    <p class="eyebrow">CSR · Vue reactivity</p>
    <h1>Created in the browser</h1>
    <p>The counter updates the DOM directly from a Vue ref.</p>
    {createCounter()}
  </main>
)

app.replaceChildren(...(Array.isArray(content) ? content : [content]))
