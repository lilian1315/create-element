import { h } from '@lilian1315/create-element/alien-deepsignals'
import { News } from './news'
import '../style.css'

const root = document.querySelector<HTMLDivElement>('#app')!

root.appendChild(h('div', { children: News() }))
