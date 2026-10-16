import { createVNode } from '@lilian1315/create-element/vue-reactivity'
import { ref } from '@vue/reactivity'

export function createCounter() {
  const count = ref(0)

  return createVNode('button', {
    class: 'counter',
    type: 'button',
    onclick() {
      count.value++
    },
    children: ['Count: ', count],
  })
}
