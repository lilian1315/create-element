import '../style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { createCounter } from './counter.ts'
import { h } from '@lilian1315/create-element'
import { createTodolist } from './todolist.ts'

document.querySelector<HTMLDivElement>('#app')!.appendChild(h('div', {}, [
  h('a', { href: 'https://vite.dev', target: '_blank' },
    h('img', { src: viteLogo, class: 'logo', alt: 'Vite logo' }),
  ),
  h('a', { href: 'https://www.typescriptlang.org/', target: '_blank' },
    h('img', { src: typescriptLogo, class: 'logo vanilla', alt: 'TypeScript logo' }),
  ),
  h('h1', {}, 'Vite + TypeScript'),
  h('div', { class: 'card' }, createCounter()),
  h('p', { class: 'read-the-docs' }, 'Click on the Vite and TypeScript logos to learn more'),
  createTodolist('MyTodolist')
]))
