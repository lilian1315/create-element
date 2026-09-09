import { h } from '@lilian1315/create-element/vue-reactivity'
import { ref } from '@vue/reactivity'

export function createCounter() {
  const count = ref(0)

  return h('button', {
    class: 'counter',
    type: 'button',
    onclick() {
      count.value++
    },
    children: ['Count: ', count],
  })
}
