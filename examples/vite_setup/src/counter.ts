import { computed, signal } from "alien-deepsignals"
import { el } from "@lmoulanier/el/alien-deepsignals"

export function createCounter() {
  const count = signal(0)
  return el('button', {
      id: 'counter',
      type: 'button',
      onclick: () => {
          console.log('count' + (count.get() + 1))
          console.time('count' + (count.get() + 1))
          count.set(count.get() + 1)
      }
  }, computed(() => `count is ${count.get()}`))
}
