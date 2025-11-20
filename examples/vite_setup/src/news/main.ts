import '../style.css'
import { News } from './news'
import { h } from '@lilian1315/create-element/alien-deepsignals';

const root = document.querySelector<HTMLDivElement>('#app')!

root.appendChild(h('div', {children: News()}))