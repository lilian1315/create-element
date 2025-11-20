import { h } from '@lilian1315/create-element/alien-deepsignals'
import { computed, signal } from 'alien-deepsignals'

export function createCounter() {
  const count = signal(0)
  return h('button', {
    id: 'counter',
    type: 'button',
    onclick: () => count.set(count.get() + 1),
  }, computed(() => `count is ${count.get()}`))
}
