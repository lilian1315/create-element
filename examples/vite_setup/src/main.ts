import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { createCounter } from './counter.ts'
import { el } from '@lmoulanier/el'
import { createTodolist } from './todolist.ts'

document.querySelector<HTMLDivElement>('#app')!.appendChild(el('div', {}, [
  el('a', { href: 'https://vite.dev', target: '_blank' },
    el('img', { src: viteLogo, className: 'logo', class: 'asdf', alt: 'Vite logo' }),
  ),
  el('a', { href: 'https://www.typescriptlang.org/', target: '_blank' },
    el('img', { src: typescriptLogo, class: 'logo vanilla', alt: 'TypeScript logo' }),
  ),
  el('h1', {}, 'Vite + TypeScript'),
  el('div', { className: 'card' }, createCounter()),
  el('p', { className: 'read-the-docs' }, 'Click on the Vite and TypeScript logos to learn more'),
  createTodolist('MyTodolist')
]))
